import json
import logging
import os
import os.path
from typing import List, Dict, Union, Tuple, Any, Optional

import requests
import shutil
import websockets
from requests.auth import HTTPBasicAuth

logger = logging.getLogger(__name__)

Primitive = Union[bool, str, int, float, None]
PrimitiveCollection = Union[Tuple[Primitive], List[Primitive]]


def _get_env(key: str, value: Any):
    return os.environ.get(f'H2O_Q_{key}', value)


_default_internal_address = 'ws://localhost:55556'


class _Config:
    def __init__(self):
        self.internal_address = _get_env('INTERNAL_ADDRESS', _default_internal_address)
        self.external_address = _get_env('EXTERNAL_ADDRESS', self.internal_address)
        self.hub_address = _get_env('ADDRESS', 'http://localhost:55555')
        self.hub_access_key_id: str = _get_env('ACCESS_KEY_ID', 'access_key_id')
        self.hub_access_key_secret: str = _get_env('ACCESS_KEY_SECRET', 'access_key_secret')
        self.shutdown_timeout: int = int(_get_env('SHUTDOWN_TIMEOUT', '3'))  # seconds


_config = _Config()


def configure(
        internal_address: Optional[str] = None,
        external_address: Optional[str] = None,
        hub_address: Optional[str] = None,
        hub_access_key_id: Optional[str] = None,
        hub_access_key_secret: Optional[str] = None,
):
    """
    Configure networking addresses/credentials before use.

    Args:
        internal_address: The local host:port to listen on.
        external_address: The remote host:port of this server.
        hub_address: The host:port of the Q server.
        hub_access_key_id: The access key ID to use while connecting to the Q server.
        hub_access_key_secret: The access key secret to use while connecting to the Q server.
    """
    if internal_address:
        _config.internal_address = internal_address

    if external_address:
        _config.external_address = external_address
    elif internal_address and (_config.external_address == _default_internal_address):
        _config.external_address = internal_address

    if hub_address:
        _config.hub_address = hub_address
    if hub_access_key_id:
        _config.hub_access_key_id = hub_access_key_id
    if hub_access_key_secret:
        _config.hub_access_key_secret = hub_access_key_secret

    global _client
    _client = _BasicAuthClient()


_key_sep = ' '
_content_type_json = {'Content-type': 'application/json'}


def _is_int(x: Any) -> bool: return isinstance(x, int)


def _is_str(x: Any) -> bool: return isinstance(x, str)


def _is_list(x: Any) -> bool: return isinstance(x, (list, tuple))


def _is_primitive(x: Any) -> bool: return x is None or isinstance(x, (bool, str, int, float))


def _guard_primitive(x: Any):
    if not _is_primitive(x):
        raise ValueError('value must be a primitive')


def _are_primitives(xs: Any) -> bool:
    if xs is None:
        return True
    if not _is_list(xs):
        return False
    for x in xs:
        if not _is_primitive(x):
            return False
    return True


def _guard_primitive_list(xs: Any):
    if not _are_primitives(xs):
        raise ValueError('value must be a primitive list or tuple')


def _guard_primitive_dict_values(d: Dict[str, Any]):
    if d:
        for x in d.values():
            _guard_primitive(x)


def _guard_key(key: str):
    if _is_str(key):
        if ' ' in key:
            raise KeyError('keys cannot contain spaces')
    else:
        if not _is_int(key):
            raise KeyError('invalid key type: want str or int')


class ServiceError(Exception):
    pass


DICT = '__kv'


class Expando:
    """
    Represents an object whose members (attributes) can be dynamically added and removed at run time.

    Args:
        args: An optional ``dict`` of attribute-value pairs to initialize the expando instance with.
    """

    def __init__(self, args: Optional[Dict] = None):
        self.__dict__[DICT] = args if isinstance(args, dict) else dict()

    def __getattr__(self, k): return self.__dict__[DICT].get(k)

    def __getitem__(self, k): return self.__dict__[DICT].get(k)

    def __setattr__(self, k, v): self.__dict__[DICT][k] = v

    def __setitem__(self, k, v): self.__dict__[DICT][k] = v

    def __contains__(self, k): return k in self.__dict__[DICT]

    def __delattr__(self, k): del self.__dict__[DICT][k]

    def __delitem__(self, k): del self.__dict__[DICT][k]

    def __repr__(self): return repr(self.__dict__[DICT])

    def __str__(self): return '\n'.join([f'{k} = {repr(v)}' for k, v in self.__dict__[DICT].items()])


def expando_to_dict(e: Expando) -> dict:
    """
    Extract an expando's underlying dictionary.
    Any modifications to the dictionary also affect the original expando.

    Args:
        e: The expando instance.

    Returns:
        The expando's dictionary.

    """
    return e.__dict__[DICT]


def clone_expando(source: Expando, exclude_keys: Optional[Union[list, tuple]] = None,
                  include_keys: Optional[Union[list, tuple]] = None) -> Expando:
    """
    Clone an expando instance. Creates a shallow clone.

    Args:
        source: The expando to clone.
        exclude_keys: Keys to exclude while cloning.
        include_keys: Keys to include while cloning.
    Returns:
        The expando clone.
    """
    return copy_expando(source, Expando(), exclude_keys, include_keys)


def copy_expando(source: Expando, target: Expando, exclude_keys: Optional[Union[list, tuple]] = None,
                 include_keys: Optional[Union[list, tuple]] = None) -> Expando:
    """
    Copy all entries from the source expando instance to the target expando instance.

    Args:
        source: The expando to copy from.
        target: The expando to copy to.
        exclude_keys: Keys to exclude while copying.
        include_keys: Keys to include while copying.
    Returns:
        The target expando.
    """
    if include_keys:
        if exclude_keys:
            for k in include_keys:
                if k not in exclude_keys:
                    target[k] = source[k]
        else:
            for k in include_keys:
                target[k] = source[k]
    else:
        d = expando_to_dict(source)
        if exclude_keys:
            for k, v in d.items():
                if k not in exclude_keys:
                    target[k] = v
        else:
            for k, v in d.items():
                target[k] = v

    return target


PAGE = '__page__'
KEY = '__key__'


def _set_op(o, k, v):
    _guard_key(k)
    k = getattr(o, KEY) + _key_sep + str(k)
    if isinstance(v, Data):
        op = v.dump()
        op['k'] = k
    else:
        op = dict(k=k, v=v)
    return op


def _can_dump(x: Any):
    return hasattr(x, 'dump') and callable(x.dump)


def _dump(xs: Any):
    if isinstance(xs, (list, tuple)):
        return [_dump(x) for x in xs]
    elif isinstance(xs, dict):
        return {k: _dump(v) for k, v in xs.items()}
    elif _can_dump(xs):
        return xs.dump()
    else:
        return xs


class Ref:
    """
    Represents a local reference to an element on a `h2o_q.core.Page`.
    Any changes made to this local reference are tracked and sent to the remote Q server when the page is saved.
    """

    def __init__(self, page: 'PageBase', key: str):
        self.__dict__[PAGE] = page
        self.__dict__[KEY] = key

    def __getattr__(self, key):
        _guard_key(key)
        return Ref(getattr(self, PAGE), getattr(self, KEY) + _key_sep + key)

    def __getitem__(self, key):
        _guard_key(key)
        return Ref(getattr(self, PAGE), getattr(self, KEY) + _key_sep + str(key))

    def __setattr__(self, key, value):
        if isinstance(value, Data):
            raise ValueError('Data instances cannot be used in assignments.')
        getattr(self, PAGE)._track(_set_op(self, key, _dump(value)))

    def __setitem__(self, key, value):
        if isinstance(value, Data):
            raise ValueError('Data instances cannot be used in assignments.')
        getattr(self, PAGE)._track(_set_op(self, key, _dump(value)))


class Data:
    """
    Represents a data placeholder. A data placeholder is used to allocate memory on the Q server to store data.

    Args:
        fields: The names of the fields (columns names) in the data, either a list or tuple or string containing space-separated names.
        size: The number of rows to allocate memory for. Positive for fixed buffers, negative for circular buffers and zero for variable length buffers.
        data: Initial data. Must be either a key-row ``dict`` for variable-length buffers OR a row ``list`` for fixed-size and circular buffers.
    """

    def __init__(self, fields: Union[str, tuple, list], size: int = 0, data: Optional[Union[dict, list]] = None):
        self.fields = fields
        self.data = data
        self.size = size

    def dump(self):
        f = self.fields
        d = self.data
        n = self.size
        if d:
            if isinstance(d, dict):
                return dict(m=dict(f=f, d=d))
            else:
                if n < 0:
                    return dict(c=dict(f=f, d=d))
                else:
                    return dict(f=dict(f=f, d=d))
        else:
            if n == 0:
                return dict(m=dict(f=f))
            else:
                if n < 0:
                    return dict(c=dict(f=f, n=-n))
                else:
                    return dict(f=dict(f=f, n=n))


def data(
        fields: Union[str, tuple, list],
        size: int = 0,
        rows: Optional[Union[dict, list]] = None,
        columns: Optional[Union[dict, list]] = None,
        pack=False,
) -> Union[Data, str]:
    """
    Create a `h2o_q.core.Data` instance for associating data with cards.

    ``data(fields, size)`` creates a placeholder for data and allocates memory on the Q server.

    ``data(fields, size, rows)`` creates a placeholder and initializes it with the provided rows.

    If ``pack`` is ``True``, the ``size`` parameter is ignored, and the function returns a packed string representing the data.

    Args:
        fields: The names of the fields (columns names) in the data, either a list or tuple or string containing space-separated names.
        size: The number of rows to allocate memory for. Positive for fixed buffers, negative for circular buffers and zero for variable length buffers.
        rows: The rows in this data.
        columns: The columns in this data.
        pack: True to return a packed string representing the data instead of a `h2o_q.core.Data` placeholder.

    Returns:
        Either a `h2o_q.core.Data` placeholder or a packed string representing the data.
    """
    if _is_str(fields):
        fields = fields.strip()
        if fields == '':
            raise ValueError('fields is empty')
        fields = fields.split()
    if not _is_list(fields):
        raise ValueError('fields must be tuple or list')
    if len(fields) == 0:
        raise ValueError('fields is empty')
    for field in fields:
        if not _is_str(field):
            raise ValueError('field must be str')
        if field == '':
            raise ValueError('field cannot be empty str')

    if pack:
        if rows:
            if not isinstance(rows, list):
                # TODO validate if 2d
                raise ValueError('rows must be a list')
            return 'rows:' + marshal((fields, rows))
        if columns:
            if not isinstance(columns, list):
                # TODO validate if 2d
                raise ValueError('columns must be a list')
            return 'cols:' + marshal((fields, columns))
        raise ValueError('either rows or columns must be provided if pack=True')

    if rows:
        if not isinstance(rows, (list, dict)):
            raise ValueError('rows must be list or dict')

    if not _is_int(size):
        raise ValueError('size must be int')

    return Data(fields, size, rows)


class PageBase:
    """
    Represents a remote page.

    Args:
        url: The URL of the remote page.
    """

    def __init__(self, url: str):
        self.url = url
        self._changes = []

    def add(self, key: str, card: Any) -> Ref:
        """
        Add a card to this page.

        Args:
            key: The card's key. Must uniquely identify the card on the page. Overwrites any other card with the same key.
            card: A card. Use one of the ``ui.*_card()`` to create cards.

        Returns:
            A reference to the added card.
        """
        if key is None:
            raise ValueError('card must have a key')

        if not _is_str(key):
            raise ValueError('key must be str')

        props: Optional[dict] = None

        if isinstance(card, dict):
            props = card
        elif _can_dump(card):
            props = _dump(card)
        if not isinstance(props, dict):
            raise ValueError('card must be dict or implement .dump() -> dict')

        data = []
        bufs = []
        for k, v in props.items():
            if isinstance(v, Data):
                data.append((k, len(bufs)))
                bufs.append(v.dump())

        for k, v in data:
            del props[k]
            props[f'~{k}'] = v

        if len(bufs) > 0:
            self._track(dict(k=key, d=props, b=bufs))
        else:
            self._track(dict(k=key, d=props))

        return Ref(self, key)

    def _track(self, op: dict):
        self._changes.append(op)

    def _diff(self):
        if len(self._changes) == 0:
            return None
        d = marshal(dict(d=self._changes))
        self._changes.clear()
        return d

    def drop(self):
        """
        Delete this page from the remote site. Same as ``del site[url]``.
        """
        self._track({})

    def __setitem__(self, key, card):
        self.add(key, card)

    def __getitem__(self, key: str) -> Ref:
        if not _is_str(key):
            raise ValueError('key must be str')
        return Ref(self, key)

    def __delitem__(self, key: str):
        self._track(dict(k=key))


class Page(PageBase):
    """
    Represents a reference to a remote Q page.

    Args:
        site: The parent site.
        url: The URL of this page.
    """

    def __init__(self, site: 'Site', url: str):
        self.site = site
        super().__init__(url)

    def load(self) -> dict:
        """
        Retrieve the serialized form of this page from the remote site.

        Returns:
            The serialized form of this page
        """
        return self.site.load(self.url)

    def sync(self):
        """
        DEPRECATED: Use `h2o_q.core.Page.save` instead.
        """
        logger.warn('page.sync() is deprecated. Please use page.save() instead.')
        self.save()

    def save(self):
        """
        Save the page. Sends all local changes made to this page to the remote site.
        """
        p = self._diff()
        if p:
            logger.debug(data)
            self.site._save(self.url, p)


class AsyncPage(PageBase):
    """
    Represents a reference to a remote Q page. Similar to `h2o_q.core.Page` except that this class exposes ``async`` methods.


    Args:
        site: The parent site.
        url: The URL of this page.
    """

    def __init__(self, site: 'AsyncSite', url: str):
        self.site = site
        self._ws = site._ws
        super().__init__(url)

    async def load(self) -> dict:
        """
        Retrieve the serialized form of this page from the remote site.

        Returns:
            The serialized form of this page
        """
        return await self.site.load(self.url)

    async def push(self):
        """
        DEPRECATED: Use `h2o_q.core.AsyncPage.save` instead.
        """
        logger.warn('page.push() is deprecated. Please use page.save() instead.')
        await self.save()

    async def save(self):
        """
        Save the page. Sends all local changes made to this page to the remote site.
        """
        p = self._diff()
        if p:
            logger.debug(p)
            await self._ws.send(f'* {self.url} {p}')

    # XXX Broken
    async def pull(self) -> 'Q':
        """
        EXPERIMENTAL. DO NOT USE.
        """
        req = await self._ws.recv()
        return Q(self._ws, req)

    # XXX Broken
    async def poll(self) -> 'Q':
        """
        EXPERIMENTAL. DO NOT USE.
        """
        await self.save()
        return await self.pull()


class _BasicAuthClient:
    def __init__(self):
        self._auth = HTTPBasicAuth(_config.hub_access_key_id, _config.hub_access_key_secret)
        self._secure = False

    def patch(self, url: str, data: Any):
        res = requests.patch(f'{_config.hub_address}{url}', data=data, headers=_content_type_json, auth=self._auth)
        if res.status_code != 200:
            raise ServiceError(f'Request failed (code={res.status_code}): {res.text}')

    def get(self, url: str):
        res = requests.get(f'{_config.hub_address}{url}', headers=_content_type_json, auth=self._auth)
        if res.status_code != 200:
            raise ServiceError(f'Request failed (code={res.status_code}): {res.text}')
        return res.json()

    def upload(self, files: List[str]) -> List[str]:
        # XXX Use aiohttp client for async multipart or streaming upload
        upload_url = f'{_config.hub_address}/_f'
        fs = [('files', (os.path.basename(f), open(f, 'rb'))) for f in files]
        res = requests.post(upload_url, files=fs, auth=self._auth, verify=self._secure)
        if res.status_code == 200:
            return json.loads(res.text)['files']
        raise ServiceError(f'Upload failed (code={res.status_code}): {res.text}')

    def download(self, url: str, path: str) -> str:
        path = os.path.abspath(path)
        # If path is dir, get basename from url
        filepath = os.path.join(path, os.path.basename(url)) if os.path.isdir(path) else path

        with requests.get(f'{_config.hub_address}{url}', stream=True) as r:
            with open(filepath, 'wb') as f:
                shutil.copyfileobj(r.raw, f)

        return filepath

    def unload(self, url: str):
        res = requests.delete(f'{_config.hub_address}{url}')
        if res.status_code == 200:
            return
        raise ServiceError(f'Unload failed (code={res.status_code}): {res.text}')


_client = _BasicAuthClient()


class Site:
    """
    Represents a reference to the remote Q site. A Site instance is used to obtain references to the site's pages.
    """

    def __getitem__(self, url) -> Page:
        return Page(self, url)

    def _save(self, url: str, data: str):
        _client.patch(url, data)

    def load(self, url) -> dict:
        """
        Retrieve data at the given URL, typically the serialized form of a page.

        Args:
            url: The URL to read.

        Returns:
            The serialized page.
        """
        return _client.get(url)

    def upload(self, files: List[str]) -> List[str]:
        """
        Upload local files to the site.

        Args:
            files: A list of file paths of the files to be uploaded..

        Returns:
            A list of remote URLs for the uploaded files, in order.
        """
        return _client.upload(files)

    def download(self, url: str, path: str) -> str:
        """
        Download a file from the site.

        Args:
            url: The URL of the file.
            path: The local directory or file path to download to. If a directory is provided, the original name of the file is retained.

        Returns:
            The path to the downloaded file.
        """
        return _client.download(url, path)

    def unload(self, url: str):
        """
        Delete an uploaded file from the site.

        Args:
            url: The URL of the file to delete.
        """
        _client.unload(url)


class AsyncSite:
    """
    Represents a reference to the remote Q site. Similar to `h2o_q.core.Site` except that this class exposes ``async`` methods.
    """

    def __init__(self, ws: websockets.WebSocketServerProtocol):
        self._ws = ws

    def __getitem__(self, url) -> AsyncPage:
        return AsyncPage(self, url)

    async def load(self, url) -> dict:
        """
        Retrieve data at the given URL, typically the serialized form of a page.

        Args:
            url: The URL to read.

        Returns:
            The serialized page.
        """
        # XXX implement
        return {}

    async def upload(self, files: List[str]) -> List[str]:
        """
        Upload local files to the site.

        Args:
            files: A list of file paths of the files to be uploaded..

        Returns:
            A list of remote URLs for the uploaded files, in order.
        """
        # XXX use non-blocking aiohttp post
        paths = _client.upload(files)
        return paths

    async def download(self, url: str, path: str) -> str:
        """
        Download a file from the site.

        Args:
            url: The URL of the file.
            path: The local directory or file path to download to. If a directory is provided, the original name of the file is retained.
        Returns:
            The path to the downloaded file.
        """
        # XXX use non-blocking aiohttp get
        path = _client.download(url, path)
        return path

    async def unload(self, url: str):
        """
        Delete an uploaded file from the site.

        Args:
            url: The URL of the file to delete.
        """
        # XXX use non-blocking aiohttp get
        _client.unload(url)


site = Site()


def _kv(key: str, index: str, value: Any):
    return dict(k=key, v=value) if index is None or index == '' else dict(k=key, i=index, v=value)


def marshal(d: Any) -> str:
    """
    Marshal to JSON.

    Args:
        d: Any object or value.

    Returns:
        A string containing the JSON-serialized form.
    """
    return json.dumps(d, allow_nan=False, separators=(',', ':'))


def unmarshal(s: str) -> Any:
    """
    Unmarshal a JSON string.

    Args:
        s: A string containing JSON-serialized data.

    Returns:
        The deserialized object or value.
    """
    return json.loads(s)


def pack(data: Any) -> str:
    """
    Pack (compress) the provided value.

    Args:
        data: Any object or value.

    The object or value compressed into a string.
    """
    return 'data:' + marshal(_dump(data))

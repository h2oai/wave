import os
import signal
import pickle
import asyncio
import websockets
import os.path
import json
from urllib.parse import urlparse
from typing import List, Dict, Union, Tuple, Callable, Any, Awaitable, Optional
import requests
from requests.auth import HTTPBasicAuth

Primitive = Union[bool, str, int, float, None]
PrimitiveCollection = Union[Tuple[Primitive], List[Primitive]]


def get_env(key: str, value: Any):
    return os.environ.get(f'TELESYNC_{key}', value)


class Config:
    def __init__(self):
        self.app_address = get_env('APP_ADDRESS', 'ws://localhost:55556')
        self.listen_address = get_env('LISTEN_ADDRESS', 'ws://localhost:55556')
        self.hub_address = get_env('ADDRESS', 'http://localhost:55555')
        self.hub_access_key_id: str = get_env('ACCESS_KEY_ID', 'access_key_id')
        self.hub_access_key_secret: str = get_env('ACCESS_KEY_SECRET', 'access_key_secret')
        self.shutdown_timeout: int = int(get_env('SHUTDOWN_TIMEOUT', '3'))  # seconds


_config = Config()
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


def guard_key(key: str):
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
    Represents an object whose members can be dynamically added and removed at run time.
    """

    def __init__(self, args: Optional[Dict] = None):
        self.__dict__[DICT] = args if isinstance(args, dict) else dict()

    def __getattr__(self, k): return self.__dict__[DICT].get(k)

    def __getitem__(self, k): return self.__dict__[DICT].get(k)

    def __setattr__(self, k, v): self.__dict__[DICT][k] = v

    def __setitem__(self, k, v): self.__dict__[DICT][k] = v

    def __contains__(self, k): return k in self.__dict__[DICT]

    def __repr__(self): return repr(self.__dict__[DICT])

    def __str__(self): return '\n'.join([f'{k} = {repr(v)}' for k, v in self.__dict__[DICT].items()])


def expando_to_dict(e: Expando) -> dict:
    return e.__dict__[DICT]


PAGE = '__page__'
KEY = '__key__'


def _set_op(o, k, v):
    guard_key(k)
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
    def __init__(self, page: 'Page', key: str):
        self.__dict__[PAGE] = page
        self.__dict__[KEY] = key

    def __getattr__(self, key):
        guard_key(key)
        return Ref(getattr(self, PAGE), getattr(self, KEY) + _key_sep + key)

    def __getitem__(self, key):
        guard_key(key)
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


class Page:
    def __init__(self, site: 'Site', url: str):
        self.site = site
        self._ws = site._ws
        self.url = url
        self._changes = []

    def add(self, key: str, card: Any) -> Ref:
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
            props[f'#{k}'] = v

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

    def load(self) -> dict:
        return self.site.load(self.url)

    def drop(self):
        self._track({})

    def sync(self):
        p = self._diff()
        if p:
            self.site._save(self.url, p)

    async def push(self):
        p = self._diff()
        if p:
            await self._ws.send(f'* {self.url} {p}')

    async def pull(self) -> 'Q':
        req = await self._ws.recv()
        return Q(self._ws, req)

    async def poll(self) -> 'Q':
        await self.push()
        return await self.pull()

    def __setitem__(self, key, card):
        self.add(key, card)

    def __getitem__(self, key: str) -> Ref:
        if not _is_str(key):
            raise ValueError('key must be str')
        return Ref(self, key)

    def __delitem__(self, key: str):
        self._track(dict(k=key))


class BasicAuthClient:
    def __init__(self):
        self._auth = HTTPBasicAuth(_config.hub_access_key_id, _config.hub_access_key_secret)

    def patch(self, url: str, data: Any):
        res = requests.patch(f'{_config.hub_address}{url}', data=data, headers=_content_type_json, auth=self._auth)
        if res.status_code != 200:
            raise ServiceError(f'Request failed (code={res.status_code}): {res.text}')

    def get(self, url: str):
        res = requests.get(f'{_config.hub_address}{url}', headers=_content_type_json, auth=self._auth)
        if res.status_code != 200:
            raise ServiceError(f'Request failed (code={res.status_code}): {res.text}')
        return res.json()

    def upload(self, url: str, files: List[str]) -> List[str]:
        fs = [('files', (os.path.basename(f), open(f, 'rb'))) for f in files]
        res = requests.put(f'{_config.hub_address}{url}', files=fs, auth=self._auth)
        if res.status_code == 200:
            return json.loads(res.text)['files']
        raise ServiceError(f'Upload failed (code={res.status_code}): {res.text}')


class Site:
    def __init__(self):
        self._client = BasicAuthClient()
        self._ws: Optional[websockets.WebSocketServerProtocol] = None

    def _save(self, url: str, data: str):
        self._client.patch(url, data)

    def load(self, url) -> dict:
        return self._client.get(url)

    def upload(self, files: List[str]):
        return self._client.upload('/f/out', files)

    def __getitem__(self, url) -> Page:
        return Page(self, url)


site = Site()


def _kv(key: str, index: str, value: Any):
    return dict(k=key, v=value) if index is None or index == '' else dict(k=key, i=index, v=value)


def marshal(d: Any): return json.dumps(d, allow_nan=False, separators=(',', ':'))


def unmarshal(s: str): return json.loads(s)


def pack(data: Any): return 'data:' + marshal(_dump(data))


def _session_for(sessions: dict, session_id: str):
    session = sessions.get(session_id, None)
    if session is None:
        session = Expando()
        sessions[session_id] = session
    return session


UNICAST = 'unicast'
MULTICAST = 'multicast'
BROADCAST = 'broadcast'


class Q:
    def __init__(
            self,
            mode: str,
            username: str,
            client_id: str,
            route: str,
            app_state: Expando,
            session_state: Expando,
            client_state: Expando,
            args: Expando,
    ):
        self.site = site
        self.page = site[client_id if mode == UNICAST else username if mode == MULTICAST else route]
        self.app = app_state
        self.session = session_state
        self.client = client_state
        self.args = args
        self.username = username
        self.route = route

    async def sleep(self, delay):
        await asyncio.sleep(delay)


HandleAsync = Callable[[Q], Awaitable[Any]]
WebAppState = Tuple[Expando, Dict[str, Expando], Dict[str, Expando]]


class Server:
    def __init__(self, mode: str, route: str, handle: HandleAsync):
        self.mode = mode
        self.route = route
        self.handle = handle
        # TODO load from remote store if configured
        self.state: WebAppState = (Expando(), dict(), dict())

    def stop(self):
        # TODO save to remote store if configured
        app_state, sessions, clients = self.state
        state = (
            expando_to_dict(app_state),
            {k: expando_to_dict(v) for k, v in sessions.items()},
            {k: expando_to_dict(v) for k, v in clients.items()},
        )
        pickle.dump(state, open('telesync.state', 'wb'))


_server: Optional[Server] = None


def parse_request(req: str):
    username = ''
    client_id = ''

    # format:
    # u:username\nc:client_id\n\nbody

    head, body = req.split('\n\n', maxsplit=1)
    for line in req.splitlines():
        kv = line.split(':', maxsplit=1)
        if len(kv) == 2:
            k, v = kv
            if k == 'u':
                username = v
            elif k == 'c':
                client_id = v

    return username, client_id, body


async def _serve(ws: websockets.WebSocketServerProtocol, path: str):
    site._ws = ws
    async for req in ws:
        username, client_id, args = parse_request(req)
        app_state, session_state, client_state = _server.state
        await _server.handle(Q(
            mode=_server.mode,
            username=username,
            client_id=client_id,
            route=_server.route,
            app_state=app_state,
            session_state=_session_for(session_state, username),
            client_state=_session_for(client_state, client_id),
            args=Expando(unmarshal(args)),
        ))


async def _start_server(host: Optional[str], port: int, stop_server):
    async with websockets.serve(_serve, host, port):
        await stop_server
        _server.stop()


def listen(
        route: str,
        handle: HandleAsync,
        mode=UNICAST,
):
    global _server
    _server = Server(mode=mode, route=route, handle=handle)

    requests.post(
        _config.hub_address,
        data=marshal(dict(mode=mode, url=route, host=_config.app_address)),
        headers=_content_type_json,
        auth=HTTPBasicAuth(_config.hub_access_key_id, _config.hub_access_key_secret)
    )

    el = asyncio.get_event_loop()
    stop_server = el.create_future()
    el.add_signal_handler(signal.SIGINT, stop_server.set_result, None)
    el.add_signal_handler(signal.SIGTERM, stop_server.set_result, None)
    listen_address = urlparse(_config.listen_address)
    el.run_until_complete(_start_server(listen_address.hostname, listen_address.port, stop_server))

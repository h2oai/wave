# Copyright 2020 H2O.ai, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import json
import logging
import sys
from typing import Callable, List, Dict, Union, Tuple, Any, Optional, IO


logger = logging.getLogger(__name__)

Primitive = Union[bool, str, int, float, None]
PrimitiveCollection = Union[Tuple[Primitive], List[Primitive]]
FileContent = Union[IO[str], IO[bytes], str, bytes]


_key_sep = ' '


def _is_int(x: Any) -> bool: return isinstance(x, int)


def _is_str(x: Any) -> bool: return isinstance(x, str)


def _is_list(x: Any) -> bool: return isinstance(x, (list, tuple))


def _guard_str_key(key: str):
    if not _is_str(key):
        raise KeyError('key must be str')
    if ' ' in key:
        raise KeyError('keys cannot contain spaces')


def _guard_key(key: str):
    if _is_str(key):
        _guard_str_key(key)
    else:
        if not _is_int(key):
            raise KeyError('invalid key type: want str or int')


def _fill_data_buffers(props: Dict, data: list, bufs: list, keys=[], is_form_card=False):
    for k, v in props.items():
        if isinstance(v, Data):
            keys.append(k)
            data.append(('.'.join(keys), len(bufs)))
            bufs.append(v.dump())
            keys.pop()
        elif not is_form_card:
            continue
        elif isinstance(v, list):
            keys.append(k)
            for idx, e in enumerate(v):
                if isinstance(e, dict):
                    keys.append(str(idx))
                    _fill_data_buffers(e, data, bufs, keys, is_form_card)
                    keys.pop()
            keys.pop()
        elif isinstance(v, dict):
            keys.append(k)
            _fill_data_buffers(v, data, bufs, keys, is_form_card)
            keys.pop()


def _del_dict_key(d: dict, keys: List[str]):
    if len(keys) == 1:
        del d[keys[0]]
    else:
        next_key = keys[0]
        key = int(next_key) if next_key.isdigit() else next_key
        _del_dict_key(d[key], keys[1:])



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

    def __str__(self): return ', '.join([f'{k}:{repr(v)}' for k, v in self.__dict__[DICT].items()])


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


def _is_numpy_obj(x: Any) -> bool:
    if 'numpy' in sys.modules:
        np = sys.modules['numpy']
        if isinstance(x, (np.ndarray, np.dtype, np.integer, np.floating)):
            return True
    return False


def _dump(xs: Any):
    if _is_numpy_obj(xs):
        raise ValueError('NumPy objects are not serializable by Wave')

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
    Represents a local reference to an element on a `h2o_wave.core.Page`.
    Any changes made to this local reference are tracked and sent to the remote Wave server when the page is saved.
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

    def __iadd__(self, value):
        if not getattr(self, KEY).endswith('data'):
            raise ValueError('+= can only be used on list data buffers.')
        page = getattr(self, PAGE)
        page._track(_set_op(self, '__append__', _dump(value)))
        page._skip_next_track = True


class Data:
    """
    Represents a data placeholder. A data placeholder is used to allocate memory on the Wave server to store data.

    Args:
        fields: The names of the fields (columns names) in the data, either a list or tuple or string containing space-separated names.
        size: The number of rows to allocate memory for. Positive for fixed buffers, negative for cyclic buffers and zero for variable length buffers.
        data: Initial data. Must be either a key-row ``dict`` for variable-length buffers OR a row ``list`` for fixed-size and cyclic buffers.
        t: Buffer type. One of 'list', 'map', 'cyclic' or 'fixed'. Overrides the buffer type inferred from the size.
    """

    def __init__(self, fields: Union[str, tuple, list], size: int = 0, data: Optional[Union[dict, list]] = None, t: Optional[str] = None):
        self.fields = fields
        self.data = data
        self.size = size
        self.type = t

    def dump(self):
        f = self.fields
        d = self.data
        n = self.size
        t = self.type
        if d:
            if t == 'list':
                return dict(l=dict(f=f, d=d))
            if t == 'map' or isinstance(d, dict):
                return dict(m=dict(f=f, d=d))
            if t == 'cyclic' or n < 0:
                return dict(c=dict(f=f, d=d))
            return dict(f=dict(f=f, d=d))
        else:
            if t == 'list':
                return dict(l=dict(f=f, n=n))
            if t == 'map' or n == 0:
                return dict(m=dict(f=f))
            if t == 'cyclic' or n < 0:
                return dict(c=dict(f=f, n=-n))
            return dict(f=dict(f=f, n=n))


def data(
        fields: Union[str, tuple, list],
        size: int = 0,
        rows: Optional[Union[dict, list]] = None,
        columns: Optional[Union[dict, list]] = None,
        pack=False,
        t: Optional[str] = None,
) -> Union[Data, str]:
    """
    Create a `h2o_wave.core.Data` instance for associating data with cards.

    ``data(fields, size)`` creates a placeholder for data and allocates memory on the Wave server.

    ``data(fields, size, rows)`` creates a placeholder and initializes it with the provided rows.

    If ``pack`` is ``True``, the ``size`` parameter is ignored, and the function returns a packed string representing the data.

    Args:
        fields: The names of the fields (columns names) in the data, either a list or tuple or string containing space-separated names.
        size: The number of rows to allocate memory for. Positive for fixed buffers, negative for cyclic buffers and zero for variable length buffers.
        rows: The rows in this data.
        columns: The columns in this data.
        pack: True to return a packed string representing the data instead of a `h2o_wave.core.Data` placeholder.
        t: Buffer type. One of 'list', 'map', 'cyclic' or 'fixed'. Overrides the buffer type inferred from the size.

    Returns:
        Either a `h2o_wave.core.Data` placeholder or a packed string representing the data.
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
    elif columns:  # transpose to rows
        # TODO issue warning: better for caller to use pack=True
        n = len(columns[0])
        rows = []
        for i in range(n):
            rows.append([c[i] for c in columns])

    if not _is_int(size):
        raise ValueError('size must be int')

    return Data(fields, size, rows, t)


class PageBase:
    """
    Represents a remote page.

    Args:
        url: The URL of the remote page.
    """

    def __init__(self):
        self._changes = []
        # HACK: Overloading += operator makes unnecessary __setattr__ call. Skip it to prevent redundant ops.
        self._skip_next_track = False

    def add(self, key: str, card: Any) -> Ref:
        """
        Add a card to this page.

        Args:
            key: The card's key. Must uniquely identify the card on the page. Overwrites any other card with the same key.
            card: A card. Use one of the ``ui.*_card()`` to create cards.

        Returns:
            A reference to the added card.
        """
        _guard_str_key(key)

        props: Optional[dict] = None

        if isinstance(card, dict):
            props = card
        elif _can_dump(card):
            props = _dump(card)
        if not isinstance(props, dict):
            raise ValueError('card must be dict or implement .dump() -> dict')

        data = []
        bufs = []

        _fill_data_buffers(props, data, bufs, [], props.get('view') == 'form')

        for k, v in data:
            _del_dict_key(props, k.split('.'))
            props[f'~{k}'] = v

        if len(bufs) > 0:
            self._track(dict(k=key, d=props, b=bufs))
        else:
            self._track(dict(k=key, d=props))

        return Ref(self, key)

    def _track(self, op: dict):
        if self._skip_next_track:
            self._skip_next_track = False
            return
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
        _guard_str_key(key)
        return Ref(self, key)

    def __delitem__(self, key: str):
        _guard_str_key(key)
        self._track(dict(k=key))


class AsyncPage(PageBase):
    """
    Represents a reference to a Wave page.
    """
    def __init__(self, send: Optional[Callable] = None):
        self.send = send
        super().__init__()

    async def save(self):
        """
        Save the page. Sends all local changes made to this page to the browser.
        """
        p = self._diff()
        if p:
            logger.debug(p)
            await self.send(p)

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

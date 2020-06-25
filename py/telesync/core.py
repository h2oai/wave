import time
import os
import signal
import pickle
import asyncio
import os.path
import json
from urllib.parse import urlparse
from typing import List, Dict, Union, Tuple, Callable, Any, Awaitable, Optional
from functools import partial

import tornado.escape
import tornado.httpserver
import tornado.ioloop
import tornado.locks
import tornado.options
import tornado.web
from tornado.httpclient import AsyncHTTPClient, HTTPClient, HTTPRequest

Primitive = Union[bool, str, int, float, None]
PrimitiveCollection = Union[Tuple[Primitive], List[Primitive]]


def get_env(key: str, value: Any):
    return os.environ.get(f'TELESYNC_{key}', value)


class Config:
    def __init__(self):
        self.app_address = get_env('APP_ADDRESS', 'http://localhost:55556')
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
            await self.site._save_async(self.url, p)

    def __setitem__(self, key, card):
        self.add(key, card)

    def __getitem__(self, key: str) -> Ref:
        if not _is_str(key):
            raise ValueError('key must be str')
        return Ref(self, key)

    def __delitem__(self, key: str):
        self._track(dict(k=key))


def _new_patch_request(url: str, body: Any) -> HTTPRequest:
    return HTTPRequest(
        url=f'{_config.hub_address}{url}',
        method='PATCH',
        headers=_content_type_json,
        body=body,
        auth_username=_config.hub_access_key_id,
        auth_password=_config.hub_access_key_secret,
    )


class BasicAuthClient:
    def __init__(self):
        self._client: Optional[HTTPClient] = None
        self._async_client: Optional[AsyncHTTPClient] = None

    def get(self, url: str):
        if not self._client:
            self._client = HTTPClient()
        res = self._client.fetch(HTTPRequest(
            url=f'{_config.hub_address}{url}',
            headers=_content_type_json,
            auth_username=_config.hub_access_key_id,
            auth_password=_config.hub_access_key_secret,
        ))
        if res.code != 200:
            raise ServiceError(f'Request failed (code={res.code}, reason={res.reason}): {res.body}')
        return tornado.escape.json_decode(res.body)

    def patch(self, url: str, data: Any):
        if not self._client:
            self._client = HTTPClient()
        res = self._client.fetch(_new_patch_request(url, data))
        if res.code != 200:
            raise ServiceError(f'Request failed (code={res.code}, reason={res.reason}): {res.body}')

    async def patch_async(self, url: str, data: Any):
        if not self._async_client:
            self._async_client = AsyncHTTPClient()

        res = await self._async_client.fetch(_new_patch_request(url, data))
        if res.code != 200:
            raise ServiceError(f'Request failed (code={res.code}, reason={res.reason}): {res.body}')


class Site:
    def __init__(self):
        self._client = BasicAuthClient()

    def _save(self, url: str, data: str):
        self._client.patch(url, data)

    async def _save_async(self, url: str, data: str):
        await self._client.patch_async(url, data)

    def load(self, url) -> dict:
        return self._client.get(url)

    def __getitem__(self, url) -> Page:
        return Page(self, url)


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


class Q:
    def __init__(
            self,
            route: str,
            username: str,
            app_state: Expando,
            session_state: Expando,
            args: Expando,
    ):
        site = Site()
        self.site = site
        self.page = site[route]
        self.app = app_state
        self.session = session_state
        self.args = args
        self.username = username

    async def sleep(self, delay):
        await asyncio.sleep(delay)


Handler = Callable[[Q], Awaitable[Any]]
WebAppState = Tuple[Expando, dict]


async def noop_async(q: Q): pass


def save_state(state: WebAppState):
    # TODO save to remote store if configured
    app_state, sessions = state
    state = expando_to_dict(app_state), {k: expando_to_dict(v) for k, v in sessions.items()}
    pickle.dump(state, open('telesync.state', 'wb'))


def load_state() -> WebAppState:
    # TODO load from remote store if configured
    return Expando(), dict()


class WebApp(tornado.web.Application):
    def __init__(self, route: str, handle: Handler):
        self.route = route
        self.handle = handle
        self.state = load_state()

        handlers = [(r"/", RequestHandler)]
        settings = dict(
            # static_path=os.path.join(os.path.dirname(__file__), "static"),
            debug=True,
        )
        super(WebApp, self).__init__(handlers, **settings)


class RequestHandler(tornado.web.RequestHandler):
    async def post(self):
        req = self.request
        username = req.headers.get('TELESYNC_USERNAME', '')
        webapp: WebApp = self.application
        app_state, sessions = webapp.state
        session_state = _session_for(sessions, username)
        await webapp.handle(Q(
            route=webapp.route,
            username=username,
            app_state=app_state,
            session_state=session_state,
            args=Expando(tornado.escape.json_decode(req.body)),
        ))
        self.write('')  # TODO catch and return errors


def on_signal(server: tornado.httpserver.HTTPServer, sig, frame):
    io_loop = tornado.ioloop.IOLoop.current()

    def stop(timeout: float):
        now = time.time()

        # Wait for all tasks to complete.
        n_tasks = len([t for t in asyncio.all_tasks() if t is not asyncio.current_task() and not t.done()])
        if now < timeout and n_tasks > 0:
            print(f'Waiting for {n_tasks} tasks to complete...')
            io_loop.add_timeout(now + 1, stop, timeout)
            return

        # Wait for all connections to be closed.
        n_conns = len(server._connections)
        if now < timeout and n_conns > 0:
            print(f'Waiting for {n_conns} connections to close...')
            io_loop.add_timeout(now + 1, stop, timeout)
            return

        print(f'Shutting down ({n_tasks} tasks, {n_conns} connections open) ...')
        io_loop.stop()
        print('Shutdown complete!')

    def shutdown():
        print(f'Shutting down in {_config.shutdown_timeout}s...')
        try:
            stop(time.time() + _config.shutdown_timeout)
        except BaseException as e:
            print(f'Shutdown failed: {str(e)}')

    io_loop.add_callback_from_signal(shutdown)


def _announce_service(route: str):
    http_client = HTTPClient()
    http_client.fetch(HTTPRequest(
        url=_config.hub_address,
        method='POST',
        headers=_content_type_json,
        body=marshal(dict(url=route, host=_config.app_address)),
        auth_username=_config.hub_access_key_id,
        auth_password=_config.hub_access_key_secret,
    ))
    http_client.close()


def listen(
        route: str,
        handler: Handler,
):
    webapp = WebApp(route, handler)
    server = webapp.listen(urlparse(_config.app_address).port)

    signal.signal(signal.SIGTERM, partial(on_signal, server))
    signal.signal(signal.SIGINT, partial(on_signal, server))

    _announce_service(route)

    tornado.ioloop.IOLoop.current().start()  # blocking

    save_state(webapp.state)

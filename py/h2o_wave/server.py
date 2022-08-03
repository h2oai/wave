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

import os
import datetime
import asyncio
from concurrent.futures import Executor

try:
    import contextvars  # Python 3.7+ only.
except ImportError:
    contextvars = None

import logging
import functools
import warnings
import pickle
import traceback
import base64
import binascii
from typing import Dict, Tuple, Callable, Any, Awaitable, Optional
from urllib.parse import urlparse

import uvicorn
import httpx
from starlette.types import Scope, Receive, Send
from starlette.applications import Router
from starlette.routing import Route
from starlette.requests import Request
from starlette.responses import PlainTextResponse
from starlette.background import BackgroundTask

from .core import Expando, expando_to_dict, _config, marshal, _content_type_json, AsyncSite, _get_env, UNICAST, \
    MULTICAST
from .ui import markdown_card

logger = logging.getLogger(__name__)


def _noop(): pass


def _session_for(sessions: dict, session_id: str):
    session = sessions.get(session_id, None)
    if session is None:
        session = Expando()
        sessions[session_id] = session
    return session


class Auth:
    """
    Represents authentication information for a given query context. Carries valid information only if single sign on is enabled.
    """

    def __init__(self, username: str, subject: str, access_token: str, refresh_token: str, session_id: str):
        self.username = username
        """The username of the user."""
        self.subject = subject
        """A unique identifier for the user."""
        self.access_token = access_token
        """The access token of the user."""
        self.refresh_token = refresh_token
        """The refresh token of the user."""
        self._session_id = session_id
        """Session identifier. Do not access, internal use only."""
    
    async def ensure_fresh_token(self) -> Optional[str]:
        """
        Explicitly refresh OIDC tokens when needed, e.g. during long-running background jobs.
        """
        async with httpx.AsyncClient(auth=(_config.hub_access_key_id, _config.hub_access_key_secret), verify=False) as http:
            res = await http.get(_config.hub_address + '_auth/refresh', headers={'Wave-Session-ID': self._session_id}) 

            access_token = res.headers.get('Wave-Access-Token', None)
            refresh_token = res.headers.get('Wave-Refresh-Token', None)
            if access_token and refresh_token:
                self.access_token = access_token
                self.refresh_token = refresh_token
            return access_token


class Query:
    """
    Represents the query context.
    The query context is passed to the `@app` handler function whenever a query
    arrives from the browser (page load, user interaction events, etc.).
    The query context contains useful information about the query, including arguments
    `args` (equivalent to URL query strings) and app-level, user-level and client-level state.
    """

    def __init__(
            self,
            site: AsyncSite,
            mode: str,
            auth: Auth,
            client_id: str,
            route: str,
            app_state: Expando,
            user_state: Expando,
            client_state: Expando,
            args: Expando,
            events: Expando,
    ):
        self.mode = mode
        """The server mode. One of `'unicast'` (default),`'multicast'` or `'broadcast'`."""
        self.site = site
        """A reference to the current site."""
        self.page = site[f'/{client_id}' if mode == UNICAST else f'/{auth.subject}' if mode == MULTICAST else route]
        """A reference to the current page."""
        self.app = app_state
        """A `h2o_wave.core.Expando` instance to hold application-specific state."""
        self.user = user_state
        """A `h2o_wave.core.Expando` instance to hold user-specific state."""
        self.client = client_state
        """An `h2o_wave.core.Expando` instance to hold client-specific state."""
        self.args = args
        """A `h2o_wave.core.Expando` instance containing arguments from the active request."""
        self.events = events
        """A `h2o_wave.core.Expando` instance containing events from the active request."""
        self.username = auth.username
        """The username of the user who initiated the active request. (DEPRECATED: Use q.auth.username instead)"""
        self.route = route
        """The route served by the server."""
        self.auth = auth
        """The authentication / authorization details of the user who initiated this query."""

    async def sleep(self, delay: float, result=None) -> Any:
        """
        Suspend execution for the specified number of seconds.
        Always use `q.sleep()` instead of `time.sleep()` in Wave apps.

        Args:
            delay: Number of seconds to sleep.
            result: Result to return after delay, if any.

        Returns:
            The `result` argument, if any, as is.
        """
        return await asyncio.sleep(delay, result)

    async def exec(self, executor: Optional[Executor], func: Callable, *args: Any, **kwargs: Any) -> Any:
        """
        Execute a function in the background using the specified executor.

        To execute a function in-process, use `q.run()`.

        Args:
            executor: The executor to be used. If None, executes the function in-process.
            func: The function to to be called.
            args: Arguments to be passed to the function.
            kwargs: Keywords arguments to be passed to the function.
        Returns:
            The result of the function call.
        """
        if asyncio.iscoroutinefunction(func):
            return await func(*args, **kwargs)

        loop = asyncio.get_event_loop()

        if contextvars is not None:  # Python 3.7+ only.
            return await loop.run_in_executor(
                executor,
                contextvars.copy_context().run,
                functools.partial(func, *args, **kwargs)
            )

        if kwargs:
            return await loop.run_in_executor(executor, functools.partial(func, *args, **kwargs))

        return await loop.run_in_executor(executor, func, *args)

    async def run(self, func: Callable, *args: Any, **kwargs: Any) -> Any:
        """
        Execute a function in the background, in-process.

        Equivalent to calling `q.exec()` without an executor.

        Args:
            func: The function to to be called.
            args: Arguments to be passed to the function.
            kwargs: Keywords arguments to be passed to the function.

        Returns:
            The result of the function call.
        """
        return await self.exec(None, func, *args, **kwargs)


Q = Query
"""Alias for Query context."""

HandleAsync = Callable[[Q], Awaitable[Any]]
WebAppState = Tuple[Expando, Dict[str, Expando], Dict[str, Expando]]


class _Wave:
    def __init__(self):
        self._http = httpx.AsyncClient(
            auth=(_config.hub_access_key_id, _config.hub_access_key_secret),
            verify=False,
        )

    async def call(self, method: str, **kwargs):
        return await self._http.post(
            _config.hub_address,
            headers=_content_type_json,
            content=marshal({method: kwargs}),
        )


class _App:
    def __init__(self, route: str, handle: HandleAsync, mode=None, on_startup: Optional[Callable] = None,
                 on_shutdown: Optional[Callable] = None):
        self._mode = mode or _config.app_mode
        self._route = route
        self._handle = handle
        self._wave: _Wave = _Wave()
        self._state: WebAppState = _load_state()
        self._site: AsyncSite = AsyncSite()

        logger.info(f'Server Mode: {mode}')
        logger.info(f'Server Route: {route}')
        logger.info(f'App Address: {_config.app_address}')
        logger.info(f'Hub Address: {_config.hub_address}')
        logger.debug(f'Hub Access Key ID: {_config.hub_access_key_id}')
        logger.debug(f'Hub Access Key Secret: {_config.hub_access_key_secret}')

        # ASGI app
        self.app = Router(
            routes=[
                Route('/', endpoint=self._receive, methods=['POST']),
            ],
            on_startup=[
                self._register,
                on_startup or _noop,
            ],
            on_shutdown=[
                self._unregister,
                self._shutdown,
                on_shutdown or _noop,
            ]
        )

    async def _register(self):
        app_address = _get_env('APP_ADDRESS', _config.app_address)
        connection_timeout = _config.hub_connection_timeout
        start_time = datetime.datetime.now()
        logger.debug(f'Registering app at {app_address} ...')
        while True:
            try:
                await self._wave.call(
                    'register_app',
                    mode=self._mode,
                    route=self._route,
                    address=app_address,
                    key_id=_config.app_access_key_id,
                    key_secret=_config.app_access_key_secret,
                )
                logger.debug('Register: success!')
                break
            except httpx.ConnectError as exception:
                logger.debug('Register: failed.')
                current_time = datetime.datetime.now()
                elapsed_time = current_time - start_time
                if elapsed_time.seconds > connection_timeout:
                    logger.debug(f'Register: giving up after retrying for {connection_timeout} seconds')
                    raise exception
                await asyncio.sleep(1)
                logger.debug('Register: retrying...')

    async def _unregister(self):
        logger.debug(f'Unregistering app...')
        try:
            await self._wave.call('unregister_app', route=self._route)
            logger.debug('Unregister: success!')
        # Happens during killing reloader process (dev mode) - server process killed before starlette on_shutdown hook.
        except httpx.ConnectError:
            logger.debug('Could not unregister app due to unreachable server.')

    async def _receive(self, req: Request):
        basic_auth = req.headers.get("Authorization")
        if basic_auth is None:
            return PlainTextResponse(content='Unauthorized', status_code=401)
        try:
            scheme, credentials = basic_auth.split()
            if scheme.lower() != 'basic':
                return PlainTextResponse(content='Unauthorized', status_code=401)
            decoded = base64.b64decode(credentials).decode("ascii")
        except (ValueError, UnicodeDecodeError, binascii.Error) as exc:
            return PlainTextResponse(content='Unauthorized', status_code=401)

        key_id, _, key_secret = decoded.partition(":")
        if key_id != _config.app_access_key_id or key_secret != _config.app_access_key_secret:
            return PlainTextResponse(content='Unauthorized', status_code=401)

        client_id = req.headers.get('Wave-Client-ID')
        subject = req.headers.get('Wave-Subject-ID')
        username = req.headers.get('Wave-Username')
        access_token = req.headers.get('Wave-Access-Token')
        refresh_token = req.headers.get('Wave-Refresh-Token')
        session_id = req.headers.get('Wave-Session-ID')
        auth = Auth(username, subject, access_token, refresh_token, session_id)
        args = await req.json()

        return PlainTextResponse('', background=BackgroundTask(self._process, client_id, auth, args))

    async def _process(self, client_id: str, auth: Auth, args: dict):
        logger.debug(f'user: {auth.username}, client: {client_id}')
        logger.debug(args)
        app_state, user_state, client_state = self._state
        events_state: Optional[dict] = args.get('', None)
        if isinstance(events_state, dict):
            events_state = {k: Expando(v) for k, v in events_state.items()}
            del args['']
        q = Q(
            site=self._site,
            mode=self._mode,
            auth=auth,
            client_id=client_id,
            route=self._route,
            app_state=app_state,
            user_state=_session_for(user_state, auth.subject),
            client_state=_session_for(client_state, client_id),
            args=Expando(args),
            events=Expando(events_state),
        )
        # noinspection PyBroadException,PyPep8
        try:
            await self._handle(q)
        except:
            logger.exception('Unhandled exception')
            # noinspection PyBroadException,PyPep8
            try:
                q.page.drop()
                # TODO replace this with a custom-designed error display
                q.page['__unhandled_error__'] = markdown_card(
                    box='1 1 12 10',
                    title='Error',
                    content=f'```\n{traceback.format_exc()}\n```',
                )
                await q.page.save()
            except:
                logger.exception('Failed transmitting unhandled exception')

    def _shutdown(self):
        _save_state(self._state)


_CHECKPOINT_DIR_ENV_VAR = 'H2O_WAVE_CHECKPOINT_DIR'


def _to_checkpoint_file_path(d: str) -> str:
    return os.path.join(d, 'h2o_wave.checkpoint')


def _get_checkpoint_file_path() -> Optional[str]:
    d = os.environ.get(_CHECKPOINT_DIR_ENV_VAR)

    if not d:
        return None

    if os.path.exists(d):
        if os.path.isdir(d):
            return _to_checkpoint_file_path(d)
        raise ValueError(f'{_CHECKPOINT_DIR_ENV_VAR} is not a directory: {d}')

    logger.info(f'Creating checkpoint directory {d} ...')
    os.makedirs(d)

    return _to_checkpoint_file_path(d)


def _empty_state() -> WebAppState:
    return Expando(), {}, {}


def _load_state() -> WebAppState:
    f = _get_checkpoint_file_path()
    if not f:
        return _empty_state()

    if not os.path.isfile(f):
        return _empty_state()

    logger.info(f'Loading checkpoint at {f} ...')
    # noinspection PyBroadException,PyPep8
    try:
        with open(f, 'rb') as p:
            app_state, sessions = pickle.load(p)
            return Expando(app_state), {k: Expando(v) for k, v in sessions.items()}, {}
    except Exception as e:
        # Log error and start app with a blank slate
        logger.error(f'Failed loading checkpoint: %s', e)
        return _empty_state()


def _save_state(state: WebAppState):
    f = _get_checkpoint_file_path()
    if not f:
        return

    app_state, sessions, _ = state
    checkpoint = (
        expando_to_dict(app_state),
        {k: expando_to_dict(v) for k, v in sessions.items()},
    )
    logger.info(f'Creating checkpoint at {f} ...')
    with open(f, 'wb') as p:
        pickle.dump(checkpoint, p)


class _Main:
    def __init__(self, app: Optional[_App] = None):
        self._app: Optional[_App] = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        await self._app.app(scope, receive, send)


main = _Main()


def app(route: str, mode=None, on_startup: Optional[Callable] = None,
        on_shutdown: Optional[Callable] = None):
    """
    Indicate that a function is a query handler.

    The function this decorator is applied to must accept exactly one argument that represents the query context,
    of type `Q` or `Query`

    Args:
        route: The route to listen to. e.g. `'/foo'` or `'/foo/bar/baz'`.
        mode: The server mode. One of `'unicast'` (default),`'multicast'` or `'broadcast'`.
        on_startup: A callback to invoke on app startup. Callbacks do not take any arguments, and may be be either standard functions, or async functions.
        on_shutdown: A callback to invoke on app shutdown. Callbacks do not take any arguments, and may be be either standard functions, or async functions.
    """

    def wrap(handle: HandleAsync):
        main._app = _App(route, handle, mode, on_startup, on_shutdown)
        return handle

    return wrap


def listen(route: str, handle: HandleAsync, mode=None):
    """
    Launch an application server.

    Args:
        route: The route to listen to. e.g. `'/foo'` or `'/foo/bar/baz'`.
        handle: The handler function.
        mode: The server mode. One of `'unicast'` (default),`'multicast'` or `'broadcast'`.
    """
    warnings.warn("'listen()' is deprecated. Instead, import 'main' and annotate your 'serve()' function with '@app'.",
                  DeprecationWarning)

    internal_address = urlparse(_config.internal_address)
    logger.info(f'Listening on host "{internal_address.hostname}", port "{internal_address.port}"...')
    uvicorn.run(_Main(_App(route, handle, mode)), host=internal_address.hostname, port=internal_address.port)

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
from typing import Dict, Tuple, Callable, Any, Awaitable, Optional
from urllib.parse import urlparse

import uvicorn
import httpx
from starlette.types import Scope, Receive, Send
from starlette.applications import Router
from starlette.routing import Route, compile_path
from starlette.requests import Request
from starlette.responses import PlainTextResponse
from starlette.background import BackgroundTask

from .core import Expando, expando_to_dict, _config, marshal, unmarshal, _content_type_json, AsyncSite, _get_env, \
    UNICAST, MULTICAST
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

    def __init__(self, username: str, subject: str, access_token: str, refresh_token: str):
        self.username = username
        """The username of the user."""
        self.subject = subject
        """A unique identifier for the user."""
        self.access_token = access_token
        """The access token of the user."""
        self.refresh_token = refresh_token
        """The refresh token of the user."""


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
            username: str,
            client_id: str,
            route: str,
            app_state: Expando,
            user_state: Expando,
            client_state: Expando,
            auth: Auth,
            args: Expando,
            events: Expando,
    ):
        self.mode = mode
        """The server mode. One of `'unicast'` (default),`'multicast'` or `'broadcast'`."""
        self.site = site
        """A reference to the current site."""
        self.page = site[f'/{client_id}' if mode == UNICAST else f'/{username}' if mode == MULTICAST else route]
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
        self.username = username
        """The username of the user who initiated the active request."""
        self.route = route
        """The route served by the server."""
        self.auth = auth
        """The username and subject ID of the authenticated user."""

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
        # TODO load from remote store if configured
        self._wave: _Wave = _Wave()
        self._state: WebAppState = (Expando(), dict(), dict())
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
        logger.debug(f'Registering app at {app_address} ...')
        await self._wave.call('register_app', mode=self._mode, route=self._route, address=app_address)
        logger.debug('Register: success!')

    async def _unregister(self):
        logger.debug(f'Unregistering app...')
        await self._wave.call('unregister_app', route=self._route)
        logger.debug('Unregister: success!')

    async def _receive(self, req: Request):
        b = await req.body()
        return PlainTextResponse('', background=BackgroundTask(self._process, b.decode('utf-8')))

    async def _process(self, query: str):
        username, subject, client_id, access_token, refresh_token, args = _parse_query(query)
        logger.debug(f'user: {username}, client: {client_id}')
        logger.debug(args)
        app_state, user_state, client_state = self._state
        args_state: dict = unmarshal(args)
        events_state: Optional[dict] = args_state.get('', None)
        if isinstance(events_state, dict):
            events_state = {k: Expando(v) for k, v in events_state.items()}
            del args_state['']
        q = Q(
            site=self._site,
            mode=self._mode,
            username=username,
            client_id=client_id,
            route=self._route,
            app_state=app_state,
            user_state=_session_for(user_state, username),
            client_state=_session_for(client_state, client_id),
            auth=Auth(username, subject, access_token, refresh_token),
            args=Expando(args_state),
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
                    box='1 1 -1 -1',
                    title='Error',
                    content=f'```\n{traceback.format_exc()}\n```',
                )
                await q.page.save()
            except:
                logger.exception('Failed transmitting unhandled exception')

    def _shutdown(self):
        # TODO save to remote store if configured
        app_state, sessions, clients = self._state
        state = (
            expando_to_dict(app_state),
            {k: expando_to_dict(v) for k, v in sessions.items()},
            {k: expando_to_dict(v) for k, v in clients.items()},
        )
        pickle.dump(state, open('h2o_wave.state', 'wb'))


def _parse_query(query: str) -> Tuple[str, str, str, str, str, str]:
    username = ''
    subject = ''
    client_id = ''
    access_token = ''
    refresh_token = ''

    # format:
    # u:username\ns:subject\nc:client_id\na:access_token\nr:refresh_token\n\nbody

    head, body = query.split('\n\n', maxsplit=1)
    for line in head.splitlines():
        kv = line.split(':', maxsplit=1)
        if len(kv) == 2:
            k, v = kv
            if k == 'u':
                username = v
            elif k == 's':
                subject = v
            elif k == 'c':
                client_id = v
            elif k == 'a':
                access_token = v
            elif k == 'r':
                refresh_token = v

    return username, subject, client_id, access_token, refresh_token, body


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

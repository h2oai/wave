import socket
import asyncio
import logging
import pickle
import traceback
from typing import Dict, Tuple, Callable, Any, Awaitable, Optional
from urllib.parse import urlparse

import requests
import uvicorn
from starlette.types import Scope, Receive, Send
from starlette.applications import Router
from starlette.routing import WebSocketRoute
from starlette.websockets import WebSocket, WebSocketDisconnect
from requests.auth import HTTPBasicAuth

from .core import Expando, expando_to_dict, _config, marshal, unmarshal, _content_type_json, AsyncSite
from .ui import markdown_card

logger = logging.getLogger(__name__)


def _session_for(sessions: dict, session_id: str):
    session = sessions.get(session_id, None)
    if session is None:
        session = Expando()
        sessions[session_id] = session
    return session


UNICAST = 'unicast'
MULTICAST = 'multicast'
BROADCAST = 'broadcast'


class Auth:
    """
    Represents authentication information for a given query context. Carries valid information only if single sign on is enabled.
    """

    def __init__(self, username: str, subject: str):
        self.username = username
        """The username of the user."""
        self.subject = subject
        """A unique identifier for the user."""


class Query:
    """
    Represents the query context.
    The query context is passed to the `listen()` handler function whenever a query
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
    ):
        self.mode = mode
        """The server mode. One of `'unicast'` (default),`'multicast'` or `'broadcast'`."""
        self.site = site
        """A reference to the current site."""
        self.page = site[client_id if mode == UNICAST else username if mode == MULTICAST else route]
        """A reference to the current page."""
        self.app = app_state
        """A `h2o_wave.core.Expando` instance to hold application-specific state."""
        self.user = user_state
        """A `h2o_wave.core.Expando` instance to hold user-specific state."""
        self.client = client_state
        """An `h2o_wave.core.Expando` instance to hold client-specific state."""
        self.args = args
        """A `h2o_wave.core.Expando` instance containing the active request."""
        self.username = username
        """The username of the user who initiated the active request."""
        self.route = route
        """The route served by the server."""
        self.auth = auth
        """The username and subject ID of the authenticated user."""

    async def sleep(self, delay):
        await asyncio.sleep(delay)


Q = Query
"""Alias for Query context."""

HandleAsync = Callable[[Q], Awaitable[Any]]
WebAppState = Tuple[Expando, Dict[str, Expando], Dict[str, Expando]]


class _App:
    def __init__(self, route: str, handle: HandleAsync, mode=UNICAST):
        self._mode = mode
        self._route = route
        self._handle = handle
        # TODO load from remote store if configured
        self._state: WebAppState = (Expando(), dict(), dict())
        self._site: Optional[AsyncSite] = None

        # internal_address = urlparse(_config.internal_address)
        # if internal_address.port == 0:
        #     _config.internal_address = f'ws://127.0.0.1:{_get_unused_port()}'
        #     _config.external_address = _config.internal_address

        logger.info(f'Server Mode: {mode}')
        logger.info(f'Server Route: {route}')
        logger.info(f'External Address: {_config.external_address}')
        logger.info(f'Hub Address: {_config.hub_address}')
        logger.debug(f'Hub Access Key ID: {_config.hub_access_key_id}')
        logger.debug(f'Hub Access Key Secret: {_config.hub_access_key_secret}')
        logger.info(f'Shutdown Timeout [seconds]: {_config.shutdown_timeout}')

        self._router = Router(
            routes=[
                WebSocketRoute('/', self._receive),
            ],
            on_startup=[
                self._announce,
            ],
            on_shutdown=[
                self._shutdown,
            ]
        )

    def _announce(self):
        logger.debug(f'Announcing server at {_config.external_address} ...')
        requests.post(
            _config.hub_address,
            data=marshal(dict(mode=self._mode, url=self._route, host=_config.external_address)),
            headers=_content_type_json,
            auth=HTTPBasicAuth(_config.hub_access_key_id, _config.hub_access_key_secret)
        )
        logger.debug('Announcement: success!')

    async def _receive(self, ws: WebSocket):
        await ws.accept()
        self._site = AsyncSite(ws)
        try:
            while True:
                await self._process(await ws.receive_text())
        except WebSocketDisconnect:
            await ws.close()

    async def _process(self, query: str):
        username, subject, client_id, args = _parse_query(query)
        logger.debug(f'user: {username}, client: {client_id}')
        logger.debug(args)
        app_state, user_state, client_state = self._state
        q = Q(
            site=self._site,
            mode=self._mode,
            username=username,
            client_id=client_id,
            route=self._route,
            app_state=app_state,
            user_state=_session_for(user_state, username),
            client_state=_session_for(client_state, client_id),
            auth=Auth(username, subject),
            args=Expando(unmarshal(args)),
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


def _parse_query(query: str) -> Tuple[str, str, str, str]:
    username = ''
    subject = ''
    client_id = ''

    # format:
    # u:username\ns:subject\nc:client_id\n\nbody

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

    return username, subject, client_id, body


def _get_unused_port() -> int:
    port = 8000
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)):
                return port
        port += 1


class _Main:
    def __init__(self, app: Optional[_App] = None):
        self._app: Optional[_App] = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        await self._app._router(scope, receive, send)


main = _Main()


def app(route: str, mode=UNICAST):
    def wrap(handle: HandleAsync):
        main._app = _App(route, handle, mode)
        return handle

    return wrap


def listen(route: str, handle: HandleAsync, mode=UNICAST):
    """
    Launch an application server.

    Args:
        route: The route to listen to. e.g. `'/foo'` or `'/foo/bar/baz'`.
        handle: The handler function.
        mode: The server mode. One of `'unicast'` (default),`'multicast'` or `'broadcast'`.
    """
    main = _Main(_App(route, handle, mode))

    internal_address = urlparse(_config.internal_address)
    logger.info(f'Listening on host "{internal_address.hostname}", port "{internal_address.port}"...')
    uvicorn.run(main, host=internal_address.hostname, port=internal_address.port)

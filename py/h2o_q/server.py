import asyncio
import logging
import pickle
import signal
import traceback
from typing import Dict, Tuple, Callable, Any, Awaitable, Optional
from urllib.parse import urlparse

import requests
import websockets
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


class Q:
    """
    Represents the application context.
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
            args: Expando,
    ):
        self.mode = mode
        """The server mode. One of `'unicast'` (default),`'multicast'` or `'broadcast'`."""
        self.site = site
        """A reference to the current site."""
        self.page = site[client_id if mode == UNICAST else username if mode == MULTICAST else route]
        """A reference to the current page."""
        self.app = app_state
        """A `h2o_q.core.Expando` instance to hold application-specific state."""
        self.user = user_state
        """A `h2o_q.core.Expando` instance to hold user-specific state."""
        self.client = client_state
        """An `h2o_q.core.Expando` instance to hold client-specific state."""
        self.args = args
        """A `h2o_q.core.Expando` instance containing the active request."""
        self.username = username
        """The username of the user who initiated the active request."""
        self.route = route
        """The route served by the server."""

    async def sleep(self, delay):
        await asyncio.sleep(delay)


HandleAsync = Callable[[Q], Awaitable[Any]]
WebAppState = Tuple[Expando, Dict[str, Expando], Dict[str, Expando]]


class _Server:
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
        pickle.dump(state, open('h2o_q.state', 'wb'))


_server: Optional[_Server] = None


def _parse_request(req: str):
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
    site = AsyncSite(ws)
    async for req in ws:
        username, client_id, args = _parse_request(req)
        logger.debug(f'user: {username}, client: {client_id}')
        logger.debug(args)
        app_state, user_state, client_state = _server.state
        q = Q(
            site=site,
            mode=_server.mode,
            username=username,
            client_id=client_id,
            route=_server.route,
            app_state=app_state,
            user_state=_session_for(user_state, username),
            client_state=_session_for(client_state, client_id),
            args=Expando(unmarshal(args)),
        )
        # noinspection PyBroadException,PyPep8
        try:
            await _server.handle(q)
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


async def _start_server(host: Optional[str], port: int, stop_server):
    async with websockets.serve(_serve, host, port):
        await stop_server
        _server.stop()


def listen(route: str, handle: HandleAsync, mode=UNICAST):
    """
    Launch an application server.

    Args:
        route: The route to listen to. e.g. `'/foo'` or `'/foo/bar/baz'`.
        handle: The handler function.
        mode: The server mode. One of `'unicast'` (default),`'multicast'` or `'broadcast'`.
    """
    global _server
    _server = _Server(mode=mode, route=route, handle=handle)

    logger.info(f'Server Mode: {mode}')
    logger.info(f'Server Route: {route}')
    logger.info(f'External Address: {_config.external_address}')
    logger.info(f'Hub Address: {_config.hub_address}')
    logger.debug(f'Hub Access Key ID: {_config.hub_access_key_id}')
    logger.debug(f'Hub Access Key Secret: {_config.hub_access_key_secret}')
    logger.info(f'Shutdown Timeout{_config.shutdown_timeout}')

    logger.debug('Announcing server...')
    requests.post(
        _config.hub_address,
        data=marshal(dict(mode=mode, url=route, host=_config.external_address)),
        headers=_content_type_json,
        auth=HTTPBasicAuth(_config.hub_access_key_id, _config.hub_access_key_secret)
    )
    logger.debug('Announcement: success!')

    el = asyncio.get_event_loop()
    stop_server = el.create_future()
    el.add_signal_handler(signal.SIGINT, stop_server.set_result, None)
    el.add_signal_handler(signal.SIGTERM, stop_server.set_result, None)
    internal_address = urlparse(_config.internal_address)
    logger.info(f'Listening on host "{internal_address.hostname}", port "{internal_address.port}"...')
    el.run_until_complete(_start_server(internal_address.hostname, internal_address.port, stop_server))

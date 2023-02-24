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
import traceback
from typing import Any, Awaitable, Callable, Optional

from .core import AsyncPage, Expando
from .ui import markdown_card

logger = logging.getLogger(__name__)


class Query:
    """
    Represents the query context.
    The query context is passed to the handler function whenever a query
    arrives from the browser (page load, user interaction events, etc.).
    The query context contains useful information about the query, including arguments
    `args` (equivalent to URL query strings) and client-level state.
    """

    def __init__(self, page: AsyncPage, client_state: Expando, args: Expando, events: Expando):
        self.page = page
        """A reference to the current page."""
        self.client = client_state
        """An `h2o_wave.core.Expando` instance to hold client-specific state."""
        self.args = args
        """A `h2o_wave.core.Expando` instance containing arguments from the active request."""
        self.events = events
        """A `h2o_wave.core.Expando` instance containing events from the active request."""


Q = Query
"""Alias for Query context."""

HandleAsync = Callable[[Q], Awaitable[Any]]


async def wave_serve(handle: HandleAsync, send: Optional[Callable] = None, recv: Optional[Callable] = None):
    await _App(handle, send, recv)._run()


class _App:
    def __init__(self, handle: HandleAsync, send: Optional[Callable] = None, recv: Optional[Callable] = None):
        self._recv = recv
        self._handle = handle
        self._state: Expando = Expando()
        self._page: AsyncPage = AsyncPage(send)

    async def _run(self):
        # Handshake.
        received = await self._recv()
        if not received.startswith('+'):
            raise ValueError('Wave Error: Invalid handshake')
        await self._process({})
        # Event loop.
        try:
            while True:
                data = await self._recv()
                data = _parse_msg(data)
                data = json.loads(data)
                await self._process(data)
        except json.JSONDecodeError:
            raise ValueError('Wave Error: Invalid message.')

    async def _process(self, args: dict):
        events_state: Optional[dict] = args.get('', None)
        if isinstance(events_state, dict):
            events_state = {k: Expando(v) for k, v in events_state.items()}
            del args['']
        q = Q(self._page, self._state, Expando(args), Expando(events_state))
        try:
            await self._handle(q)
        except Exception:
            logger.exception('Unhandled exception')
            try:
                q.page.drop()
                # TODO replace this with a custom-designed error display
                q.page['__unhandled_error__'] = markdown_card(
                    box='1 1 12 10',
                    title='Error',
                    content=f'```\n{traceback.format_exc()}\n```',
                )
                await q.page.save()
            except Exception:
                logger.exception('Failed transmitting unhandled exception')


def _parse_msg(msg: str) -> Optional[dict]:
    # protocol: t addr data
    parts = msg.split(' ', 3)

    if len(parts) != 3:
        raise ValueError('Invalid message')

    return parts[2]

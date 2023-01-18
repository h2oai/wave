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
import contextvars
import functools
import json
import logging
import os
import pickle
import traceback
from concurrent.futures import Executor
from typing import Any, Awaitable, Callable, Dict, Optional, Tuple

from .core import AsyncSite, Expando, expando_to_dict, marshal
from .ui import markdown_card

logger = logging.getLogger(__name__)


def _noop(): pass


def _session_for(sessions: dict, session_id: str):
    session = sessions.get(session_id, None)
    if session is None:
        session = Expando()
        sessions[session_id] = session
    return session


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
            client_id: str,
            app_state: Expando,
            user_state: Expando,
            client_state: Expando,
            args: Expando,
            events: Expando,
    ):
        self.site = site
        """A reference to the current site."""
        self.page = site[f'/{client_id}']
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


async def wave_serve(handle: HandleAsync, send: Optional[Callable] = None, recv: Optional[Callable] = None):
    await _App(handle, send, recv)._run()


class _App:
    def __init__(self, handle: HandleAsync, send: Optional[Callable] = None, recv: Optional[Callable] = None):
        self._recv = recv
        self._handle = handle
        self._state: WebAppState = _load_state()
        self._site: AsyncSite = AsyncSite(send)

    async def _run(self):
        # Handshake.
        received = await self._recv()
        if not received.startswith('+'):
            raise ValueError('Invalid handshake')
        await self._process({})

        # Event loop.
        while True:
            data = await self._recv()
            try:
                data = await _parse_msg(data)
                data = json.loads(data)
            except json.JSONDecodeError:
                raise ValueError('Invalid message')
            await self._process(data)

    async def _process(self, args: dict):
        app_state, user_state, client_state = self._state
        events_state: Optional[dict] = args.get('', None)
        if isinstance(events_state, dict):
            events_state = {k: Expando(v) for k, v in events_state.items()}
            del args['']
        q = Q(
            site=self._site,
            client_id='',
            app_state=app_state,
            user_state=_session_for(user_state, ''),
            client_state=_session_for(client_state, ''),
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

async def _parse_msg(msg: str) -> Optional[dict]:
    # protocol: t addr data
    parts = msg.split(' ', 3)

    if len(parts) != 3:
        raise ValueError('Invalid message')

    return parts[2]

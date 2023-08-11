
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
import unittest
import h2o_wave
from unittest.mock import AsyncMock
from starlette.routing import compile_path
from h2o_wave import run_on, Q, AsyncSite, Expando


class FakeAuth:
    def __init__(self):
        self.username = ''
        self.subject = ''
        self.access_token = ''
        self.refresh_token = ''
        self._session_id = ''


def mock_q(args={}, events={}):
    return Q(site=AsyncSite(), mode='unicast', auth=FakeAuth(), client_id='', route='/', app_state=None,
             user_state=None, client_state=None, args=Expando(args), events=Expando(events), headers={})


arg_handlers = {
    'button': AsyncMock(),
    'checkbox': AsyncMock(),
    '#': AsyncMock(),
}
path_handlers = {
    '#page': AsyncMock(),
}
event_handlers = {
    'source.event': AsyncMock(),
}

for k, h in arg_handlers.items():
    h2o_wave.routing._add_handler(k, h, None)
for k, h in path_handlers.items():
    rx, _, conv = compile_path(k[1:])
    h2o_wave.routing._path_handlers.append((rx, conv, h, 0))
for k, h in event_handlers.items():
    source, event = k.split('.', 1)
    h2o_wave.routing._add_event_handler(source, event, h, None)


class TestRouting(unittest.IsolatedAsyncioTestCase):
    def setUp(self):
        for h in {**arg_handlers, **path_handlers, **event_handlers}.values():
            h.reset_mock()

    async def test_args(self):
        await run_on(mock_q(args={'button': True, '__wave_submission_name__': 'button'}))
        arg_handlers['button'].assert_called_once()

    async def test_args_false(self):
        await run_on(mock_q(args={'checkbox': False, '__wave_submission_name__': 'checkbox'}))
        arg_handlers['checkbox'].assert_called_once()

    async def test_args_empty_string(self):
        await run_on(mock_q(args={'checkbox': '', '__wave_submission_name__': 'checkbox'}))
        arg_handlers['checkbox'].assert_called_once()

    async def test_no_match(self):
        await run_on(mock_q(args={'__wave_submission_name__': 'checkbox'}))
        arg_handlers['checkbox'].assert_not_called()

    async def test_hash(self):
        await run_on(mock_q(args={'#': 'page', '__wave_submission_name__': '#'}))
        path_handlers['#page'].assert_called_once()

    async def test_empty_hash(self):
        await run_on(mock_q(args={'#': '', '__wave_submission_name__': '#'}))
        arg_handlers['#'].assert_called_once()

    async def test_events(self):
        await run_on(mock_q(args={'__wave_submission_name__': 'source'}, events={'source': {'event': True}}))
        event_handlers['source.event'].assert_called_once()

    async def test_events_false(self):
        await run_on(mock_q(args={'__wave_submission_name__': 'source'}, events={'source': {'event': False}}))
        event_handlers['source.event'].assert_called_once()

    async def test_events_empty(self):
        await run_on(mock_q(args={'__wave_submission_name__': 'source'}, events={'source': {'event': ''}}))
        event_handlers['source.event'].assert_called_once()

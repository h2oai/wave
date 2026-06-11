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
from unittest.mock import AsyncMock, patch

from starlette.testclient import TestClient

from h2o_wave import server


async def _noop_handle(_q):
    pass


class TestLifecycle(unittest.TestCase):
    def _make_app(self, on_startup=None, on_shutdown=None):
        app = server._App(
            "/",
            _noop_handle,
            mode="unicast",
            on_startup=on_startup,
            on_shutdown=on_shutdown,
        )
        app._wave.call = AsyncMock()  # Avoid network calls.
        return app

    def test_startup_and_shutdown_hooks_fire(self):
        events = []
        app = self._make_app()
        with patch.object(
            server._App,
            "_register",
            AsyncMock(side_effect=lambda: events.append("register")),
        ), patch.object(
            server._App,
            "_unregister",
            AsyncMock(side_effect=lambda: events.append("unregister")),
        ), patch.object(
            server._App, "_shutdown", side_effect=lambda: events.append("shutdown")
        ):
            # Entering the TestClient context runs lifespan startup; exiting runs shutdown.
            with TestClient(app.app):
                self.assertEqual(events, ["register"])

        self.assertEqual(events, ["register", "unregister", "shutdown"])

    def test_user_hooks_fire_in_order(self):
        events = []

        def sync_on_startup():
            events.append("user_startup")

        async def async_on_shutdown():
            events.append("user_shutdown")

        app = self._make_app(on_startup=sync_on_startup, on_shutdown=async_on_shutdown)
        with patch.object(
            server._App,
            "_register",
            AsyncMock(side_effect=lambda: events.append("register")),
        ), patch.object(
            server._App,
            "_unregister",
            AsyncMock(side_effect=lambda: events.append("unregister")),
        ), patch.object(
            server._App, "_shutdown", side_effect=lambda: events.append("shutdown")
        ):
            with TestClient(app.app):
                pass

        self.assertEqual(
            events,
            ["register", "user_startup", "unregister", "shutdown", "user_shutdown"],
        )

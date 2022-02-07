from server.tests.utils import BaseTestCase
from server.utils import fluent_icons


class TestIconCompletions(BaseTestCase):

    def test_icon(self):
        self.assertEqual(len(self.get_completions("ui.button(name='btn', label='Button label', icon='')")), len(fluent_icons))
        self.assertEqual(len(self.get_completions("ui.button(icon='')")), len(fluent_icons))

    def test_icon_no_completion_outside_wave(self):
        self.assertEqual(len(self.get_completions("random_function(icon='')")), 0)

    def test_icon_multiline(self):
        self.assertEqual(len(self.get_completions("ui.button(\nicon=''\n)", False)), len(fluent_icons))

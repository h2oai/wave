from importlib import import_module
from server.tests.utils import BaseTestCase
from server.utils import themes

class TestThemeCompletions(BaseTestCase):

    def test_theme(self):
        self.assertEqual(len(self.get_completions("ui.meta_card(theme='')")), len(themes))

    def test_theme_no_completion_outside_wave(self):
        self.assertEqual(len(self.get_completions("random_function(theme='')")), 0)

    def test_theme_multiline(self):
        self.assertEqual(len(self.get_completions("ui.meta_card(\ntheme=''\n)", False)), len(themes))

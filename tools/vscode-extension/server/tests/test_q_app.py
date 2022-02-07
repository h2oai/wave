from server.tests.utils import BaseTestCase


class TestQAppCompletions(BaseTestCase):

    def test_app(self):
        self.assert_state('q.app.')

    def test_app_bracket(self):
        self.assert_state("q.app['']")
        self.assert_state('q.app[""]')

    def test_autocomplete_stop(self):
        self.assertEqual(len(self.get_completions('q.app.app.')), 0)

    def test_autocomplete_stop_bracket(self):
        self.assertEqual(len(self.get_completions('q.app[""][""]')), 0)
        self.assertEqual(len(self.get_completions("q.app['']['']")), 0)
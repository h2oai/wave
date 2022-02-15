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

    def test_autocomplete_if_statement(self):
        self.assertEqual(len(self.get_completions('if q.app.')), 4)
        self.assertEqual(len(self.get_completions('if q.app[""]')), 4)
        self.assertEqual(len(self.get_completions("if q.app['']")), 4)

    def test_in_function_call(self):
        self.assertEqual(len(self.get_completions('print(q.app.)', typing_offset=1)), 4)
        self.assertEqual(len(self.get_completions('print(q.app.')), 4)

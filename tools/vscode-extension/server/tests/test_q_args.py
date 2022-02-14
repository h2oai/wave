from server.tests.utils import BaseTestCase


class TestQArgsCompletions(BaseTestCase):

    def test_args(self):
        self.assert_interaction('q.args.')

    def test_args_bracket(self):
        self.assert_interaction("q.args['']")
        self.assert_interaction('q.args[""]')

    def test_autocomplete_stop(self):
        self.assertEqual(len(self.get_completions('q.args.args.')), 0)

    def test_autocomplete_stop_bracket(self):
        self.assertEqual(len(self.get_completions('q.args[""][""]')), 0)
        self.assertEqual(len(self.get_completions("q.args['']['']")), 0)

    def test_autocomplete_block_statements(self):
        self.assertEqual(len(self.get_completions('if q.args.')), 3)
        self.assertEqual(len(self.get_completions('if q.args[""]')), 3)
        self.assertEqual(len(self.get_completions("if q.args['']")), 3)
        self.assertEqual(len(self.get_completions('while q.args.')), 3)

    def test_in_function_call(self):
        self.assertEqual(len(self.get_completions('print(q.args.)', typing_offset=1)), 3)
        self.assertEqual(len(self.get_completions('print(q.args.')), 3)

from server.tests.utils import BaseTestCase


class TestQClientCompletions(BaseTestCase):

    def test_incomplete_expr(self):
        self.assertEqual(len(self.get_completions('q.')), 0)

    def test_client(self):
        self.assert_state('q.client.')
        print()

    def test_client_bracket(self):
        self.assert_state("q.client['']")
        self.assert_state('q.client[""]')

    def test_autocomplete_stop(self):
        self.assertEqual(len(self.get_completions('q.client.client.')), 0)

    def test_autocomplete_stop_bracket(self):
        self.assertEqual(len(self.get_completions('q.client[""][""]')), 0)
        self.assertEqual(len(self.get_completions("q.client['']['']")), 0)

    def test_autocomplete_if_statement(self):
        self.assertEqual(len(self.get_completions('if q.client.')), 4)
        self.assertEqual(len(self.get_completions('if q.client[""]')), 4)
        self.assertEqual(len(self.get_completions("if q.client['']")), 4)

    def test_in_function_call(self):
        self.assertEqual(len(self.get_completions('print(q.client.)', typing_offset=1)), 4)
        self.assertEqual(len(self.get_completions('print(q.client.')), 4)

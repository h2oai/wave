from server.tests.utils import BaseTestCase


class TestEventCompletions(BaseTestCase):

    def test_events(self):
        self.assert_event_widgets('q.events.')
        completions = self.get_completions('q.events.current_file_name.')
        self.assertEqual(len(completions), 1)
        self.assertIn('current_file', completions)

    def test_events_multiple(self):
        completions = self.get_completions('q.events.current_file_name_multi_events.')
        self.assertEqual(len(completions), 2)
        self.assertIn('current_file', completions)
        self.assertIn('event2', completions)

    def test_events_bracket(self):
        self.assert_event_widgets("q.events['']")
        self.assert_event_widgets('q.events[""]')
        completions = self.get_completions("q.events['current_file_name']['']")
        self.assertEqual(len(completions), 1)
        self.assertIn('current_file', completions)

    def test_autocomplete_stop(self):
        self.assertEqual(len(self.get_completions('q.events.events.')), 0)

    def test_autocomplete_stop_bracket(self):
        self.assertEqual(len(self.get_completions('q.events[""][""]')), 0)

    def test_autocomplete_if_statement(self):
        self.assertEqual(len(self.get_completions('if q.events.')), 4)
        self.assertEqual(len(self.get_completions('if q.events[""]')), 4)
        self.assertEqual(len(self.get_completions("if q.events['']")), 4)

    def test_in_function_call(self):
        self.assertEqual(len(self.get_completions('print(q.events.)', typing_offset=1)), 4)
        self.assertEqual(len(self.get_completions('print(q.events.')), 4)

from server.tests.utils import BaseTestCase


class TestEventCompletions(BaseTestCase):

    def test_events(self):
        self.assert_interaction('q.events.')

    def test_events_bracket(self):
        self.assert_interaction("q.events['']")

    def test_autocomplete_stop(self):
        self.assertEqual(len(self.get_completions('q.events.events.')), 0)

    def test_autocomplete_stop_bracket(self):
        self.assertEqual(len(self.get_completions('q.events[""][""]')), 0)
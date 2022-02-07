from server.tests.utils import BaseTestCase


class TestQUserCompletions(BaseTestCase):

    def test_user(self):
        self.assert_state('q.user.')

    def test_user_bracker(self):
        self.assert_state("q.user['']")
        self.assert_state('q.user[""]')

    def test_autocomplete_stop(self):
        self.assertEqual(len(self.get_completions('q.user.user.')), 0)

    def test_autocomplete_stop_bracket(self):
        self.assertEqual(len(self.get_completions('q.user[""][""]')), 0)
        self.assertEqual(len(self.get_completions("q.user['']['']")), 0)
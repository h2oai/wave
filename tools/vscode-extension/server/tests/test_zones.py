from server.tests.utils import BaseTestCase


class TestZoneCompletions(BaseTestCase):

    def test_zones(self):
        self.assert_zones("ui.form_card(box='')")
        self.assert_zones('ui.form_card(box="")')

    def test_zones_multilne(self):
        self.assert_zones("ui.form_card(\nbox=''\n)", False)
        self.assert_zones('ui.form_card(\nbox=""\n)', False)

    def test_zones_box(self):
        self.assert_zones("ui.box(zone='')")
        self.assert_zones('ui.box(zone="")')

    def test_zones_box_multiline(self):
        self.assert_zones("ui.box(\nzone=''\n)", False)
        self.assert_zones('ui.box(\nzone=""\n)', False)

    def test_zones_box_positional(self):
        self.assert_zones("ui.box('')")
        self.assert_zones('ui.box("")')

    def test_zones_box_positional_multiline(self):
        self.assert_zones("ui.box(\n''\n)", False)
        self.assert_zones('ui.box(\n""\n)', False)

    def test_zones_box_str(self):
        self.assert_zones("ui.boxes('')")
        self.assert_zones('ui.boxes("")')

    def test_zones_box_str_multiple(self):
        self.assert_zones("ui.boxes('zone', '')")
        self.assert_zones("ui.boxes(\n''\n)", False)

    def test_zones_box_completes_only_zone(self):
        self.assertEqual(len(self.get_completions('ui.box("foo", width="")')), 0)
        self.assertEqual(len(self.get_completions('ui.box("foo", "")')), 0)

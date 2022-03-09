import os
import unittest
from typing import List, Optional
from unittest.mock import Mock

from pygls.workspace import Document, Workspace
from server.lsp_server import completions, init

root_uri = os.path.abspath(os.path.join('server', 'tests', 'test_project'))


class BaseTestCase(unittest.TestCase):
    def __init__(self, methodName: str) -> None:
        super().__init__(methodName=methodName)
        self.server = FakeServer()
        init(self.server, None)

    def get_completions(self, fake_content: str, inline=True, doc_uri=None, typing_offset=0) -> List[str]:
        fake_document = Document('fake_uri', fake_content)
        self.server.workspace.get_document = Mock(return_value=fake_document)
        completion_params = FakeCompletionParams(1, 2, doc_uri)
        if inline:
            completion_params = FakeCompletionParams(0, len(fake_content) - typing_offset, doc_uri)
        completion_list = completions(self.server, completion_params)  # type: ignore
        return [i.label for i in completion_list.items]

    def assert_zones(self, type_text: str, inline=True) -> None:
        completions = self.get_completions(type_text, inline)
        self.assertEqual(len(completions), 5)
        self.assertIn('current_file', completions)
        self.assertIn('positional_arg', completions)
        self.assertIn('from_import', completions)
        self.assertIn('regular_import', completions)
        self.assertIn('with_comment', completions)

    def assert_state(self, type_text: str, inline=True, doc_uri: Optional[str] = None) -> None:
        completions = self.get_completions(type_text, inline, doc_uri)
        self.assertEqual(len(completions), 4)
        self.assertIn('current_file', completions)
        self.assertIn('from_import', completions)
        self.assertIn('regular_import', completions)
        self.assertIn('str_key', completions)

    def assert_interaction(self, type_text: str, inline=True) -> None:
        completions = self.get_completions(type_text, inline)
        self.assertEqual(len(completions), 3)
        self.assertIn('current_file', completions)
        self.assertIn('from_import', completions)
        self.assertIn('regular_import', completions)

    def assert_events(self, type_text: str, inline=True) -> None:
        completions = self.get_completions(type_text, inline)
        self.assertEqual(len(completions), 3)
        self.assertIn('current_file', completions)
        self.assertIn('from_import', completions)
        self.assertIn('regular_import', completions)

    def assert_event_widgets(self, type_text: str, inline=True) -> None:
        completions = self.get_completions(type_text, inline)
        self.assertEqual(len(completions), 4)
        self.assertIn('current_file_name', completions)
        self.assertIn('current_file_name_multi_events', completions)
        self.assertIn('from_import_name', completions)
        self.assertIn('regular_import_name', completions)


class FakeServer():
    def __init__(self):
        self.workspace = Workspace(root_uri, None)
        self.store = {}


class FakePosition():
    def __init__(self, line: int, character: int) -> None:
        self.line = line
        self.character = character


class FakeTextDoc():
    def __init__(self, doc_uri: Optional[str] = None) -> None:
        self.uri = doc_uri or os.path.join(root_uri, 'main.py')


class FakeCompletionParams():
    def __init__(self, line: int, character: int, doc_uri: Optional[str] = None) -> None:
        self.position = FakePosition(line, character)
        self.text_document = FakeTextDoc(doc_uri)


class FakeSaveParams():
    def __init__(self, text: str, doc_uri: Optional[str] = None) -> None:
        self.text = text
        self.text_document = FakeTextDoc(doc_uri)

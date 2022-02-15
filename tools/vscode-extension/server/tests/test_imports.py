import os

from server.lsp_server import did_save
from server.parser import read_file
from server.tests.utils import BaseTestCase, FakeSaveParams, root_uri


class TestImportCompletions(BaseTestCase):

    def test_import_deps(self):
        self.assert_state('q.client.', doc_uri=os.path.join(root_uri, 'utils.py'))
        
    def test_remove_import_deps(self):
        self.assert_state('q.client.', doc_uri=os.path.join(root_uri, 'utils.py'))
        file_path = os.path.join(root_uri, 'main.py')
        removed_imports = read_file(file_path).replace('import utils, utils2', '')
        # Mock save action. 
        did_save(self.server, FakeSaveParams(removed_imports, file_path))

        completions = self.get_completions('q.client.', doc_uri=os.path.join(root_uri, 'utils.py'))
        self.assertEqual(len(completions), 1)
        self.assertTrue('regular_import' in completions)
        
    def test_add_import_deps(self):
        file_path = os.path.join(root_uri, 'main.py')
        removed_imports = read_file(file_path).replace('import utils, utils2', '')
        # Mock save action. 
        did_save(self.server, FakeSaveParams(removed_imports, file_path))

        completions = self.get_completions('q.client.', doc_uri=os.path.join(root_uri, 'utils.py'))
        self.assertEqual(len(completions), 1)
        self.assertTrue('regular_import' in completions)

        # Mock save action. 
        did_save(self.server, FakeSaveParams('import utils, utils2\n' + removed_imports, file_path))
        self.assert_state('q.client.', doc_uri=os.path.join(root_uri, 'utils.py'))

############################################################################
# Copyright(c) Open Law Library. All rights reserved.                      #
# See ThirdPartyNotices.txt in the project root for additional notices.    #
#                                                                          #
# Licensed under the Apache License, Version 2.0 (the "License")           #
# you may not use this file except in compliance with the License.         #
# You may obtain a copy of the License at                                  #
#                                                                          #
#     http: // www.apache.org/licenses/LICENSE-2.0                         #
#                                                                          #
# Unless required by applicable law or agreed to in writing, software      #
# distributed under the License is distributed on an "AS IS" BASIS,        #
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. #
# See the License for the specific language governing permissions and      #
# limitations under the License.                                           #
############################################################################
from typing import List, Optional, Set

from pygls.lsp.methods import COMPLETION, INITIALIZED, TEXT_DOCUMENT_DID_SAVE
from pygls.lsp.types import CompletionItem, CompletionList, CompletionOptions, CompletionParams
from pygls.lsp.types.language_features.completion import CompletionItemKind
from pygls.lsp.types.text_synchronization import TextDocumentSaveRegistrationOptions
from pygls.lsp.types.workspace import DidSaveTextDocumentParams
from pygls.lsp.types.general_messages import InitializedParams
from pygls.server import LanguageServer
from .parser import FileMetadata, fill_completion, get_completion_type, get_initial_completions
from .utils import fluent_icons, themes

class WaveLanguageServer(LanguageServer):
    def __init__(self):
        super().__init__()
        self.store = {}

server = WaveLanguageServer()

def get_completions_from_deps(ls: WaveLanguageServer, file: FileMetadata, completion_type: str, completions: Set[str], visited: List[str]) -> None:
    completions.update(getattr(file, completion_type))
    for dep in file.deps:
        if not dep in visited:
            visited.append(dep)
            get_completions_from_deps(ls, ls.store.get(dep), completion_type, completions, visited)

@server.feature(COMPLETION, CompletionOptions(trigger_characters=['.', '\'', '"']))
def completions(ls: WaveLanguageServer, params: Optional[CompletionParams] = None) -> CompletionList:
    items = []
    if params:
        file_content = ls.workspace.get_document(params.text_document.uri).source
        completion_type = get_completion_type(params.position.line, params.position.character, file_content)
        if completion_type and hasattr(FileMetadata(), completion_type):
            completions: Set[str] = set()
            document_uri = params.text_document.uri.replace('file://', '')
            visited = [document_uri]
            ls.store[document_uri] = fill_completion(file_content, False, ls.store.get(document_uri))
            get_completions_from_deps(ls, ls.store.get(document_uri), completion_type, completions, visited)
            items = [CompletionItem(label=label, kind=CompletionItemKind.Variable, sort_text='0') for label in completions]
        elif completion_type == 'icons':
            items = [CompletionItem(label=icon, kind=CompletionItemKind.Enum, sort_text='0') for icon in fluent_icons]
        elif completion_type == 'themes':
            items = [CompletionItem(label=theme, kind=CompletionItemKind.Enum, sort_text='0') for theme in themes]

    return CompletionList(is_incomplete=False, items=items)

@server.feature(INITIALIZED)
def init(ls: WaveLanguageServer):
    ls.store = get_initial_completions(ls.workspace.root_path)

@server.feature(TEXT_DOCUMENT_DID_SAVE, TextDocumentSaveRegistrationOptions(include_text=True))
def did_save(ls: WaveLanguageServer, params: DidSaveTextDocumentParams):
    if params.text:
        document_uri = params.text_document.uri.replace('file://', '')
        orig_file = ls.store[document_uri] 
        updated_file = fill_completion(params.text)
        # Remove parent dependencies if imports removed.
        for dep in orig_file.deps.difference(updated_file.deps):
            ls.store[dep].deps.remove(document_uri)
        # Add parent dependencies if imports added.
        for dep in updated_file.deps.difference(orig_file.deps):
            ls.store[dep].deps.add(document_uri)
        ls.store[document_uri] = updated_file 

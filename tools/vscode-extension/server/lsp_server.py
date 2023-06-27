from typing import List, Optional, Set

from lsprotocol.types import (INITIALIZED, TEXT_DOCUMENT_COMPLETION,
                              TEXT_DOCUMENT_DID_SAVE, CompletionItem,
                              CompletionItemKind, CompletionList,
                              CompletionOptions, CompletionParams,
                              DidSaveTextDocumentParams, InitializedParams,
                              TextDocumentSaveRegistrationOptions)
from pygls.lsp import METHOD_TO_OPTIONS
from pygls.server import LanguageServer

from .parser import (FileMetadata, fill_completion, get_completion_type,
                     get_initial_completions)
from .utils import fluent_icons, themes

# HACK: Add support for textDocument/didSave until pygls 1.0.3 is released.
METHOD_TO_OPTIONS[TEXT_DOCUMENT_DID_SAVE] = TextDocumentSaveRegistrationOptions


class WaveLanguageServer(LanguageServer):
    def __init__(self):
        super().__init__('wave-language-server', '0.25.3')
        self.store = {}


server = WaveLanguageServer()


def get_completions_from_deps(ls: WaveLanguageServer, file: FileMetadata, completion_type: str, completions: Set[str], visited: List[str], leaf_val: Optional[str]) -> None:
    completion_items = []
    if completion_type == 'events' and leaf_val:
        completion_items = list(getattr(file, completion_type).get(leaf_val, []))
    elif completion_type == 'events' and leaf_val is None:
        completion_items = list(getattr(file, completion_type).keys())
    elif leaf_val is None:
        completion_items = getattr(file, completion_type)
    completions.update(completion_items)
    for dep in file.deps:
        if dep not in visited:
            visited.append(dep)
            get_completions_from_deps(ls, ls.store.get(dep), completion_type, completions, visited, leaf_val)


@server.feature(TEXT_DOCUMENT_COMPLETION, CompletionOptions(trigger_characters=['.', '\'', '"']))
def completions(ls: WaveLanguageServer, params: Optional[CompletionParams] = None) -> CompletionList:
    items = []
    if params:
        file_content = ls.workspace.get_document(params.text_document.uri).source
        completion_type, prev_val = get_completion_type(params.position.line, params.position.character, file_content)
        if completion_type and hasattr(FileMetadata(), completion_type):
            completions: Set[str] = set()
            document_uri = params.text_document.uri.replace('file://', '')
            # Replace Windows Disk letter if present.
            if document_uri[1] == ':':
                document_uri = document_uri[2:]
            visited = [document_uri]
            ls.store[document_uri] = fill_completion(file_content, False, ls.store.get(document_uri))
            get_completions_from_deps(ls, ls.store.get(document_uri), completion_type, completions, visited, prev_val)
            items = [CompletionItem(label=label, kind=CompletionItemKind.Variable, sort_text='0') for label in completions]
        elif completion_type == 'icons':
            items = [CompletionItem(label=icon, kind=CompletionItemKind.Enum, sort_text='0') for icon in fluent_icons]
        elif completion_type == 'themes':
            items = [CompletionItem(label=theme, kind=CompletionItemKind.Enum, sort_text='0') for theme in themes]

    return CompletionList(is_incomplete=False, items=items)


# Unused params cannot be removed otherwise the init method callback not called for some reason.
@server.feature(INITIALIZED)
def init(ls: WaveLanguageServer, params: Optional[InitializedParams]):
    ls.store = get_initial_completions(ls.workspace.root_path)


@server.feature(TEXT_DOCUMENT_DID_SAVE, TextDocumentSaveRegistrationOptions(include_text=True))
def did_save(ls: WaveLanguageServer, params: DidSaveTextDocumentParams):
    if params.text:
        document_uri = params.text_document.uri.replace('file://', '')
        # Replace Windows Disk letter if present.
        if document_uri[1] == ':':
            document_uri = document_uri[2:]
        orig_file = ls.store[document_uri]
        updated_file = fill_completion(params.text)
        # Remove parent dependencies if imports removed.
        for dep in orig_file.deps.difference(updated_file.deps):
            ls.store[dep].deps.remove(document_uri)
        # Add parent dependencies if imports added.
        for dep in updated_file.deps.difference(orig_file.deps):
            ls.store[dep].deps.add(document_uri)
        ls.store[document_uri] = updated_file

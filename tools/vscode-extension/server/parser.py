import parso
import os
import itertools
from typing import Dict, List, Any, Optional, Set


class FileMetadata():
    files_to_parse: Dict[str, str] = {}

    def __init__(self) -> None:
        self.args: List[str] = []
        self.events: List[str] = []
        self.zones: List[str] = []
        self.client: List[str] = []
        self.app: List[str] = []
        self.user: List[str] = []
        self.deps: Set[str] = set()

    def add_completion(self, node: Any, completion_type: str) -> None:
        if node.type == 'string' or completion_type not in ['zones', 'args', 'events']:
            val = node.value.replace("'", '').replace('"', '')
            if completion_type != 'args' or not val.startswith('#'):
                getattr(self, completion_type).append(val) if val else None

    @staticmethod
    def set_files_to_parse(files: List[str]) -> None:
        for f in files:
            FileMetadata.files_to_parse[os.path.basename(f)[:-3]] = f

    def add_dep(self, dep_name: str) -> None:
        dep_file = FileMetadata.files_to_parse.get(dep_name)
        if dep_file:
            self.deps.add(dep_file)


def read_file(file: str) -> str:
    with open(file, 'r') as f:
        return f.read()


def fill_metadata(node: Any, file_metadata: FileMetadata) -> None:
    completion_found = False
    if node.type == 'argument':
        arg_name = node.get_first_leaf().value
        if arg_name == 'name' and is_in_ui_obj(node) and node.children[-1].type != 'arith_expr':
            completion_found = True
            completion_type = 'zones' if node.parent.parent.children[1].get_last_leaf().value == 'zone' else 'args'
            file_metadata.add_completion(node.get_last_leaf(), completion_type)
        elif arg_name == 'events' and is_in_ui_obj(node):
            completion_found = True
            file_metadata.add_completion(node.children[2].children[1], 'events')
    elif node.type == 'atom_expr':
        str_expr = node.get_code(False)
        if str_expr.startswith('ui.zone'):
            if node.children[-1].children[1].type == 'arglist' and node.children[-1].children[1].children[0].type == 'string':
                file_metadata.add_completion(node.children[-1].children[1].children[0], 'zones')
            elif node.children[-1].children[1].type == 'string':
                file_metadata.add_completion(node.children[-1].children[1], 'zones')
        # Must have 3 children -> q.state.name
        elif len(node.children) == 3:
            if str_expr.startswith('q.client'):
                file_metadata.add_completion(node.children[-1].children[1], 'client')
                completion_found = True
            elif str_expr.startswith('q.user'):
                file_metadata.add_completion(node.children[-1].children[1], 'user')
                completion_found = True
            elif str_expr.startswith('q.app'):
                file_metadata.add_completion(node.children[-1].children[1], 'app')
                completion_found = True
    if not completion_found and hasattr(node, 'children'):
        for child in node.children:
            fill_metadata(child, file_metadata)

def get_files_to_parse(root: str, py_files: List[str]) -> List[str]:
    for f in os.scandir(root):
        # Ignore all .dirs and python venvs.
        if f.is_dir() and not f.name.startswith('.') and f.name != 'node_modules' and 'pyvenv.cfg' not in os.listdir(f.path):
            get_files_to_parse(f.path, py_files)
        elif f.is_file() and f.name.endswith('.py'):
            py_files.append(f.path)
    return py_files

def is_in_ui_obj(node: Any) -> bool:
    return parso.tree.search_ancestor(node, 'atom_expr').children[0].value == 'ui'

def fill_deps(tree: Any, file_metadata: FileMetadata) -> None:
    for imp in list(tree.iter_imports()):
        if imp.type == 'import_from':
            file_metadata.add_dep(imp.children[1].get_last_leaf().value)
        elif imp.type == 'import_name':
            for path in list(itertools.chain.from_iterable(imp.get_paths())):
                file_metadata.add_dep(path.value)

def fill_completion(file_content: str, should_fill_deps=True, metadata: Optional[FileMetadata]=None) -> FileMetadata:
    tree = parso.parse(file_content)
    file_metadata = metadata or FileMetadata()
    fill_metadata(tree, file_metadata)
    if should_fill_deps:
        fill_deps(tree, file_metadata)
    return file_metadata

def get_initial_completions(root: str) -> Dict[str, FileMetadata]:
    store: Dict[str, FileMetadata] = {}
    files_to_parse = get_files_to_parse(root, [])
    FileMetadata.set_files_to_parse(files_to_parse)
    for file in files_to_parse:
        completion = fill_completion(read_file(file))
        store[file] = completion
        for dep in completion.deps:
            if dep in store:
                store[dep].deps.add(file)
            else:
                new_metadata = FileMetadata()
                new_metadata.deps.add(file)
                store[dep] = new_metadata
    return store


def get_completion_type(row: int, col: int, file_content: str) -> Optional[str]:
    try:
        leaf = parso.parse(file_content).get_leaf_for_position((row + 1, col - 1))
        # Expr statements (q.client, q.events).
        expr_leaf = leaf.parent.get_previous_sibling()
        if expr_leaf and expr_leaf.type == 'name' and expr_leaf.value == 'q':
            return leaf.parent.children[1].value

        # Bracket notation for expr statements (q.client[''], q.events['']).
        expr_leaf = leaf.parent.parent.children[0]
        if len(leaf.parent.parent.children) <= 3 and expr_leaf.type == 'name' and expr_leaf.value == 'q':
            return leaf.parent.get_previous_sibling().children[1].value

        # Zones.
        expr_leaf = parso.tree.search_ancestor(leaf, 'atom_expr')
        code = expr_leaf.get_code(False)
        if code.startswith('ui.boxes') and leaf.type in ['string', 'operator']:
            return 'zones'
        is_zone_arg = (leaf.parent.type != 'argument' and leaf.get_previous_sibling().value == '(') or leaf.parent.children[0].value == 'zone'
        if code.startswith('ui.box') and leaf.type in ['string', 'operator'] and is_zone_arg:
            return 'zones'

        if leaf.parent and leaf.parent.get_last_leaf().type == 'string' and is_in_ui_obj(leaf):
            arg_name = leaf.parent.get_first_leaf().value
            if arg_name in ['box', 'zone']:
                return 'zones'
            elif arg_name == 'icon':
                return 'icons'
            elif arg_name == 'theme':
                return 'themes'
    except:
        pass
    return None

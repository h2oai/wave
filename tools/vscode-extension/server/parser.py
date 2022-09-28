import parso
import os
import itertools
from typing import Dict, List, Any, Optional, Set


def strip_quotes(val: str) -> str:
    return val.strip('"').strip("'")


class FileMetadata():
    files_to_parse: Dict[str, str] = {}

    def __init__(self) -> None:
        # TODO: Consider using Set instead of List.
        self.args: List[str] = []
        self.events: Dict[str, List[str]] = {}
        self.zones: List[str] = []
        self.client: List[str] = []
        self.app: List[str] = []
        self.user: List[str] = []
        self.deps: Set[str] = set()

    def add_completion(self, node: Any, completion_type: str) -> None:
        if (node.type == 'string' or node.type == 'name'):
            val = strip_quotes(node.value)
            if val and (completion_type != 'args' or not val.startswith('#')):
                getattr(self, completion_type).append(val)

    def __get_event_names(self, nodes: List[Any]) -> List[str]:
        return [strip_quotes(node.value) for node in nodes if node.type == 'string']

    def add_event_completion(self, name_arg: Any, events_arg: Any):
        if name_arg.type == 'string':
            # Seems like args in events=['event'] and events=['event', 'event2'] are different AST-wise.
            if events_arg.children[-1].children[1].type == 'testlist_comp':
                event_nodes = events_arg.children[-1].children[1].children
            else:
                event_nodes = events_arg.children[-1].children
            event_element_name = strip_quotes(name_arg.value)
            self.events[event_element_name] = self.__get_event_names(event_nodes)

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


def has_events_arg(node: Any) -> bool:
    for arg in node.parent.children:
        if arg.type == 'argument' and arg.children[0].type == 'name' and arg.children[0].value == 'events':
            return True
    return False


# TODO: Refactor to pure function instead of one with side effects.
def fill_metadata(node: Any, file_metadata: FileMetadata) -> None:
    completion_found = False
    if node.type == 'argument':
        arg_name = node.get_first_leaf().value
        if arg_name == 'name' and is_in_ui_obj(node) and node.children[-1].type != 'arith_expr':
            completion_found = True
            completion_type = None
            if not has_events_arg(node):
                completion_type = 'args'
            if node.parent.parent.children[1].get_last_leaf().value == 'zone':
                completion_type = 'zones'
            if completion_type:
                file_metadata.add_completion(node.get_last_leaf(), completion_type)
        elif arg_name == 'events' and is_in_ui_obj(node):
            completion_found = True
            name_arg = next((arg for arg in node.parent.children if arg.type == 'argument' and arg.children[0].value == 'name'), None)
            if name_arg:
                file_metadata.add_event_completion(name_arg.children[-1], node)
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
    for f in sorted(os.scandir(root), key=lambda x: (x.is_dir(), x.name)):
        # Ignore all .dirs and python venvs.
        if f.is_dir() and not f.name.startswith('.') and f.name != 'node_modules' and 'pyvenv.cfg' not in os.listdir(f.path):
            get_files_to_parse(f.path, py_files)
        elif f.is_file() and f.name.endswith('.py'):
            py_files.append(f.path)
    return py_files


def is_in_ui_obj(node: Any) -> bool:
    try:
        return parso.tree.search_ancestor(node, 'atom_expr').children[0].value == 'ui'
    except Exception:
        return False


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
        completion = fill_completion(read_file(file), metadata=store.get(file))
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
            return leaf.parent.children[1].value, None

        grand_parent = leaf.parent.parent
        # Bracket notation for expr statements (q.client[''], q.events['']).
        expr_leaf = grand_parent.children[0]
        if len(grand_parent.children) <= 3 and expr_leaf.type == 'name' and expr_leaf.value == 'q':
            return leaf.parent.get_previous_sibling().children[1].value, None

        # Particular event bracket notation (q.events.['widget_name']['']).
        if len(grand_parent.children) == 4 and grand_parent.get_code(False).startswith('q.events['):
            event_name = grand_parent.children[2].children[1]
            return 'events', strip_quotes(event_name.value) if event_name.type == 'string' else None

        # Particular event (q.events.widget_name.*).
        children = [child for child in grand_parent.children if child.type in ['name', 'trailer', 'operator']]
        if len(children) == 4:
            child1 = children[0]
            child2 = children[1]
            if child1.type == 'name' and child1.value == 'q' and child2.children[1].value == 'events':
                return 'events', leaf.value if leaf.type == 'name' else None

        # Zones.
        expr_leaf = parso.tree.search_ancestor(leaf, 'atom_expr')
        code = expr_leaf.get_code(False)
        if code.startswith('ui.boxes') and leaf.type in ['string', 'operator']:
            return 'zones', None
        is_zone_arg = (leaf.parent.type != 'argument' and leaf.get_previous_sibling().value == '(') or leaf.parent.children[0].value == 'zone'
        if code.startswith('ui.box') and leaf.type in ['string', 'operator'] and is_zone_arg:
            return 'zones', None

        if leaf.parent and leaf.parent.get_last_leaf().type == 'string' and is_in_ui_obj(leaf):
            arg_name = leaf.parent.get_first_leaf().value
            if arg_name in ['box', 'zone']:
                return 'zones', None
            elif arg_name == 'icon':
                return 'icons', None
            elif arg_name == 'theme':
                return 'themes', None
    except:
        pass
    return None, None

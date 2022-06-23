from h2o_wave import ui, Q
import json
import file_utils

def update_file_tree(q: Q, root: str) -> None:
    q.page['meta'].script = ui.inline_script(f'eventBus.emit("folder", {json.dumps(file_utils.get_file_tree(root))})')

def open_file(q: Q, file: str) -> None:
    q.page['meta'].script = ui.inline_script(f'''
editor.setValue(`{file_utils.read_file(file)}`)
eventBus.emit('activeFile', '{file}')
''')

def clean_editor(q: Q) -> None:
    q.page['meta'].script = ui.inline_script(f'editor.setValue(``)')

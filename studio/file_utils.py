import os
from pathlib import Path
import shutil
from typing import Optional

def read_file(p: str) -> str:
    try:
        with open(p, encoding='utf-8') as f:
            return f.read()
    except:
        return ''

def create_file(path:str) -> None:
    path = Path(path)
    if not path.exists():
        path.touch()

def create_folder(path:str) -> None:
    dirpath = Path(path)
    if not dirpath.exists():
        os.mkdir(path)

def rename(path:str, new_name:str):
    os.rename(path, os.path.join(os.path.dirname(path), new_name))

def remove_file(path:str) -> None:
    path = Path(path)
    if path.exists():
        os.remove(path)

def remove_folder(path:str) -> None:
    dirpath = Path(path)
    if dirpath.exists():
        shutil.rmtree(dirpath)

def pythonify_js_code(code:str) -> str:
    return code.replace("`", "\\`").replace('$', '\\$')

def get_file_tree(path):
    ret = {}
    for dirpath, dirnames, filenames in os.walk(path):
        ret['label'] = os.path.basename(dirpath)
        ret['isFolder'] = True
        ret['path'] = path
        ret['children'] = []
        for dirname in dirnames:
            ret['children'].append(get_file_tree(os.path.join(path, dirname)))
        for filename in filenames:
            ret['children'].append({'label': filename, 'isFolder': False, 'path': os.path.join(path, filename)})
        return ret # Stop recursive os.walk.
    return ret

def find_main_file(root: str) -> Optional[str]:
    for dirpath, _dirs, files in os.walk(root):
        for f in files:
            file_path = os.path.join(dirpath, f)
            content = read_file(file_path)
            if '@app(' in content or 'site[' in content:
                return file_path

def is_file_in_folder(file: str, root: str) -> bool:
    for _dirpath, _dirs, files in os.walk(root):
        if file in files:
            return True
    return False
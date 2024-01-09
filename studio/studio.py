import asyncio
import json
import os
import os.path
import re
import shutil
import sys
import time
from typing import Callable, Literal
import zipfile
from pathlib import Path
from string import Template
from subprocess import PIPE, STDOUT, Popen
from urllib.parse import urlparse

from h2o_wave import Q, app, main, ui
from importlib.metadata import version

import file_utils
import studio_editor as editor

import asyncio
import subprocess
import sys


# TODO update this app with by-name component access once the Wave version higher than 0.25.2 is available.

class Project:
    def __init__(self) -> None:
        self.dir = 'project'
        self.server_base_url = os.environ.get('H2O_WAVE_BASE_URL', '/')
        self.server_adress = self.get_server_address()
        self.internal_server_adress = os.environ.get('H2O_WAVE_ADDRESS', 'http://127.0.0.1:10101')
        self.app_host = urlparse(os.environ.get('H2O_WAVE_APP_ADDRESS', 'http://127.0.0.1:8000')).hostname
        self.app_port = '10102'
        self.vsc_extension_path = os.path.join('..', 'tools', 'vscode-extension')
        self.entry_point = os.path.join(self.dir, 'app.py')

    def get_server_address(self) -> str:
        cloud_env = os.environ.get('H2O_CLOUD_ENVIRONMENT', None)
        return f'{cloud_env}{self.server_base_url}' if cloud_env else os.environ.get('H2O_WAVE_ADDRESS',
                                                                                     'http://127.0.0.1:10101')

    def get_assets_url_for(self, url: str) -> str:
        return f'{self.server_base_url}assets/{url}'


project = Project()


def start(entry_point: str, is_app: bool):
    env = os.environ.copy()
    env['H2O_WAVE_BASE_URL'] = project.server_base_url
    env['H2O_WAVE_ADDRESS'] = project.internal_server_adress
    env['PYTHONUNBUFFERED'] = 'False'
    # The environment passed into Popen must include SYSTEMROOT, otherwise Popen will fail when called
    # inside python during initialization if %PATH% is configured, but without %SYSTEMROOT%.
    if sys.platform.lower().startswith('win'):
        env['SYSTEMROOT'] = os.environ['SYSTEMROOT']
    if is_app:
        env['H2O_WAVE_APP_ADDRESS'] = f'http://{project.app_host}:{project.app_port}'
        entry_point = project.entry_point.replace(os.sep, '.').replace('.py', '')
        return Popen([
            sys.executable, '-m', 'uvicorn',
            '--host', '0.0.0.0',
            '--port', project.app_port,
            f'{entry_point}:main',
        ], env=env, stdout=PIPE, stderr=STDOUT)
    else:
        return Popen([sys.executable, entry_point], env=env, stdout=PIPE, stderr=STDOUT)


async def stop_previous(q: Q) -> None:
    # Stop script if any.
    if not q.user.is_app and q.user.active_path:
        demo_page = q.site[q.user.active_path]
        demo_page.drop()
        await demo_page.save()
    # Stop app if any.
    if q.user.wave_process and q.user.wave_process.returncode is None:
        q.user.wave_process.terminate()
        q.user.wave_process.wait()
    if q.user.display_logs_future:
        q.user.display_logs_future.cancel()


async def setup_page(q: Q):
    py_content = ''
    # In prod.
    if os.path.exists('autocomplete_parser.py') and os.path.exists('autocomplete_utils.py'):
        py_content = file_utils.read_file('autocomplete_parser.py')
        py_content += file_utils.read_file('autocomplete_utils.py')
    # When run in development from Wave repo.
    elif os.path.exists(project.vsc_extension_path):
        py_content = file_utils.read_file(os.path.join(project.vsc_extension_path, 'server', 'parser.py'))
        py_content += file_utils.read_file(os.path.join(project.vsc_extension_path, 'server', 'utils.py'))
    if py_content:
        py_content += file_utils.read_file('autocomplete.py')
    template = Template(file_utils.read_file('studio.js')).substitute(
        snippets1=q.app.snippets1,
        snippets2=q.app.snippets2,
        file_content=file_utils.read_file(project.entry_point) or '',
        py_content=py_content,
        base_url=project.server_base_url,
        folder=json.dumps(file_utils.get_file_tree(project.dir)),
    )
    q.page['meta'] = ui.meta_card(
        box='',
        title='Wave Studio',
        scripts=[
            ui.script(project.get_assets_url_for('loader.min.js')),
            ui.script(project.get_assets_url_for('vue.prod.js')),
        ],
        script=ui.inline_script(content=template, requires=['require', 'Vue'], targets=['monaco-editor']),
        stylesheets=[ui.stylesheet(project.get_assets_url_for(f'studio.css?v={time.time()}'))],  # Cache busting.
        layouts=[
            ui.layout(breakpoint='xs', zones=[
                ui.zone('header'),
                ui.zone('main', size='calc(100vh - 80px)', direction=ui.ZoneDirection.ROW),
            ])
        ])
    q.page['header'] = ui.header_card(
        box='header',
        title='Wave Studio',
        subtitle='Develop Wave apps completely in browser',
        image=project.get_assets_url_for('h2o-logo.svg'),
        items=[
            ui.button(name='console', label='Console', icon='CommandPrompt'),
            ui.button(name='open_preview', label='Preview', icon='OpenInNewWindow'),
            ui.dropdown(name='dropdown', width='170px', trigger=True, value=(q.user.view or 'split'), choices=[
                ui.choice(name='split', label='Split view'),
                ui.choice(name='code', label='Full code view'),
                ui.choice(name='preview', label='Full preview view'),
            ]),
            ui.button(name='show_packages_dialog', label='Manage packages', icon='Packages'),
            ui.button(name='import_project', label='Import', icon='Upload'),
            ui.button(name='export_project', label='Export', icon='Download'),
        ]
    )
    editor_html = '''
<div id="editor">
  <div id="explorer">
    <div id="files">
        <div id="file-tree"></div>
        <div id="file-tree-menu"></div>
    </div>
    <div id="width-resizer"></div>
  </div>
  <div id="monaco-editor"></div>
</div>
    '''
    q.page['logs'] = ui.markdown_card(box=ui.box('main', width='0px'), title='Logs', content='')
    q.page['code'] = ui.markup_card(box=ui.box('main', width='100%'), title='', content=editor_html)
    show_empty_preview(q)


def show_empty_preview(q: Q):
    del q.page['preview']
    q.page['preview'] = ui.tall_info_card(
        box=ui.box('main', width=('0px' if q.user.view == "code" else '100%')),
        name='',
        image=project.get_assets_url_for('app_not_running.svg'),
        image_height='500px',
        title='Oops! There is no running app.',
        caption='Try writing one in the code editor on the left.'
    )


async def display_logs(q: Q) -> None:
    lines = []
    p = q.user.wave_process
    os.set_blocking(p.stdout.fileno(), False)
    while True:
        line = p.stdout.readline()
        if line:
            lines.append(line.decode('utf8'))
            code = ''.join(lines)
            q.page['logs'].content = f'```\n{code}\n```'
            q.page['meta'].script = ui.inline_script('scrollLogsToBottom()')
            await q.page.save()
        else:
            await q.sleep(0.5)


async def render_code(q: Q):
    if q.events.editor:
        code = file_utils.pythonify_js_code(q.events.editor.change if q.events.editor else '')
        with open(q.client.opened_file, 'w', encoding='utf-8') as f:
            f.write(code)
        if not project.entry_point and ('@app(' in code or 'site[' in code):
            project.entry_point = q.client.opened_file
    else:
        code = file_utils.read_file(q.client.opened_file)

    path = ''
    if q.client.opened_file == project.entry_point:
        app_match = re.search('\n@app\(.*(\'|\")(.*)(\'|\")', code)
        if app_match:
            path = app_match.group(2)
            q.user.is_app = True
        else:
            script_match = re.search('site\[(\'|\")(.*)(\'|\")\]', code)
            if script_match:
                path = script_match.group(2)
                q.user.is_app = False
        if not path:
            show_empty_preview(q)
            q.user.is_app = False
            return
        q.user.active_path = path

    await stop_previous(q)
    q.user.wave_process = start(project.entry_point, q.user.is_app)
    q.user.display_logs_future = asyncio.ensure_future(display_logs(q))
    del q.page['empty']

    path = path or q.user.active_path
    path = '' if path == '/' else path
    q.page['preview'] = ui.frame_card(
        box=ui.box('main', width=('0px' if q.user.view == 'code' else '100%')),
        title=f'Preview of {project.server_adress}{path}',
        path=f'{project.server_adress}{path}'
    )
    q.page['header'].items[1].button.disabled = False
    q.page['header'].items[1].button.path = f'{project.server_adress}{path}'


async def on_startup():
    file_utils.create_folder(project.dir)
    app_path = Path(project.entry_point)
    if not app_path.exists():
        shutil.copy('starter.py', app_path)
    start(os.path.join(Path(__file__).parent, 'landing.py'), False).communicate()


async def on_shutdown():
    file_utils.remove_folder(project.dir)


async def export(q: Q):
    shutil.make_archive('app', 'zip', '.', project.dir)
    q.app.zip_path, = await q.site.upload(['app.zip'])
    q.page["meta"].script = ui.inline_script(f'window.open("{q.app.zip_path}", "_blank");')
    os.remove("app.zip")


def get_package_dialog_items():
    packages_installed = []
    if os.path.exists('project/requirements.txt'):
        with open('project/requirements.txt', 'r') as file:
            for line in file.readlines():
                package_name, package_version = line.strip().split('==')
                packages_installed.append((package_name, package_version))
    return [
        ui.text_l('Installed packages'),
        ui.inline(
            direction='column', align='start',
            # List of installed packages.
            items=[
                ui.inline(align='end', items=[
                    ui.textbox(name='package_name', value=package_name, readonly=True),
                    ui.textbox(name='package_version', value=package_version, readonly=True),
                    ui.button('remove_package', label='Remove', value=package_name),
                ]) for package_name, package_version in packages_installed
            ],
        ) if packages_installed else ui.text(name='no_packages', content='No packages installed.'),
        ui.inline(
            align='end',
            justify='center',
            height='60px',
            items=[ui.buttons(items=[
                ui.button(name='show_add_package_fields', label='Add package', icon='Add', primary=True, width='200px'),
                ui.button(name='show_add_requirements', label='Add from requirements', icon='AddToShoppingList',
                        width='200px')
            ], justify='center')]
        ),
    ]


def get_output(output: str) -> str:
    return f'''
```
{output}
```
'''


async def show_progress(q: Q, msg: str):
    q.page['meta'].dialog.items = [
        ui.progress(label=msg),
        ui.expander(name='console_expander', label='Detail', items=[
            ui.text(name='console_out', content=get_output(''), width='100%'),
        ]),
        ui.button(name='cancel_pip_task', label='Cancel')
    ]
    await q.page.save()


async def update_progress(q: Q, value: int):
    q.page['meta'].dialog.items[1].expander.items[0].text.content = get_output(value)
    await q.page.save()


async def show_finish_message(q: Q, type: Literal['error', 'success'], title: str, output: str):
    q.page['meta'].dialog.items = [
        ui.message_bar(type=type, text=title),
        ui.expander(name='console_expander', label='Detail', items=[
            ui.text(name='console_out', content=get_output(output), width='100%'),
        ]),
        ui.button(name='finish_message_dismiss', label='Go to package manager')
    ]
    await q.page.save()


async def block_dialog(q: Q):
    q.page['meta'].dialog.closable = False
    q.page['meta'].dialog.blocking = True
    await q.page.save()


async def on_pip_finish(q: Q):
    q.page['meta'].dialog.blocking = False
    q.page['meta'].dialog.closable = True
    q.page['meta'].dialog.items = get_package_dialog_items()
    await q.page.save()


async def pip(q: Q, command: str, flag: str or None, package_name: str, package_version: str, progress_message: str,
              success_message: str, error_message: str, on_success: Callable = None, on_error: Callable = None):
    try:
        version = f'=={package_version}' if package_version else ''
        args = [sys.executable, '-m', 'pip', command, flag, f'{package_name}{version}']
        p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output = ''
        await block_dialog(q)
        await show_progress(q, progress_message)
        while True:
            if p.poll() is not None:
                # Process finished.
                if p.returncode == 0:
                    if on_success:
                        await on_success(package_name)
                    await show_finish_message(q, 'success', success_message, output)
                else:
                    if on_error:
                        await on_error()
                    output += f'\n{p.stderr.read().decode("utf-8")}'
                    await show_finish_message(q, 'error', error_message, output)
                break
            else:
                output += f'\n{p.stdout.readline().decode("utf-8")}'
                await update_progress(q, output)
    finally:
        if p.poll() is None:
            # Task canceled.
            p.stdout.close()
            p.stderr.close()
            p.kill()
            await on_pip_finish(q)


def update_requirements(packages: dict, remove=False):
    with open('project/requirements.txt', 'a+') as file:
        file.seek(0)
        lines = file.readlines()

    current_packages = {}
    for line in lines:
        package_name, package_version = line.strip().split('==')
        current_packages[package_name] = package_version

    if not remove:
        current_packages.update(packages)

    with open('project/requirements.txt', 'w') as file:
        for package_name, package_version in current_packages.items():
            if not remove or (remove and package_name not in packages):
                file.write(f'{package_name}=={package_version}\n')


async def on_install_success(package_name: str):
    update_requirements({f'{package_name}': version(package_name)})


async def on_uninstall_success(package_name: str):
    update_requirements({f'{package_name}': ''}, True)


async def on_requirements_install_success(package_name: str):
    packages = {}
    with open('project/requirements_tmp.txt', 'r') as file_tmp:
        for line in file_tmp.readlines():
            package_name = line.strip().removesuffix('\n').split('==')[
                0] if '==' in line else line.strip().removesuffix('\n')
            packages[package_name] = version(package_name)
    os.remove('project/requirements_tmp.txt')
    update_requirements(packages)


async def on_requirements_install_error():
    os.remove('project/requirements_tmp.txt')


async def show_packages_dialog(q: Q):
    q.page['meta'].dialog = ui.dialog(
        name='package_dialog',
        title='Manage packages',
        items=get_package_dialog_items(),
        closable=True,
        events=['dismissed'],
    )
    q.page.save()


@app('/studio', on_startup=on_startup, on_shutdown=on_shutdown)
async def serve(q: Q):
    if not q.app.initialized:
        # TODO: Serve snippets directly from static dir.
        # Prod.
        if os.path.exists('base-snippets.json') and os.path.exists('component-snippets.json'):
            q.app.snippets1, q.app.snippets2, = await q.site.upload(['base-snippets.json', 'component-snippets.json'])
        # When run in development from Wave repo.
        elif os.path.exists(project.vsc_extension_path):
            q.app.snippets1, q.app.snippets2, = await q.site.upload([
                os.path.join(project.vsc_extension_path, 'base-snippets.json'),
                os.path.join(project.vsc_extension_path, 'component-snippets.json')
            ])
        q.app.initialized = True
    if not q.client.initialized:
        await setup_page(q)
        q.client.opened_file = project.entry_point
        q.client.initialized = True
        await render_code(q)

    if q.args.dropdown:
        q.user.view = q.args.dropdown
        q.page['header'].items[2].dropdown.value = q.args.dropdown
    elif q.args.export_project:
        await export(q)
    elif q.args.import_project:
        q.page['meta'].dialog = ui.dialog(name='dialog', title='Import Project', events=['dismissed'], closable=True,
                                          items=[
                                              ui.message_bar(type='warning',
                                                             text='Current project files will be replaced with uploaded content.'),
                                              ui.file_upload(name='imported_project', file_extensions=['zip']),
                                          ])
    elif q.args.imported_project:
        zip_path = await q.site.download(q.args.imported_project[0], os.getcwd())
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            root_dirs = [f for f in zip_ref.filelist if f.is_dir() and f.filename.count(os.path.sep) == 1]
            if len(root_dirs) == 1:
                file_utils.remove_folder(project.dir)
                zip_ref.extractall()
                file_utils.remove_file(zip_path)
                q.page['meta'].dialog = None
                q.page['meta'].notification_bar = ui.notification_bar(
                    name='notification',
                    text='Project imported successfully!',
                    type='success',
                    position='top-right',
                    events=['dismissed'],
                )
                project.dir = root_dirs[0].filename.replace(os.path.sep, '')
                project.entry_point = file_utils.find_main_file(project.dir)
                q.client.opened_file = project.entry_point
                await render_code(q)
                editor.update_file_tree(q, project.dir)
                await q.page.save()
                editor.open_file(q, project.entry_point)
                if os.path.exists('project/requirements.txt'):
                    await show_packages_dialog(q)
                    q.client.task = asyncio.create_task(pip(
                        q,
                        'install',
                        '-r',
                        'project/requirements.txt',
                        None,
                        'Installing packages from requirements.txt',
                        f'Packages from requirements.txt installed successfully.',
                        f'Error installing requirements.txt.',
                        None,
                        on_requirements_install_error
                    ))
            else:
                q.page['meta'].dialog.items = [
                    ui.message_bar(type='error', text='There must be exactly 1 root folder.'),
                    ui.button(name='import_project', label='Import again', icon='Upload'),
                ]
    elif q.args.show_packages_dialog:
        await show_packages_dialog(q)
    elif q.events.package_dialog and q.events.package_dialog.dismissed:
        q.page['meta'].dialog = None
    elif q.args.show_add_requirements:
        q.page['meta'].dialog.items[2] = ui.file_upload(name='upload_requirements', file_extensions=['txt'],
                                                        label='Install packages',
                                                        tooltip='Packages from requirements.txt will be added to already installed packages.')
    elif q.args.upload_requirements:
        os.mkdir('project/tmp')
        file = await q.site.download(q.args.upload_requirements[0], os.path.join(os.getcwd(), 'project/tmp'))
        shutil.copy(file, 'project/requirements_tmp.txt')
        shutil.rmtree('project/tmp')
        q.client.task = asyncio.create_task(pip(
            q,
            'install',
            '-r',
            'project/requirements_tmp.txt',
            None,
            'Installing packages from requirements.txt',
            f'Packages from requirements.txt installed successfully.',
            f'Error installing requirements.txt.',
            on_requirements_install_success,
            on_requirements_install_error
        ))
    elif q.args.show_add_package_fields:
        q.page['meta'].dialog.items[2] = ui.inline(items=[
            ui.textbox(name='package_name', label='Package name', required=True),
            ui.textbox(name='package_version', label='Version', placeholder='(latest)'),
            ui.button('add_package', label='Add', primary=True),
        ], align='end')
    elif q.args.add_package:
        if not q.args.package_name:
            q.page['meta'].dialog.items[2].inline.items[0].textbox.error = 'Package name cannot be empty.'
        else:
            package = f'{q.args.package_name}{q.args.package_version}'
            q.client.task = asyncio.create_task(pip(
                q,
                'install',
                '-U',
                q.args.package_name,
                q.args.package_version,
                f'Installing {package}',
                f'{package} installed successfully.',
                f'Error installing {package}',
                on_install_success
            ))
    elif q.args.remove_package:
        package = f'{q.args.package_name}{q.args.package_version}'
        q.client.task = asyncio.create_task(pip(
            q,
            'uninstall',
            '-y',
            q.args.remove_package,
            None,
            f'Uninstalling {package}',
            f'{package} uninstalled successfully.',
            f'Error installing {package}',
            on_uninstall_success
        ))
    elif q.args.cancel_pip_task:
        q.client.task.cancel()
    elif q.args.finish_message_dismiss:
        await on_pip_finish(q)
    elif q.args.dropdown == 'code':
        q.page['preview'].box = ui.box('main', width='0px')
        q.page['code'].box = ui.box('main', width='100%')
    elif q.args.dropdown == 'split':
        q.page['preview'].box = ui.box('main', width='100%')
        q.page['code'].box = ui.box('main', width='100%')
    elif q.args.dropdown == 'preview':
        q.page['preview'].box = ui.box('main', width='100%')
        q.page['code'].box = ui.box('main', width='0px')
    elif q.args.console:
        q.page['preview'].box = ui.box('main', width='100%')
        q.page['code'].box = ui.box('main', width='0px')
        q.page['logs'].box = ui.box('main', width='100%')
        q.page['header'].items[0].button.name = 'show_code'
        q.page['header'].items[0].button.label = 'Code'
        q.page['header'].items[0].button.icon = 'Code'
    elif q.args.show_code:
        q.page['preview'].box = ui.box('main', width='100%')
        q.page['logs'].box = ui.box('main', width='0px')
        q.page['code'].box = ui.box('main', width='100%')
        q.page['header'].items[0].button.name = 'console'
        q.page['header'].items[0].button.label = 'Console'
        q.page['header'].items[0].button.icon = 'CommandPrompt'

    if q.events.editor:
        await render_code(q)
    elif q.events.dialog and q.events.dialog.dismissed:
        q.page['meta'].dialog = None
    elif q.events.notification and q.events.notification.dismissed:
        q.page['meta'].notification_bar = None
    elif q.events.file_viewer:
        e = q.events.file_viewer
        if e.new_file:
            new_file = os.path.join(e.new_file['path'], e.new_file['name'])
            file_utils.create_file(new_file)
            editor.open_file(q, new_file)
            await q.page.save()
        elif e.new_folder:
            file_utils.create_folder(os.path.join(e.new_folder['path'], e.new_folder['name']))
        elif e.remove_file:
            file_to_remove = e.remove_file
            file_utils.remove_file(file_to_remove)
            if file_to_remove == project.entry_point:
                project.entry_point = None
                show_empty_preview(q)
            if file_to_remove == q.client.opened_file:
                editor.clean_editor(q)
                await q.page.save()
        elif e.remove_folder:
            if file_utils.is_file_in_folder(project.entry_point, e.remove_folder):
                project.entry_point = None
                show_empty_preview(q)
                await q.page.save()
            if file_utils.is_file_in_folder(q.client.opened_file, e.remove_folder):
                editor.clean_editor(q)
                await q.page.save()
            file_utils.remove_folder(e.remove_folder)
        elif e.rename_file:
            path = e.rename_file['path']
            new_name = e.rename_file['name']
            if path == project.entry_point:
                project.entry_point = new_name
            elif path == q.client.opened_file:
                q.client.opened_file = new_name
            file_utils.rename(path, new_name)
        elif e.rename_folder:
            path = e.rename_folder['path']
            new_name = e.rename_folder['name']
            if path == project.dir:
                project.dir = new_name
            if file_utils.is_file_in_folder(q.client.opened_file, path):
                q.client.opened_file = os.path.join(new_name, *q.client.opened_file.split(os.path.sep)[1:])
            if file_utils.is_file_in_folder(project.entry_point, path):
                project.entry_point = os.path.join(new_name, *project.entry_point.split(os.path.sep)[1:])
            file_utils.rename(path, new_name)
        elif e.open:
            q.client.opened_file = e.open
            editor.open_file(q, e.open)
            await q.page.save()
        editor.update_file_tree(q, project.dir)

    await q.page.save()

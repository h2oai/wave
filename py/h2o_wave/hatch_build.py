import os
import shutil
import sys
from typing import Any, Dict

from hatchling.builders.hooks.plugin.interface import BuildHookInterface
from hatchling.metadata.plugin.interface import MetadataHookInterface


# Creates a metadata file to get easy access to platform/OS arch when needed.
def create_metadata_file(platform: str, arch: str):
    with open(os.path.join('h2o_wave', 'metadata.py'), 'w') as f:
        f.write(f'''
# Generated in hatch_build.py.
__platform__ = "{platform}"
__arch__ = "{arch}"
        ''')

class CustomMetadataHook(MetadataHookInterface):
    def update(self, metadata: dict) -> None:
        metadata['version'] = os.environ.get('VERSION', metadata['version'])


class CustomBuildHook(BuildHookInterface):
    def initialize(self, _version, build_data):
        platform = os.environ.get('H2O_WAVE_PLATFORM')
        print(f'Building for platform: {platform}')
        if not platform:
            # Create a default metadata file in case of noarch builds.
            create_metadata_file('linux', 'amd64')
            return

        build_data['tag'] = f'py3-none-{platform}'
        build_data['pure_python'] = False

        version = os.environ.get('VERSION')
        if not version:
            raise Exception('VERSION environment variable must be set.')

        arch = 'arm64' if platform.endswith('arm64') else 'amd64'
        operating_system = 'darwin'
        if platform == 'win_amd64':
            operating_system = 'windows'
        elif platform == 'manylinux1_x86_64':
            operating_system = 'linux'

        # binaries_path = os.path.join('..', '..', 'build', f'wave-{version}-{operating_system}-{arch}')
        binaries_path = os.path.join('conda', 'temp')
        if not os.path.exists(binaries_path):
            raise Exception(f'{binaries_path} does not exist. Run make release first to generate server binaries.')

        self.copy_files(binaries_path, 'tmp', ['demo', 'examples', 'test'])
        self.copy_files('project_templates', 'tmp', [], True)
        shutil.rmtree(binaries_path, ignore_errors=True) # Only if conda!!

        create_metadata_file(operating_system, arch)

    def copy_files(self, src, dst, ignore, keep_dir=False) -> None:
        for file_name in os.listdir(src):
            src_file = os.path.join(src, file_name)
            dst_file = os.path.join(dst, src if keep_dir else '', file_name)
            if os.path.isfile(src_file):
                os.makedirs(os.path.dirname(dst_file), exist_ok=True)
                shutil.copy(src_file, dst_file)
            elif os.path.isdir(src_file) and file_name not in ignore:
                self.copy_files(src_file, dst_file, ignore)

    def finalize(self, version: str, build_data: Dict[str, Any], artifact_path: str) -> None:
        shutil.rmtree('tmp', ignore_errors=True)
        shutil.rmtree('info/recipe/temp', ignore_errors=True) # Conda only!!


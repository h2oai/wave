import os

from hatchling.metadata.plugin.interface import MetadataHookInterface


class CustomMetadataHook(MetadataHookInterface):
    def update(self, metadata: dict) -> None:
        version = os.environ.get('VERSION', metadata['version'])
        metadata['version'] = version
        metadata['dependencies'] = [f'h2o-wave=={version}']

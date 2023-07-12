import os

from hatchling.metadata.plugin.interface import MetadataHookInterface


class CustomMetadataHook(MetadataHookInterface):
    def update(self, metadata: dict) -> None:
        metadata['version'] = os.environ.get('VERSION', metadata['version'])

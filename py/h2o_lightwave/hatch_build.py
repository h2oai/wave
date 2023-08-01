import os

from hatchling.metadata.plugin.interface import MetadataHookInterface


class CustomMetadataHook(MetadataHookInterface):
    def update(self, metadata: dict) -> None:
        version = os.environ.get('VERSION', metadata['version'])
        metadata['version'] = version
        metadata['optional-dependencies'] = { 'web': [f'h2o_lightwave_web=={version}'] }

import os.path
import sys
import uuid
from enum import Enum
from typing import Optional

try:
    import h2o
    from h2o.automl import H2OAutoML
except ImportError:
    pass

from .core import _config


WaveModelType = Enum('WaveModelType', 'H2O3 DAI')


class WaveModel:
    def __init__(self, type_: WaveModelType):
        self.type_ = type_

    def load(self, id_: str):
        raise NotImplementedError()

    def ingest(self, filename: str):
        raise NotImplementedError()

    def build(self, target: str):
        raise NotImplementedError()

    def predict(self, filename: str, output_folder: str = '', **kwargs) -> str:
        raise NotImplementedError()


class H2O3Model(WaveModel):

    INIT = False

    def __init__(self):
        super().__init__(WaveModelType.H2O3)
        if not H2O3Model.INIT:
            if _config.h2o3_url != '':
                h2o.init(url=_config.h2o3_url)
            else:
                h2o.init()
            H2O3Model.INIT = True
        self.frame: Optional[h2o.H2OFrame] = None
        self.version: str = h2o.__version__
        self.aml: Optional[H2OAutoML] = None
        self.id_ = ''

    @staticmethod
    def make_id():
        """Generate random project id. H2O3 project name cannot start with a number."""
        u = uuid.uuid4()
        return f'uuid-{u}'

    def load(self, id_: str):
        # H2O-3 needs to be running standalone for this to work
        self.aml = h2o.automl.get_automl(id_)
        self.id_ = id_

    def ingest(self, filename: str):
        if os.path.exists(filename):
            self.frame = h2o.import_file(filename)
        else:
            raise ValueError('file not found')

    def build(self, target: str):
        self.id_ = H2O3Model.make_id()
        self.aml = H2OAutoML(max_runtime_secs=30, project_name=self.id_)
        cols = list(self.frame.columns)
        cols.remove(target)
        self.aml.train(x=cols, y=target, training_frame=self.frame)

    def predict(self, filename: str, output_folder: str = '', **kwargs) -> str:
        if os.path.exists(filename):
            input_ = h2o.import_file(filename)
            if self.aml is None:
                raise ValueError('run build before: no model')
            frame = self.aml.predict(input_)
            u = H2O3Model.make_id()
            output_path = os.path.join(output_folder, f'{u}.csv')
            h2o.export_file(frame, output_path, True)
            return output_path
        else:
            raise ValueError('file not found')


class DAIModel(WaveModel):
    def __init__(self):
        super().__init__(WaveModelType.DAI)

    def load(self, id_: str):
        ...

    def ingest(self, filename: str):
        ...

    def build(self, target: str):
        ...

    def predict(self, filename: str, output_folder: str = '', **kwargs) -> str:
        ...


def _determine_model_instance() -> WaveModel:
    if 'h2o' in sys.modules:
        return H2O3Model()
    raise RuntimeError('library not found')


def build_model(file: str = '', target: str = '', model_type: Optional[WaveModelType] = None) -> WaveModel:
    m = None
    if model_type is not None:
        if model_type == WaveModelType.H2O3:
            m = H2O3Model()
        elif model_type == WaveModelType.DAI:
            m = DAIModel()
    else:
        m = _determine_model_instance()
    m.ingest(file)
    m.build(target)
    return m


def get_model(id_: str, model_type: Optional[WaveModelType] = None) -> WaveModel:
    m = None
    if model_type is not None:
        if model_type == WaveModelType.H2O3:
            m = H2O3Model()
        elif model_type == WaveModelType.DAI:
            m = DAIModel()
    else:
        m = _determine_model_instance()
    m.load(id_)
    return m


def deploy_model(model: WaveModel):
    if isinstance(model, H2O3Model):
        raise ValueError('H2O-3 models not supported: cannot deploy')
    raise NotImplementedError()

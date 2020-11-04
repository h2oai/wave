import os.path
import sys
import uuid
from enum import Enum
from typing import Optional

import h2o
from h2o.automl import H2OAutoML

from .core import _config


WaveModelType = Enum('WaveModelType', 'H2O3 DAI')
WaveModelMetric = Enum('WaveModelMetric', 'AUTO AUC MSE RMSE MAE RMSLE DEVIANCE LOGLOSS AUCPR')


class WaveModel:
    def __init__(self, id_: str, type_: WaveModelType):
        self.id = id_
        self.type = type_

    def predict(self, inputs, **kwargs):
        raise NotImplementedError()


class _H2O3Model(WaveModel):

    INIT = False

    def __init__(self, id_: str, aml: H2OAutoML):
        super().__init__(id_, WaveModelType.H2O3)
        self.aml: H2OAutoML = aml

    @staticmethod
    def _make_id():
        """Generate random project id.
        H2O3 project name cannot start with a number (no matter it's string).
        """
        u = uuid.uuid4()
        return f'uuid-{u}'

    @classmethod
    def _init(cls):
        if not cls.INIT:
            if _config.h2o3_url != '':
                h2o.init(url=_config.h2o3_url)
            else:
                h2o.init()
            cls.INIT = True

    @staticmethod
    def build(filename: str, target: str, metric: WaveModelMetric) -> WaveModel:

        _H2O3Model._init()

        frame = None
        if os.path.exists(filename):
            frame = h2o.import_file(filename)
        else:
            raise ValueError('file not found')

        id_ = _H2O3Model._make_id()
        aml = H2OAutoML(max_runtime_secs=30, project_name=id_, stopping_metric=metric.name)
        cols = list(frame.columns)
        cols.remove(target)
        aml.train(x=cols, y=target, training_frame=frame)
        return _H2O3Model(id_, aml)

    @staticmethod
    def get(id_: str):
        # H2O-3 needs to be running standalone for this to work

        _H2O3Model._init()

        aml = h2o.automl.get_automl(id_)
        return _H2O3Model(id_, aml)

    def predict(self, inputs, **kwargs):
        training_frame_id = self.aml.input_spec['training_frame']
        training_frame = h2o.H2OFrame.get_frame(training_frame_id, rows=0)
        iframe = h2o.H2OFrame(python_obj=inputs, header=1, column_names=training_frame.names)
        oframe = self.aml.predict(iframe)

        if 'pandas' in sys.modules:
            return oframe.as_data_frame(use_pandas=True)
        return oframe.as_data_frame(use_pandas=False)


def build_model(filename: str, target: str, metric: WaveModelMetric = WaveModelMetric.AUTO,
                model_type: Optional[WaveModelType] = None) -> WaveModel:
    if model_type is not None:
        if model_type == WaveModelType.H2O3:
            return _H2O3Model.build(filename, target, metric)
        elif model_type == WaveModelType.DAI:
            raise NotImplementedError()
    return _H2O3Model.build(filename, target, metric)


def get_model(id_: str, model_type: Optional[WaveModelType] = None) -> WaveModel:
    if model_type is not None:
        if model_type == WaveModelType.H2O3:
            return _H2O3Model.get(id_)
        elif model_type == WaveModelType.DAI:
            raise NotImplementedError()
    return _H2O3Model.get(id_)


def deploy_model(model: WaveModel):
    if isinstance(model, _H2O3Model):
        raise ValueError('H2O-3 models not supported: cannot deploy')
    raise NotImplementedError()

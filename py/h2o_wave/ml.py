import os.path
import uuid
from enum import Enum
from typing import Optional

import h2o
from h2o.automl import H2OAutoML

from .core import _config


WaveModelType = Enum('WaveModelType', 'H2O3 DAI')
WaveModelMetric = Enum('WaveModelMetric', 'AUTO AUC MSE RMSE MAE RMSLE DEVIANCE LOGLOSS AUCPR')


class WaveModel:
    """Represents a common interface for a model. It references DAI or H2O-3 model in backend."""

    def __init__(self, id_: str, type_: WaveModelType):
        self.id = id_
        """The id of a model that identifies it on a backend service."""
        self.type = type_
        """A wave model type represented by `h2o_wave.ml.WaveModelType` enum."""

    def predict(self, inputs, **kwargs):
        """Predict values based on inputs.

        Inputs follow the `python_obj` spec here: http://docs.h2o.ai/h2o/latest-stable/h2o-py/docs/frame.html#h2oframe
        This is a temporary solution. The contract needs to be stabilized.

        Args:
            inputs: A python obj. [[1, 'a'], [2, 'b'], [3, 'c']]) will create 3 rows and 2 columns.

        Returns:
            A list of lists representing rows.

        Examples:

            >>> # Two rows and three columns:
            >>> model.predict([[1, 12.3, 'aa', 32.5], [2, 15.6, 'bb', 89.9]])
            [[16.6], [17.8]]
        """

        raise NotImplementedError()


class _H2O3Model(WaveModel):

    INIT = False

    def __init__(self, id_: str, aml: H2OAutoML):
        super().__init__(id_, WaveModelType.H2O3)
        self.aml = aml

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
        training_frame = h2o.get_frame(training_frame_id, rows=0)

        # The column_names are explicitly required
        iframe = h2o.H2OFrame(python_obj=inputs, header=-1, column_names=training_frame.names)
        oframe = self.aml.predict(iframe)
        return oframe.as_data_frame(use_pandas=False, header=False)


def build_model(filename: str, target: str, metric: WaveModelMetric = WaveModelMetric.AUTO,
                model_type: Optional[WaveModelType] = None) -> WaveModel:
    """Build a model.

    Id `model_type` not specified the function will determine correct model based on a current environment.

    Args:
        filename: A path for a dataset to be used as a train set.
        target: A name of the response column.
        metric: A metric to be used in building process specified by `h2o_wave.ml.WaveModelMetric`
        model_type: Optionally a model type specified by `h2o_wave.ml.WaveModelType`.

    Returns:
        A wave model.
    """

    if model_type is not None:
        if model_type == WaveModelType.H2O3:
            return _H2O3Model.build(filename, target, metric)
        elif model_type == WaveModelType.DAI:
            raise NotImplementedError()
    return _H2O3Model.build(filename, target, metric)


def get_model(id_: str, model_type: Optional[WaveModelType] = None) -> WaveModel:
    """Get a model that is already built on a backend.

    Args:
        id_: Identification string of a model.
        model_type: Optionally a model type specified by `h2o_wave.ml_WaveModelType`.

    Returns:
        A wave model.
    """

    if model_type is not None:
        if model_type == WaveModelType.H2O3:
            return _H2O3Model.get(id_)
        elif model_type == WaveModelType.DAI:
            raise NotImplementedError()
    return _H2O3Model.get(id_)


def deploy_model(model: WaveModel):
    """Deploy a model. (To be done)"""
    if isinstance(model, _H2O3Model):
        raise ValueError('H2O-3 models not supported: cannot deploy')
    raise NotImplementedError()

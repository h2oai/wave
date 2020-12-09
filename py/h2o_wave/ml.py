import os.path
import uuid
from enum import Enum
import tempfile
from typing import Optional, Union, List, Tuple

import datatable as dt
import h2o
from h2o.automl import H2OAutoML
from h2o.estimators.estimator_base import H2OEstimator


from .core import _config


WaveModelBackendType = Enum('WaveModelBackendType', 'H2O3 DAI')
WaveModelMetric = Enum('WaveModelMetric', 'AUTO AUC MSE RMSE MAE RMSLE DEVIANCE LOGLOSS AUCPR LIFT_TOP_GROUP'
                                          'MISCLASSIFICATION MEAN_PER_CLASS_ERROR')
DataSourceObj = Union[str, List[List]]


def _make_id() -> str:
    """Generate random id."""

    return str(uuid.uuid4())


class _DataSource:
    """Helper class represents a various data sources that can be lazily transformed into another data type."""

    def __init__(self, data: DataSourceObj):
        self._data = data
        self._h2o3_frame: Optional[h2o.H2OFrame] = None

    def _to_h2o3_frame(self) -> h2o.H2OFrame:
        if isinstance(self._data, str):
            filename = self._data
            if os.path.exists(filename):
                return h2o.import_file(filename)
            else:
                raise ValueError('file not found')
        elif isinstance(self._data, List):
            return h2o.H2OFrame(python_obj=self._data, header=1)
        raise ValueError('unknown data type')

    @property
    def h2o3_frame(self) -> h2o.H2OFrame:
        if self._h2o3_frame is None:
            self._h2o3_frame = self._to_h2o3_frame()
        return self._h2o3_frame

    @property
    def filename(self) -> str:
        if isinstance(self._data, str):
            return self._data
        elif isinstance(self._data, List):
            raise NotImplementedError()
        raise ValueError('unknown data type')


class WaveModelBackend:
    """Represents a common interface for a model backend. It references DAI or H2O-3 under the hood."""

    def __init__(self, type_: WaveModelBackendType):
        self.type = type_
        """A wave model backend type represented by `h2o_wave.ml.WaveModelBackendType` enum."""

    def predict(self, inputs: DataSourceObj, **kwargs) -> List[Tuple]:
        """Predicts values based on inputs.
        Args:
            inputs: A python obj or filename. A header needs to be specified for the python obj.
        Returns:
            A list of tuples representing predicted values.
        Examples:
            >>> from h2o_wave.ml import build_model
            >>> model = build_model(...)
            >>> # Three rows and two columns:
            >>> model.predict([['ID', 'Letter'], [1, 'a'], [2, 'b'], [3, 'c']])
            [(16.6,), (17.8,), (18.9,)]
        """

        raise NotImplementedError()


class _H2O3ModelBackend(WaveModelBackend):

    INIT = False
    MAX_RUNTIME_SECS = 60 * 60
    MAX_MODELS = 20
    INT_TO_CAT_THRESHOLD = 50

    def __init__(self, model: H2OEstimator):
        super().__init__(WaveModelBackendType.H2O3)
        self.model = model

    @staticmethod
    def _make_project_id() -> str:
        """Generates random project id."""

        # H2O3 project name cannot start with a number (no matter it's string).
        u = _make_id()
        return f'aml-{u}'

    @classmethod
    def _ensure(cls):
        """Initializes H2O-3."""

        if not cls.INIT:
            if _config.h2o3_url != '':
                h2o.init(url=_config.h2o3_url)
            else:
                h2o.init()
            cls.INIT = True

    @classmethod
    def _is_classification_task(cls, frame: h2o.H2OFrame, target: str) -> bool:
        target_type = frame.type(target)
        if target_type == 'str':
            return True
        if target_type == 'int':
            uniques = frame[target].unique()
            if len(uniques) < cls.INT_TO_CAT_THRESHOLD:
                return True
        return False

    @classmethod
    def build(cls, filename: str, target: str, metric: WaveModelMetric, **aml_settings) -> WaveModelBackend:
        """Builds an H2O-3 based model and returns it in a backend wrapper."""

        cls._ensure()

        id_ = cls._make_project_id()
        aml = H2OAutoML(max_runtime_secs=aml_settings.get('max_runtime_secs', cls.MAX_RUNTIME_SECS),
                        max_models=aml_settings.get('max_models', cls.MAX_MODELS),
                        project_name=id_,
                        stopping_metric=metric.name,
                        sort_metric=metric.name)

        if os.path.exists(filename):
            frame = h2o.import_file(filename)
        else:
            raise ValueError('file not found')

        cols = list(frame.columns)

        try:
            cols.remove(target)
        except ValueError:
            raise ValueError('no target column')

        if cls._is_classification_task(frame, target):
            frame[target] = frame[target].asfactor()

        aml.train(x=cols, y=target, training_frame=frame)
        return _H2O3ModelBackend(aml.leader)

    @classmethod
    def get(cls, id_: str) -> WaveModelBackend:
        """Gets a model identified by an AutoML project id.
        H2O-3 needs to be running standalone for this to work.

        Args:
            id_: Identification of the aml project on a running h2o-3 instance.
        Returns:
            A wave model.
        """

        cls._ensure()

        aml = h2o.automl.get_automl(id_)
        return _H2O3ModelBackend(aml.leader)

    def predict(self, data: DataSourceObj, **kwargs) -> List[Tuple]:
        """Predicts on a model."""

        ds = _DataSource(data)
        input_frame = ds.h2o3_frame
        output_frame = self.model.predict(input_frame)

        with tempfile.TemporaryDirectory() as tmp_dir_name:
            filename = os.path.join(tmp_dir_name, _make_id() + '.csv')
            h2o.download_csv(output_frame, filename)
            prediction = dt.fread(filename)
            return prediction.to_tuples()


def build_model(filename: str, target: str, metric: WaveModelMetric = WaveModelMetric.AUTO,
                model_backend_type: Optional[WaveModelBackendType] = None, **kwargs) -> WaveModelBackend:
    """Builds a model.
    If `model_backend_type` not specified the function will determine correct backend model based on a current
    environment.

    Args:
        filename: A string containing the filename to a dataset.
        target: A name of the target column.
        metric: A metric to be used during the building process specified by `h2o_wave.ml.WaveModelMetric`.
                It Defaults to AUTO.
        model_backend_type: Optionally a backend model type specified by `h2o_wave.ml.WaveModelBackendType`.
        kwargs: Optional parameters passed to the backend.
    Returns:
        A wave model.
    """

    if model_backend_type is not None:
        if model_backend_type == WaveModelBackendType.H2O3:
            return _H2O3ModelBackend.build(filename, target, metric, **kwargs)
        raise NotImplementedError()

    return _H2O3ModelBackend.build(filename, target, metric, **kwargs)


def get_model(id_: str, model_type: Optional[WaveModelBackendType] = None) -> WaveModelBackend:
    """Get a model that can be accessed on a backend.

    Args:
        id_: Identification of a model.
        model_type: Optionally a model backend type specified by `h2o_wave.ml_WaveModelType`.
    Returns:
        A wave model.
    """

    if model_type is not None:
        if model_type == WaveModelBackendType.H2O3:
            return _H2O3ModelBackend.get(id_)
        raise NotImplementedError()

    return _H2O3ModelBackend.get(id_)


def save_model(backend: WaveModelBackend, folder: str) -> str:
    """Save a model to disk.

    Args:
       backend: A model backend produced by build_model.
       folder: A directory where the saved model will be put to.
    Returns:
        Path to a saved model.
    """

    if isinstance(backend, _H2O3ModelBackend):
        return h2o.download_model(backend.model, path=folder)
    raise NotImplementedError()


def load_model(filename: str) -> WaveModelBackend:
    """Load a model from disk into the instance.

    Args:
        filename: Path to saved model.
    Returns:
        A wave model.
    """

    _H2O3ModelBackend._ensure()

    model = h2o.upload_model(path=filename)
    return _H2O3ModelBackend(model)

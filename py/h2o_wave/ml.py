import os.path
import uuid
from enum import Enum
import tempfile
from typing import Optional, Union, List, Tuple

import datatable as dt
import driverlessai
import h2o
from h2o.automl import H2OAutoML
from h2o.estimators.estimator_base import H2OEstimator
import h2osteam
from h2osteam.clients import MultinodeClient

from .core import _config


WaveModelBackendType = Enum('WaveModelBackendType', 'H2O3 DAI')
WaveModelMetric = Enum('WaveModelMetric', 'AUTO AUC MSE RMSE MAE RMSLE DEVIANCE LOGLOSS AUCPR LIFT_TOP_GROUP'
                                          'MISCLASSIFICATION MEAN_PER_CLASS_ERROR')
DataSourceObj = Union[str, List[List]]


def _make_id() -> str:
    """Generate random id."""
    return str(uuid.uuid4())


class _DataSource:
    """Represents a various data sources that can be lazily transformed into another data type."""

    def __init__(self, data: DataSourceObj, column_names: Optional[List[str]] = None,
                 column_types: Optional[List[str]] = None):
        self._data = data
        self._h2o3_frame: Optional[h2o.H2OFrame] = None
        self._column_names: Optional[List[str]] = column_names
        self._column_types: Optional[List[str]] = column_types

    def _to_h2o3_frame(self) -> h2o.H2OFrame:
        if isinstance(self._data, str):
            filename = self._data
            if os.path.exists(filename):
                return h2o.import_file(filename)
            else:
                raise ValueError('file not found')
        elif isinstance(self._data, List):
            if self._column_names is not None:
                return h2o.H2OFrame(python_obj=self._data, header=-1, column_names=self._column_names,
                                    column_types=self._column_types)
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
        """A wave model backend type represented by `h2o_wave.ml.WaveModelBackendType` enum. It's either DAI or H2O3."""

    def predict(self, inputs: DataSourceObj, **kwargs) -> List[Tuple]:
        """Predict values based on inputs.

        Args:
            inputs: A python obj or filename. e.g. [['ID', 'Letter'], [1, 'a'], [2, 'b'], [3, 'c']] will create 3 rows
                    and 2 columns.
                    Header needs to be specified for a python obj.

        Returns:
            A list of tuples representing predicted values in a rows.

        Examples:

            >>> # Two rows and three columns:
            >>> from h2o_wave.ml import build_model
            >>> model = build_model()
            >>> model.predict([[1, 12.3, 'aa', 32.5], [2, 15.6, 'bb', 89.9]])
            [(16.6,), (17.8,)]
        """
        raise NotImplementedError()


class _H2O3ModelBackend(WaveModelBackend):

    INIT = False
    MAX_RUNTIME_SECS = 60 * 60
    MAX_MODELS = 20

    def __init__(self, model: H2OEstimator):
        super().__init__(WaveModelBackendType.H2O3)
        self.model = model

    @staticmethod
    def _make_project_id() -> str:
        """Generate random project id.
        H2O3 project name cannot start with a number (no matter it's string).
        """
        u = _make_id()
        return f'uuid-{u}'

    @classmethod
    def _ensure(cls):
        if not cls.INIT:
            if _config.h2o3_url != '':
                h2o.init(url=_config.h2o3_url)
            else:
                h2o.init()
            cls.INIT = True

    @staticmethod
    def build(filename: str, target: str, metric: WaveModelMetric, **aml_settings) -> WaveModelBackend:

        _H2O3ModelBackend._ensure()

        id_ = _H2O3ModelBackend._make_project_id()
        aml = H2OAutoML(max_runtime_secs=aml_settings.get('max_runtime_secs', _H2O3ModelBackend.MAX_RUNTIME_SECS),
                        max_models=aml_settings.get('max_models', _H2O3ModelBackend.MAX_MODELS),
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

        aml.train(x=cols, y=target, training_frame=frame)
        return _H2O3ModelBackend(aml.leader)

    @staticmethod
    def get(id_: str) -> WaveModelBackend:
        """Get a model identified by an AutoML project id.
        H2O-3 needs to be running standalone for this to work.
        """

        _H2O3ModelBackend._ensure()

        aml = h2o.automl.get_automl(id_)
        return _H2O3ModelBackend(aml.leader)

    def predict(self, data: DataSourceObj, **kwargs) -> List[Tuple]:

        ds = _DataSource(data)
        iframe = ds.h2o3_frame

        oframe = self.model.predict(iframe)
        with tempfile.TemporaryDirectory() as tmpdirname:
            filename = os.path.join(tmpdirname, _make_id() + '.csv')
            h2o.download_csv(oframe, filename)
            prediction = dt.fread(filename)
            return prediction.to_tuples()


class _DAIModelBackend(WaveModelBackend):

    _INSTANCE = None
    _CLUSTER_NAME = 'wave-dai-multinode-1'

    def __init__(self, experiment):
        super().__init__(WaveModelBackendType.DAI)
        self.experiment = experiment

    @classmethod
    def _instance(cls):
        if cls._INSTANCE is None:
            if _config.steam_address:
                h2osteam.login(url=_config.steam_address,
                               username=_config.steam_username,
                               password=_config.steam_password,
                               verify_ssl=True)
                cluster = MultinodeClient.get_cluster(cls._CLUSTER_NAME)
                cls._INSTANCE = cluster.connect()

            elif _config.dai_address:
                cls._INSTANCE = driverlessai.Client(address=_config.dai_address,
                                                    username=_config.dai_username,
                                                    password=_config.dai_password)
            else:
                raise RuntimeError('no backend service available')
        return cls._INSTANCE

    @staticmethod
    def _determine_task_type(summary) -> str:
        """Guess if a task type for a DAI is of `regression` or `classification`."""
        if summary.data_type in ('int', 'real'):
            if summary.unique > 50:
                return 'regression'
        return 'classification'

    @staticmethod
    def build(filename: str, target: str, metric: WaveModelMetric, **experiment_settings) -> WaveModelBackend:

        dai = _DAIModelBackend._instance()

        dataset_id = _make_id()
        dataset = dai.datasets.create(filename, name=dataset_id)

        try:
            summary = dataset.column_summaries(columns=[target])[0]
        except KeyError:
            raise ValueError('no target column')

        task_type = experiment_settings.get('task', _DAIModelBackend._determine_task_type(summary))

        # ATTENTION: Not a portable solution (use preview or search_expert_settings).
        is_classification = True if task_type == 'classification' else False
        params = dai._backend.get_experiment_tuning_suggestion(dataset_key=dataset.key, target_col=target,
                                                               is_classification=is_classification,
                                                               is_time_series=False, is_image=False,
                                                               config_overrides=None, cols_to_drop=[])

        es = experiment_settings  # A shortcut.
        es['accuracy'] = es.get('accuracy', params.accuracy)
        es['time'] = es.get('time', params.time)
        es['interpretability'] = es.get('interpretability', params.interpretability)
        es['task'] = task_type
        es['scorer'] = params.score_f_name if metric == WaveModelMetric.AUTO else metric.name
        es['train_dataset'] = dataset
        es['target_column'] = target

        ex = dai.experiments.create(**es)
        return _DAIModelBackend(ex)

    @staticmethod
    def get(id_: str) -> WaveModelBackend:
        dai = _DAIModelBackend._instance()
        return _DAIModelBackend(dai.experiments.get(id_))

    def predict(self, data: DataSourceObj, **kwargs) -> List[Tuple]:

        dai = _DAIModelBackend._instance()
        ds = _DataSource(data)

        dataset_id = _make_id()
        dataset = dai.datasets.create(ds.filename, name=dataset_id)

        prediction_obj = self.experiment.predict(dataset=dataset)
        prediction_filename = prediction_obj.download(overwrite=True)

        prediction = dt.fread(prediction_filename)
        return prediction.to_tuples()


def build_model(filename: str, target: str, metric: WaveModelMetric = WaveModelMetric.AUTO,
                model_backend_type: Optional[WaveModelBackendType] = None, **kwargs) -> WaveModelBackend:
    """Build a model.

    If `model_backend_type` not specified the function will determine correct backend model based on a current
    environment.

    Args:
        filename: A string containing a filename to dataset.
        target: A name of the target column.
        metric: A metric to be used in building process specified by `h2o_wave.ml.WaveModelMetric`
        model_backend_type: Optionally a backend model type specified by `h2o_wave.ml.WaveModelBackendType`.
        kwargs: Optional parameters passed to a backend model. TODO: Do a compatibility layer for both backends.

    Returns:
        A wave model.
    """

    if model_backend_type is not None:
        if model_backend_type == WaveModelBackendType.H2O3:
            return _H2O3ModelBackend.build(filename, target, metric, **kwargs)
        elif model_backend_type == WaveModelBackendType.DAI:
            return _DAIModelBackend.build(filename, target, metric, **kwargs)

    if _config.steam_address or _config.dai_address:
        return _DAIModelBackend.build(filename, target, metric, **kwargs)

    return _H2O3ModelBackend.build(filename, target, metric, **kwargs)


def get_model(id_: str, model_type: Optional[WaveModelBackendType] = None) -> WaveModelBackend:
    """Get a model that is already built on a backend.

    Args:
        id_: Identification string of a model.
        model_type: Optionally a model type specified by `h2o_wave.ml_WaveModelType`.

    Returns:
        A wave model.
    """

    if model_type is not None:
        if model_type == WaveModelBackendType.H2O3:
            return _H2O3ModelBackend.get(id_)
        elif model_type == WaveModelBackendType.DAI:
            return _DAIModelBackend.get(id_)

    if _config.steam_address or _config.dai_address:
        return _DAIModelBackend.get(id_)

    return _H2O3ModelBackend.get(id_)


def deploy_model(model: WaveModelBackend):
    """Deploy a model."""
    if isinstance(model, _H2O3ModelBackend):
        raise ValueError('H2O-3 models not supported: cannot deploy')
    raise NotImplementedError()


def save_model(backend: WaveModelBackend, folder: str):
    """Save a model to disk."""
    if isinstance(backend, _H2O3ModelBackend):
        h2o.download_model(backend.model, path=folder)
    else:
        raise NotImplementedError()


def load_model(filename: str) -> WaveModelBackend:
    """Load a model from a disk into the instance."""
    _H2O3ModelBackend._ensure()
    model = h2o.upload_model(path=filename)
    return _H2O3ModelBackend(model)

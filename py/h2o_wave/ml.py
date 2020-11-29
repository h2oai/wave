import os.path
import uuid
from enum import Enum
from typing import Optional, Union, List, Tuple

import datatable as dt
import driverlessai
import h2o
from h2o.automl import H2OAutoML
import h2osteam
from h2osteam.clients import MultinodeClient

from .core import _config


WaveModelBackendType = Enum('WaveModelBackendType', 'H2O3 DAI')
WaveModelMetric = Enum('WaveModelMetric', 'AUTO AUC MSE RMSE MAE RMSLE DEVIANCE LOGLOSS AUCPR LIFT_TOP_GROUP'
                                          'MISCLASSIFICATION MEAN_PER_CLASS_ERROR')
DataSourceObj = Union[str, List[List]]


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
            return h2o.H2OFrame(python_obj=self._data)
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
            # TODO: Convert data to csv file using datatable.
            raise NotImplementedError()
        raise ValueError('unknown data type')


class WaveModelBackend:
    """Represents a common interface for a model backend. It references DAI or H2O-3 model in backend."""

    def __init__(self, id_: str, type_: WaveModelBackendType):
        self.id = id_
        """The id of a model that identifies it on a backend service."""
        self.type = type_
        """A wave model backend type represented by `h2o_wave.ml.WaveModelBackendType` enum. It's either DAI or H2O3."""

    def predict(self, inputs: DataSourceObj, **kwargs) -> List[Tuple]:
        """Predict values based on inputs.

        Args:
            inputs: A python obj or filename. [[1, 'a'], [2, 'b'], [3, 'c']] will create 3 rows and 2 columns.
                    The values for a target column need to be specified as well (and can be `None`).

        Returns:
            A list of lists representing rows.

        Examples:

            >>> # Two rows and three columns:
            >>> from h2o_wave.ml import build_model
            >>> model = build_model()
            >>> model.predict([[1, 12.3, 'aa', 32.5], [2, 15.6, 'bb', 89.9]])
            [[16.6], [17.8]]
        """
        raise NotImplementedError()


class _H2O3ModelBackend(WaveModelBackend):

    INIT = False

    def __init__(self, id_: str, aml: H2OAutoML):
        super().__init__(id_, WaveModelBackendType.H2O3)
        self.aml = aml

    @staticmethod
    def _make_id() -> str:
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
    def build(filename: str, target: str, metric: WaveModelMetric, **train_settings) -> WaveModelBackend:

        _H2O3ModelBackend._init()

        id_ = _H2O3ModelBackend._make_id()
        aml = H2OAutoML(max_runtime_secs=30, project_name=id_, stopping_metric=metric.name)

        if os.path.exists(filename):
            frame = h2o.import_file(filename)
        else:
            raise ValueError('file not found')

        cols = list(frame.columns)

        try:
            cols.remove(target)
        except ValueError:
            raise ValueError('no target column')

        ts = train_settings  # A shortcut.
        ts['x'] = cols
        ts['y'] = target
        ts['training_frame'] = frame

        aml.train(**ts)
        return _H2O3ModelBackend(id_, aml)

    @staticmethod
    def get(id_: str):
        # H2O-3 needs to be running standalone for this to work.

        _H2O3ModelBackend._init()

        aml = h2o.automl.get_automl(id_)
        return _H2O3ModelBackend(id_, aml)

    def predict(self, data: DataSourceObj, **kwargs) -> List[Tuple]:

        training_frame_id = self.aml.input_spec['training_frame']
        training_frame = h2o.get_frame(training_frame_id, rows=0)

        ds = _DataSource(data, column_names=training_frame.names, column_types=training_frame.types)
        iframe = ds.h2o3_frame

        oframe = self.aml.predict(iframe)
        filename = f'./{self._make_id()}.csv'
        h2o.download_csv(oframe, filename)

        prediction = dt.fread(filename)
        return prediction.to_tuples()


class _DAIModelBackend(WaveModelBackend):

    _INSTANCE = None
    _CLUSTER_NAME = 'wave-dai-multinode-1'

    def __init__(self, id_: str, experiment):
        super().__init__(id_, WaveModelBackendType.DAI)
        self.experiment = experiment

    @staticmethod
    def _make_id() -> str:
        """Generate random id."""
        return str(uuid.uuid4())

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

        dataset_id = _DAIModelBackend._make_id()
        dataset = dai.datasets.create(filename, name=dataset_id)

        try:
            summary = dataset.column_summaries(columns=[target])[0]
        except KeyError:
            raise ValueError('no target column')

        task_type = experiment_settings.get('task', _DAIModelBackend._determine_task_type(summary))

        # ATTENTION: Not portable solution (use preview or search_expert_settings).
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
        return _DAIModelBackend(ex.key, ex)

    @staticmethod
    def get(id_: str):
        dai = _DAIModelBackend._instance()
        return _DAIModelBackend(id_, dai.experiments.get(id_))

    def predict(self, data: DataSourceObj, **kwargs) -> List[Tuple]:

        dai = _DAIModelBackend._instance()
        ds = _DataSource(data)

        dataset_id = _DAIModelBackend._make_id()
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
        kwargs: Optional parameters passed to a backend model.

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
    """Deploy a model. (To be done)"""
    if isinstance(model, _H2O3ModelBackend):
        raise ValueError('H2O-3 models not supported: cannot deploy')
    raise NotImplementedError()

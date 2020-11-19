import os.path
import uuid
from enum import Enum
from typing import Optional, Union, List

# import driverlessai
import h2o
from h2o.automl import H2OAutoML

from .core import _config


WaveModelType = Enum('WaveModelType', 'H2O3 DAI')
WaveModelMetric = Enum('WaveModelMetric', 'AUTO AUC MSE RMSE MAE RMSLE DEVIANCE LOGLOSS AUCPR LIFT_TOP_GROUP'
                                          'MISCLASSIFICATION MEAN_PER_CLASS_ERROR')
DataSourceObj = Union[str, List[List]]


class _DataSource:
    """Represents a various data sources that can be lazily transformed into another data type.

    TODO: Handle Numpy, Pandas and Datatable.
    """

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


class WaveModel:
    """Represents a common interface for a model. It references DAI or H2O-3 model in backend."""

    def __init__(self, id_: str, type_: WaveModelType):
        self.id = id_
        """The id of a model that identifies it on a backend service."""
        self.type = type_
        """A wave model type represented by `h2o_wave.ml.WaveModelType` enum. It's either DAI or H2O3."""

    @property
    def estimator(self) -> str:
        """The type of an estimator used for a particular model."""
        raise NotImplementedError()

    def predict(self, inputs: DataSourceObj, **kwargs):
        """Predict values based on inputs.

        Inputs follow the `python_obj` spec here: http://docs.h2o.ai/h2o/latest-stable/h2o-py/docs/frame.html#h2oframe
        This is a temporary solution. The contract needs to be stabilized.

        Args:
            inputs: A python obj or filename. [[1, 'a'], [2, 'b'], [3, 'c']] will create 3 rows and 2 columns.

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


class _H2O3Model(WaveModel):

    INIT = False

    def __init__(self, id_: str, aml: H2OAutoML):
        super().__init__(id_, WaveModelType.H2O3)
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
    def build(data: _DataSource, target: str, metric: WaveModelMetric) -> WaveModel:

        _H2O3Model._init()

        id_ = _H2O3Model._make_id()
        aml = H2OAutoML(max_runtime_secs=30, project_name=id_, stopping_metric=metric.name)
        frame = data.h2o3_frame
        cols = list(frame.columns)

        try:
            cols.remove(target)
        except ValueError:
            raise ValueError('no target column')

        aml.train(x=cols, y=target, training_frame=frame)
        return _H2O3Model(id_, aml)

    @staticmethod
    def get(id_: str):
        # H2O-3 needs to be running standalone for this to work.

        _H2O3Model._init()

        aml = h2o.automl.get_automl(id_)
        return _H2O3Model(id_, aml)

    @property
    def estimator(self) -> str:
        return self.aml.leader.algo

    def predict(self, data: DataSourceObj, **kwargs):

        training_frame_id = self.aml.input_spec['training_frame']
        training_frame = h2o.get_frame(training_frame_id, rows=0)

        ds = _DataSource(data, column_names=training_frame.names, column_types=training_frame.types)
        iframe = ds.h2o3_frame

        oframe = self.aml.predict(iframe)
        return oframe.as_data_frame(use_pandas=False, header=False)


# class _DAIModel(WaveModel):
#
#     _INSTANCE = None
#
#     def __init__(self, id_: str, experiment):
#         super().__init__(id_, WaveModelType.DAI)
#         self.experiment = experiment
#
#     @staticmethod
#     def _make_id() -> str:
#         """Generate random id."""
#         return str(uuid.uuid4())
#
#     @classmethod
#     def _instance(cls):
#         if cls._INSTANCE is None:
#             # Set up credentials
#             cls._INSTANCE = driverlessai.Client(address='', username='', password='')
#         return cls._INSTANCE
#
#     @staticmethod
#     def _determine_task_type(summary) -> str:
#         """Guess if a task type for a DAI is of `regression` or `classification`."""
#         if summary.data_type in ('int', 'real'):
#             if summary.unique > 50:
#                 return 'regression'
#         return 'classification'
#
#     @staticmethod
#     def build(filename: str, target: str, metric: WaveModelMetric) -> WaveModel:
#
#         dai = _DAIModel._instance()
#
#         dataset_id = _DAIModel._make_id()
#         dataset = dai.datasets.create(filename, name=dataset_id)
#
#         try:
#             summary = dataset.column_summaries(columns=[target])[0]
#         except KeyError:
#             raise ValueError('no target column')
#
#         settings = {
#             'accuracy': 1,
#             'time': 1,
#             'interpretability': 10,
#             'task': _DAIModel._determine_task_type(summary),
#         }
#
#         ex = dai.experiments.create(train_dataset=dataset, target_column=target, **settings)
#         return _DAIModel(ex.key, ex)
#
#     @staticmethod
#     def get(id_: str):
#         dai = _DAIModel._instance()
#         return _DAIModel(id_, dai.experiments.get(id_))
#
#     def predict(self, inputs, **kwargs):
#         ...


def build_model(data_obj: DataSourceObj, target: str, metric: WaveModelMetric = WaveModelMetric.AUTO,
                model_type: Optional[WaveModelType] = None) -> WaveModel:
    """Build a model.

    If `model_type` not specified the function will determine correct model based on a current environment.

    Args:
        data_obj: A string containing a filename to dataset or python obj.
                  [[1, 'a'], [2, 'b'], [3, 'c']] will create 3 rows and 2 columns.
        target: A name of the response column.
        metric: A metric to be used in building process specified by `h2o_wave.ml.WaveModelMetric`
        model_type: Optionally a model type specified by `h2o_wave.ml.WaveModelType`.

    Returns:
        A wave model.
    """

    ds = _DataSource(data_obj)

    if model_type is not None:
        if model_type == WaveModelType.H2O3:
            return _H2O3Model.build(ds, target, metric)
        elif model_type == WaveModelType.DAI:
            # return _DAIModel.build(filename, target, metric)
            raise NotImplementedError()
    return _H2O3Model.build(ds, target, metric)


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

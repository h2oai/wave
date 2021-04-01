---
title: Wave ML
---

Wave ML provides a simple, high-level API for training, deploying, scoring and explaining machine learning models, letting you build predictive and decision-support applications entirely in Python.

You can find the project in a separate repository [here](https://github.com/h2oai/wave-ml).

:::caution
Wave ML is work in progress and it's not ready for a production use.
:::

## Installation

[H2O Wave ML](https://pypi.org/project/h2o-wave-ml/) is a companion Python package to [H2O Wave](https://pypi.org/project/h2o-wave/) (both available on PyPI). Both Wave and Wave ML can be installed in tandem using `pip`:

```shell
(venv) $ pip install h2o-wave[ml]
```

To use the package, simply import `h2o_wave_ml`:

```py
import h2o_wave_ml
```

## API Overview

Wave ML provides four high-level functions:

- [`build_model()`](wave-ml#build_model): Train a model on a dataset, given the column to be predicted.
- [`Model.predict()`](wave-ml#modelpredict): Make a prediction.
- [`save_model()`](wave-ml#save_model): Save your model.
- [`load_model()`](wave-ml#load_model): Load your previously saved model.

Use [`build_model()`](wave-ml#build_model) to train a model. The function accepts a dataset and a *target column* (the column to be predicted):

```py {3}
from h2o_wave_ml import build_model

model = build_model('./train.csv', target_column='depth')
```

The call to `build_model()` automatically determines if the prediction task is *classification* (predict a category or class) or *regression* (predict a real value, often a quantity).

Once the model is built, we can get the model's predictions using its [`predict()`](wave-ml#modelpredict) method:

```py {4}
from h2o_wave_ml import build_model

model = build_model('./train.csv', target_column='depth')
predictions = model.predict(file_path='./test.csv')
```

You can aso get the model's predictions by directly passing in the test rows:

```py {2-4}
predictions = model.predict([
    ['width', 'height'],
    [width1, height1],
    [width2, height2],
    ...
])
```

To save this model locally, use [`save_model()`](wave-ml#save_model):

```py {4}
from h2o_wave_ml import build_model, save_model

model = build_model('./train.csv', target_column='depth')
model_path = save_model(model, output_dir_path='./')
```

To load a saved model, use [`load_model()`](wave-ml#load_model):

```py {1}
model = load_model(model_path)
predictions = model.predict(file_path='./test.csv')
```

## Functions

<div className='api'>

### build_model

<div className='api__body'>
<div className='api__signature'>
def <span class="ident">build_model</span>(file_path: str, target_column: str, model_metric: ModelMetric = ModelMetric.AUTO, model_type: Optional[ModelType] = None, **kwargs) -> Model:
</div>

<div className='api__description'>


<p>Trains a model.</p>
<p>If <code>model_type</code> is not specified, it is inferred from the current environment. Defaults to an <code>H2O-3</code> model.</p>
<h5 id="args">Args</h5>
<dl>
<dt><code>file_path</code></dt>
<dd>The path to the training dataset.</dd>
<dt><code>target_column</code></dt>
<dd>The name of the target column (the column to be predicted).</dd>
<dt><code>model_metric</code></dt>
<dd>Optional evaluation metric to be used during modeling, specified by <code>h2o_wave_ml.ModelMetric</code>.</dd>
<dt><code>model_type</code></dt>
<dd>Optional model type, specified by <code>h2o_wave_ml.ModelType</code>.</dd>
<dt><code>kwargs</code></dt>
<dd>Optional parameters to be passed to the model builder.</dd>
</dl>
<h5 id="returns">Returns</h5>
<p>A Wave model.</p>

</div>
</div>

</div>

<div className='api'>

### Model.predict

<div className='api__body'>
<div className='api__signature'>
def <span class="ident">predict</span>(self, data: Optional[List[List]] = None, file_path: Optional[str] = None, **kwargs) -> List[Tuple]:
</div>

<div className='api__description'>

<p>Returns the model's predictions for the given input rows. A file path or Python object can be passed.</p>

<h5 id="args">Args</h5>
<dl>
<dt><code>data</code></dt>
<dd>A list of rows of column values. First row has to contain the column headers.</dd>
<dt><code>file_path</code></dt>
<dd>The file path to the dataset.</dd>
</dl>
<h5 id="returns">Returns</h5>
<p>A list of tuples representing predicted values.</p>

</div>
</div>

</div>

<div className='api'>

### save_model

<div className='api__body'>
<div className='api__signature'>
def <span class="ident">save_model</span>(model: Model, output_dir_path: str) -> str:
</div>

<div className='api__description'>

<p>Saves a model to the given location.</p>

<h5 id="args">Args</h5>
<dl>
<dt><code>model</code></dt>
<dd>The model produced by <code>h2o_wave_ml.build_model</code>.</dd>
<dt><code>output_dir_path</code></dt>
<dd>A directory where the model will be saved.</dd>
</dl>
<h5 id="returns">Returns</h5>
<p>The file path to the saved model.</p>

</div>
</div>

</div>

<div className='api'>

### load_model

<div className='api__body'>
<div className='api__signature'>
def <span class="ident">load_model</span>(file_path: str) -> Model:
</div>

<div className='api__description'>

<p>Loads a saved model from the given location.</p>

<h5 id="args">Args</h5>
<dl>
<dt><code>file_path</code></dt>
<dd>Path to the saved model.</dd>

</dl>
<h5 id="returns">Returns</h5>
<p>A list of tuples representing predicted values.</p>

</div>
</div>

</div>

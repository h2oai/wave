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

- [`build_model()`](api/h2o_wave_ml/ml#build_model): Train a model on a dataset, given the column to be predicted.
- [`Model.predict()`](api/h2o_wave_ml/ml#predict): Make a prediction.
- [`save_model()`](api/h2o_wave_ml/ml#save_model): Save your model.
- [`load_model()`](api/h2o_wave_ml/ml#load_model): Load your previously saved model.

Use [`build_model()`](api/h2o_wave_ml/ml#build_model) to train a model. The function accepts a dataset and a *target column* (the column to be predicted):

```py {3}
from h2o_wave_ml import build_model

model = build_model('./train.csv', target_column='depth')
```

The call to `build_model()` automatically determines if the prediction task is *classification* (predict a category or class) or *regression* (predict a real value, often a quantity).

Once the model is built, we can get the model's predictions using its [`predict()`](api/h2o_wave_ml/ml#predict) method:

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

To save this model locally, use [`save_model()`](api/h2o_wave_ml/ml#save_model):

```py {4}
from h2o_wave_ml import build_model, save_model

model = build_model('./train.csv', target_column='depth')
model_path = save_model(model, output_dir_path='./')
```

To load a saved model, use [`load_model()`](api/h2o_wave_ml/ml#load_model):

```py {1}
model = load_model(model_path)
predictions = model.predict(file_path='./test.csv')
```

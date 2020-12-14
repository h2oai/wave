---
title: Machine Learning
slug: /ml
---

:::caution
This feature is experimental. Do not rely on this in production!
:::

H2O Wave comes with the possibility of creating, storing and scoring on prediction models. The goal of this feature is to have a simple function calls that hide complexity of the ML tasks and let you explore the world of ML quickly and seamlessly. You can have your own prediction model built without much questions and you needn't to think about the technologies used under the hood.

The simple approach comes with a price, however. The options are not feature rich. If you find yourself limiting by the API we encourage you to use the other technologies available.

The API can be found in [h2o_wave.ml](api/ml) module.

## Examples

To build a model a dataset in `.csv` format is needed and target column needs to be specified:

```python
from h2o_wave.ml import build_model

train_set = './creditcard_train.csv'
model = build_model(train_set, target='DEFAULT_PAYMENT_NEXT_MONTH')
```

Once the model is built we can make a predictions on training dataset:

```python
from h2o_wave.ml import build_model

test_set = './creditcard_test.csv'
train_set = './creditcard_train.csv'

model = build_model(train_set, target='DEFAULT_PAYMENT_NEXT_MONTH')
predictions = model.predict(test_set)
```

or store model onto disk. The resulting model file path is returned by the `save_model()` function call:

```python
from h2o_wave.ml import build_model, save_model

train_set = './creditcard_train.csv'
model = build_model(train_set, target='DEFAULT_PAYMENT_NEXT_MONTH')
path = save_model(model)
```

If model stored, we can load it up and make predictions:

```python
from h2o_wave.ml import load_model

model = load_model('./MyModel')
predictions = model.predict('./Datasets/creditcard_test_cat.csv')
```

The `.predict()` method call can take either the file path or python object with a raw data. Column names need to be specified omitting the target column. The example shows prediction on one row:

```python
from h2o_wave.ml import load_model

data = [["ID", "LIMIT_BAL", "SEX"], [24001, 50000, "male"]]

model = load_model('./MyModel')
predictions = model.predict(data)
```

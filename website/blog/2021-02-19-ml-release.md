---
slug: ml-release-0.3.0
title: Introducing, AutoML for Wave Apps
author: Peter Szabó
author_title: Software Engineer @ H2O.ai
author_url: https://github.com/geomodular
author_image_url: https://www.gravatar.com/avatar/17c05e511a981a1f0b35eb8d4648947c
tags: [release]
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Today, we're delighted to announce H2O Wave ML - the automatic machine learning (AutoML) for Wave apps. Let's introduce the library and have a look into API and few examples. 

<!--truncate-->

## Introduction

The main goal of H2O Wave ML is to integrate AI/ML models into your applications in a **quick** and **easy** way. It provides a simple, high-level API for training, deploying, scoring and explaining machine learning models, letting you build predictive and decision-support applications entirely in Python.

Wave ML is doing a lot behind the scenes. It picks the adequate engine to support the building and training process and transform the user inputs to fit them with engines. You might be using [*H2O-3*](https://www.h2o.ai/products/h2o/) locally and [*Driverless AI*](https://www.h2o.ai/products/h2o-driverless-ai/) on a [Cloud](https://www.h2o.ai/hybrid-cloud/) and you might not know about it. Wave ML hides complexity but for a cost of features. Right now only *H2O-3* support is available.

Wave ML is in experimental stage and might be subject of change.

## Installation

H2O Wave ML is a Python library designed to be a companion package for H2O Wave. You can install it along with Wave by running:

```shell
(venv) $ pip install h2o-wave[ml]
```

You should be able to import library by:

```py
import h2o_wave_ml
```

## API Calls in Examples

Just four functions and one method are available to the user currently. You can check full API on Github page [here](https://github.com/h2oai/wave-ml#api). Let's have a look in examples.

To train a model use [`build_model()`](https://github.com/h2oai/wave-ml#build_model). The function needs a dataset in `.csv` format and a target column (column to be predicted):

```py {4}
from h2o_wave_ml import build_model

train_set = './creditcard_train.csv'
model = build_model(train_set, target_column='DEFAULT_PAYMENT_NEXT_MONTH')
```

There are few things happening under the hood now. The underlying backend are being chose, dataset is examined, a prediction task is determined (classification or regression) and building process started.

Once the model is built we can do predictions using the [`.predict()`](https://github.com/h2oai/wave-ml#modelpredict) method:

```py {7}
from h2o_wave_ml import build_model

test_set = './creditcard_test.csv'
train_set = './creditcard_train.csv'

model = build_model(train_set, target_column='DEFAULT_PAYMENT_NEXT_MONTH')
predictions = model.predict(file_path=test_set)
```

The training dataset may be specified by file path or directly by passing values.

You can store model onto the disk by using [`save_model()`](https://github.com/h2oai/wave-ml#save_model) which returns the file path:

```py {5}
from h2o_wave_ml import build_model, save_model

train_set = './creditcard_train.csv'
model = build_model(train_set, target_column='DEFAULT_PAYMENT_NEXT_MONTH')
file_path = save_model(model, output_dir_path='./')
```

When model is stored, we can load it up with [`load_model()`](https://github.com/h2oai/wave-ml#load_model) and make a predictions:

```py {3}
from h2o_wave_ml import load_model

model = load_model('./MyModel')
predictions = model.predict(file_path='./creditcard_test.csv')
```

## Example Wave Application

Now, equipped with the right tools let's build a simple, predictive Wave application. We will build a [confusion matrix](https://en.wikipedia.org/wiki/Confusion_matrix) based on a [Titanic](https://www.kaggle.com/c/titanic/data) dataset using *Survived* as a target column and a threshold slider. The full source of this example can be found [here](https://github.com/h2oai/wave-ml/blob/main/examples/quickstart.py).

![confusion matrix](assets/2021-02-19/cm.gif)

Let's train and predict on a model using the same dataset:

```py {6,7}
from h2o_wave_ml import build_model

dataset = './titanic.csv'
target_column = 'Survived'

model = build_model(dataset, target_column=target_column)
prediction = model.predict(file_path=dataset)
```

The output of a `model.predict()` call should have the following structure:
 ```py
[
    ...
    (False, 0.7299433836535241, 0.2700566163464759),
    (False, 0.8614792168232073, 0.1385207831767927),
    ...
]
 ``` 

To construct a confusion matrix we also need the actual, **true** values for *Survived* column. We will extract it with a help of [datatable](https://datatable.readthedocs.io/en/latest/) library:

```py {6,7}
import datatable as dt

dataset = './titanic.csv'
target_column = 'Survived'

df = dt.fread(dataset)
y_true = df[target_column].to_list()[0]
```

The `y_true` now holds the following structure:
```py
[..., False, True, True, True, False, False, ...]
```

We can use scikit-learn [confusion_matrix()](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html) function to compute the matrix values. The function accepts the `y_true` as the correct values and `y_pred` as predicted, estimated values. Let's compute these based on an arbitrary `threshold` and pass the values to the function:

```py {3,4}
from sklearn.metrics import confusion_matrix

y_pred = [p[1] < threshold for p in prediction]
tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
```

Since we don't have confusion matrix component inside Wave (yet) we need to construct the table using markdown. We align the `tn`, `fp`, `fn` and `tp` based on description [here](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html) into the template:

```py
template = '''
## Confusion Matrix for Titanic
| | | |
|:-:|:-:|:-:|
| | Survived | Not survived |
| Survived | **{tp}** | {fp} (FP) |
| Not survived | {fn} (FN) | **{tn}** |
<br><br>
'''
```

and use it inside the form:

```py {3}
        ...
        q.page['matrix'] = ui.form_card(box='1 1 3 4', items=[
            ui.text(template.format(tn=tn, fp=fp, fn=fn, tp=tp)),
            ui.slider(name='slider', label='Threshold', min=0, max=1, step=0.01, value=0.5,
                      trigger=True),
        ])
        ...
```

That's it! See the full example [here](https://github.com/h2oai/wave-ml/blob/main/examples/quickstart.py). 

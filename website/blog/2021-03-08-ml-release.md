---
slug: ml-release-0.3.0
title: Introducing, AutoML for Wave Apps
author: Peter Szabó
author_title: Lead Software Engineer @ H2O.ai
author_url: https://github.com/geomodular
author_image_url: https://www.gravatar.com/avatar/17c05e511a981a1f0b35eb8d4648947c
tags: [release]
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Today, we're delighted to announce H2O Wave ML - Automatic Machine Learning (AutoML) for Wave apps. Let's introduce the library and have a look at API and a few examples.

<!--truncate-->

## Introduction

After the announcement of H2O Wave in late 2020 and H2O AI Hybrid Cloud in early 2021, H2O Wave ML was designed as another kid to the family.

With Wave, you can create your applications entirely in Python and run them in a browser without touching the client-side technologies. You can push your work to the Cloud later and show it to the world.

While you can (and should) use any machine learning libraries and technologies in your Wave application, we think there is space for improvement for people who don't want to tackle the complexities of such tools and the simple approach to the solution is enough.

We are introducing **H2O Wave ML**.

The library, able to blend Wave, Cloud, and other technologies from the H2O stack to make the applications **predictive**.

The main goal of Wave ML is to integrate AI/ML models into your applications quickly and easily. It will provide a simple, high-level API for training, deploying, scoring, and explaining machine learning models, letting you build predictive and decision-support applications entirely in Python.

Wave ML is trying hard behind the scenes. It picks the adequate engine to support the building and training process and unifies the user inputs to work with those engines. You might be using [*H2O-3*](https://www.h2o.ai/products/h2o/) locally and [*Driverless AI*](https://www.h2o.ai/products/h2o-driverless-ai/) on Cloud, and you might not know about it.

Wave ML is in the early stages, and the API might be subject to change.

## Installation

H2O Wave ML is a Python library designed to be a companion package for H2O Wave. You can install it along with Wave by running:

```shell
(venv) $ pip install h2o-wave[ml]
```

You should be able to import the library by:

```py
import h2o_wave_ml
```

## API Calls in Examples

Four functions and one method are available to the user currently. You can check the full API on the Github page [here](https://github.com/h2oai/wave-ml#api). Let's have a look at some examples.

To train a model use, [`build_model()`](https://github.com/h2oai/wave-ml#build_model). The function needs a dataset in `.csv` format and a target column (column to be predicted):

```py {4}
from h2o_wave_ml import build_model

train_set = './creditcard_train.csv'
model = build_model(train_set, target_column='DEFAULT_PAYMENT_NEXT_MONTH')
```

Few things are happening under the hood now. The underlying backend is automatically chosen, the dataset is examined, a prediction task is determined (classification or regression) and the model training process is started.

Once the model is built, we can do predictions using the [`.predict()`](https://github.com/h2oai/wave-ml#modelpredict) method:

```py {7}
from h2o_wave_ml import build_model

test_set = './creditcard_test.csv'
train_set = './creditcard_train.csv'

model = build_model(train_set, target_column='DEFAULT_PAYMENT_NEXT_MONTH')
predictions = model.predict(file_path=test_set)
```

The training dataset may be specified by file path or directly by passing the values.

You can store the model onto the disk by using [`save_model()`](https://github.com/h2oai/wave-ml#save_model) which returns the file path:

```py {5}
from h2o_wave_ml import build_model, save_model

train_set = './creditcard_train.csv'
model = build_model(train_set, target_column='DEFAULT_PAYMENT_NEXT_MONTH')
file_path = save_model(model, output_dir_path='./')
```

Once the model is stored, we can load it up with [`load_model()`](https://github.com/h2oai/wave-ml#load_model) and make predictions:

```py {3}
from h2o_wave_ml import load_model

model = load_model('./MyModel')
predictions = model.predict(file_path='./creditcard_test.csv')
```

## The First Example

Now, equipped with the right tools let's build a simple Wave application. We will build a [confusion matrix](https://en.wikipedia.org/wiki/Confusion_matrix) based on the Titanic dataset using *Survived* as a target column and a threshold slider. The full source for this example can be found [here](https://github.com/h2oai/wave-ml/blob/main/examples/quickstart.py).

![confusion matrix](assets/2021-03-08/cm.gif)

Let's train and predict on a model using the same dataset:

```py {6,7}
from h2o_wave_ml import build_model

dataset = './titanic.csv'
target_column = 'Survived'

model = build_model(dataset, target_column=target_column)
prediction = model.predict(file_path=dataset)
```

The output of a `model.predict()` call has the following structure:

```py
[
    ...
    (False, 0.7299433836535241, 0.2700566163464759),
    (False, 0.8614792168232073, 0.1385207831767927),
    ...
]
```

To construct a confusion matrix, we also need the actual, **true** values for the *Survived* column. We will extract it with a help of the [datatable](https://datatable.readthedocs.io/en/latest/) library:

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

We can use scikit-learn [confusion_matrix()](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html) function to compute the matrix values. The function accepts the `y_true` as the correct values and `y_pred` as the predicted values. Let's compute these based on an arbitrary `threshold` and pass the values to the function:

```py {3,4}
from sklearn.metrics import confusion_matrix

y_pred = [p[1] < threshold for p in prediction]
tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
```

Since we don't have a confusion matrix component inside Wave (yet), we need to construct the table using markdown. We align the `tn`, `fp`, `fn` and `tp` based on the description [here](https://scikit-learn.org/stable/modules/generated/sklearn.metrics.confusion_matrix.html) into the template:

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

## The Second Example

Let's do something more fun. What about predicting the rating of a wine based on its features? We will use [the wine dataset](https://www.kaggle.com/christopheiv/winemagdata130k) and preprocess it slightly to contain just the following columns: `country`, `points`, `price`, `province`, `region_1`, `variety` and `winery`. The full example can be found [here](https://github.com/h2oai/wave-ml/blob/main/examples/wine.py).

![confusion matrix](assets/2021-03-08/wine.gif)

The first step is simple, we train the model using the dataset on `points` column:

```py
from h2o_wave_ml import build_model

model = build_model('./winemag_edit.csv', target_column='points')
```

We will do predictions later based on user interaction.

Our example contains a form and dropdown components and we need to feed it with values. To prepare the values for the dropdown components, we use a datatable to identify unique items within the column:

```py {6,7,8}
import datatable as dt

df = dt.fread('./winemag_edit.csv')

features = ['country', 'price', 'province', 'region_1', 'variety', 'winery']
columns = {f: dt.unique(df[f]).to_list()[0] for f in features}
choices = {key: [ui.choice(str(item)) for item in columns[key] if item]
           for key in columns}
```

We do this in two steps. First, we extract the unique values for a given column. The resulting `columns` variable should be structured like this:

```py
{
    'country': ['', 'Argentina', 'Armenia', 'Australia', 'Austria', ...],
    'province': ['', 'Achaia', 'Aconcagua Costa', 'Aconcagua Valley', 'Aegean', 'Agioritikos', 'Ahr', ...],
    ...
}
```

In the next step, we create a similar dict but with a list of [`Choice`](https://h2oai.github.io/wave/docs/api/types#choice) objects using the `columns` and save it to `choices`:

```py
{
    'country': [<Choice object>, <Choice object>, ...],
    'province': [<Choice object>, <Choice object>, ...],
    ...
}
```

To do the predictions, we need to prepare the input data for `model.predict()` method. We do this every call since we want to see the rating being updated immediately:

```py {5,6,7,8}
from h2o_wave import app, Q

@app('/demo')
async def serve(q: Q):
    country = q.args.country or default_value['country']
    price = float(q.args.price) if q.args.price else default_value['price']
    ...  # The rest
    winery = q.args.winery or default_value['winery']
```

We choose to either use a value supplied by the query handler `serve()` or use a default value.

Now we can do the predictions:

```py {1,2}
    input_data = [features, [country, price, province, region, variety,
                             winery]]
    rating = model.predict(input_data)
    rating = rating[0][0]
```

Rating now contains the points that we want to show up on a page. The page needs to be set up with suitable components before use. We use `tall_gauge_stat_card` for that:

```py {3}
    if not q.client.initialized:
        ...
        q.page['result'] = ui.tall_gauge_stat_card(
            box=ui.box('body', height='180px'),
            title='',
            value=str(rating),
            aux_value='points',
            plot_color='$red' if rating < 90 else '$green',
            progress=rating/100,
        )
        ...
        q.client.initialized = True
```

For every other call, we need to update the stat card and we are done:

```py
        ...
        q.page['result'].value = str(rating)
        q.page['result'].progress = rating/100
        q.page['result'].plot_color = '$red' if rating < 90 else '$green'
        ...
```

See the full example [here](https://github.com/h2oai/wave-ml/blob/main/examples/wine.py).

Stay tuned, for the more updates will come!

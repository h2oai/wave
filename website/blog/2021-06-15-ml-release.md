---
slug: ml-release-0.8.1
title: "New in Wave ML: Overview"
author: Peter Szabó
author_title: Lead Software Engineer @ H2O.ai
author_url: https://github.com/geomodular
author_image_url: https://www.gravatar.com/avatar/17c05e511a981a1f0b35eb8d4648947c
tags: [release]
---

import useBaseUrl from '@docusaurus/useBaseUrl';

Several versions of H2O Wave ML have been released since the last announcement. Wave ML can now run on [H2O AI Hybrid Cloud](https://www.h2o.ai/hybrid-cloud/), utilize [H2O Driverless AI](https://www.h2o.ai/products/h2o-driverless-ai/) (DAI) to train the models and push them into [H2O MLOps](https://www.h2o.ai/resources/product-brief/h2o-mlops/). In addition, new utility functions were introduced to support [H2O Enterprise Steam](https://enterprise-steam.s3.amazonaws.com/release/1.8.6/index.html) together with *MLOps* and minor changes to API were made.

<!--truncate-->

## Wave ML on Cloud

You can run both the `H2O-3` and `DAI` engines on *Cloud*.

For `H2O-3` it works the same as running *Wave ML* locally - the `H2O-3` server is initialized and used. No additional steps are necessary (the future work will extend this further to use *Cloud* resources).

For `DAI` it's essential to enable OpenID Connect (OIDC) and set up the correct ENV variables. This is done in your [app.toml](https://h2oai.github.io/h2o-ai-cloud/docs/userguide/developer-guide#apptoml) file.

At first, check if the *Cloud* you are using (we have several instances) has appropriate, shared secrets available:

```shell
> h2o secret list
```

We are looking for *MLOps* gateway and *Steam* address:
```shell
h2oai-mlops            ALL_USERS  gateway
h2oai-steam            ALL_USERS  api
```

Set up your `app.toml` accordingly:

```toml
[Runtime]
EnableOIDC = true

[[Env]]
Name = "H2O_WAVE_ML_STEAM_ADDRESS"
Secret = "h2oai-steam"
SecretKey = "api"

[[Env]]
Name = "H2O_WAVE_ML_MLOPS_GATEWAY"
Secret = "h2oai-mlops"
SecretKey = "gateway"
```

You can use your *Steam* DAI instance with *Wave ML* in either of two ways:
1. Specify the instance name in the ENV variable. This option is suitable for a multinode setup:
   
```toml
[[Env]]
Name = "H2O_WAVE_ML_STEAM_CLUSTER_NAME"
Value = "my-cool-multinode-project-name"
```

2. Specify the instance name directly in [API](https://wave.h2o.ai/docs/api/h2o_wave_ml/ml#build_model):

```py
model = build_model(_steam_dai_instance_name='my-dai')
```

The rest of the *Wave ML* workflow continues to be the same.


## Utility Functions

A new module was introduced to `Wave ML` available as `h2o_wave_ml.utils`. It contains some useful functions:

- `list_dai_instances()`: Gets a list of all available Driverless instances.
- `list_dai_multinodes()`: Gets a list of all available Driverless multinode instances.
- `save_autodoc()`: Saves the AutoDoc of DAI model.

Use [`list_dai_instances()`](https://wave.h2o.ai/docs/api/h2o_wave_ml/utils#list_dai_instances) to obtain a list of your DAI instances. You can use it later to feed `build_model()` with particular instance name:

```py {5}
from h2o_wave_ml.utils import list_dai_instances

@app('/')
async def serve(q: Q):
    dai_instances = list_dai_instances(access_token=q.auth.access_token)
```

An AutoDoc is available to download if the model was built using DAI backend. Use `save_autodoc()` to save a `.docx` file to drive:

```py {7}
from h2o_wave_ml import build_model
from h2o_wave_ml.utils import save_autodoc

@app('/')
async def serve(q: Q):
    model = build_model(...)
    file_name = save_autodoc(project_id=model.project_id, access_token=q.auth.access_token)
```

The `.project_id` property of the model is always available if the model was obtained by `build_model()` function. However, if the model is returned using `get_model()`, it's available only if the model belongs to an authenticated user.

See the [API](https://wave.h2o.ai/docs/api/h2o_wave_ml/utils) for utils.


## OpenID Connect

OIDC tokens are used to authenticate across the services on *Cloud*. Tokens are available within a `q` argument of the Wave query handler, i.e., `q.auth.access_token` and `q.auth.refresh_token`. For more information, see the [single sign-on](https://wave.h2o.ai/docs/security#single-sign-on) section of the Wave page.

Some of the *Wave ML* functions were equipped with `access_token` and `refresh_token` arguments to handle the authentication routines behind the scenes. Use the appropriate token to authenticate.

In general, `access_token` has a small lifespan, and it's not suitable for a long-running job. Use it when you are sure your routine is handled swiftly, e.g., the listing example:

```py {5}
from h2o_wave_ml.utils import list_dai_instances

@app('/')
async def serve(q: Q):
    dai_instances = list_dai_instances(access_token=q.auth.access_token)
```

If your task needs more time (e.g. `build_model()`), use `refresh_token` so *Wave ML* can generate access tokens as needed:

```py {5}
from h2o_wave_ml import build_model

@app('/')
async def serve(q: Q):
    model = build_model(refresh_token=q.auth.refresh_token, ...)
```

## Notable Features

- [`build_model()`](https://wave.h2o.ai/docs/api/h2o_wave_ml/ml#build_model) was updated with several `H2O-3` and `DAI` parameters. See an [example](https://wave.h2o.ai/docs/examples/ml-h2o-parameters) for `H2O-3` parameters.

- *Pandas* dataframe can be used for training, testing and validating:
```py {9}
from h2o_wave_ml import build_model

from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split

data = load_wine(as_frame=True)['frame']
train_df, test_df = train_test_split(data, train_size=0.8)

model = build_model(train_df=train_df, target_column='target')
```

- A validation dataset can be passed to [`build_model()`](https://wave.h2o.ai/docs/api/h2o_wave_ml/ml#build_model) function. Choose from `validation_file_path` in case of a file or `validation_df` in case of a *Pandas* dataframe.

- A list of categorical columns can be specified using the `categorical_columns` argument of a [`build_model()`](https://wave.h2o.ai/docs/api/h2o_wave_ml/ml#build_model) function.

- Columns can be dropped or included using `drop_columns` or `feature_columns` of a [`build_model()`](https://wave.h2o.ai/docs/api/h2o_wave_ml/ml#build_model) function.

See the [API](https://wave.h2o.ai/docs/api/h2o_wave_ml/index) for *Wave ML* and [examples](https://wave.h2o.ai/docs/examples/ml-h2o) on official Wave page.

Follow updates to Wave ML on GitHub: https://github.com/h2oai/wave-ml. Let us know what you think and how we can improve it.

We look forward to continuing our collaboration with the community and hearing your feedback as we further improve and expand the H2O Wave platform.
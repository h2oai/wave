---
title: Installation
---

## Install

:::important
These instructions apply to v0.20 or later. For previous versions, [click here](installation-8-20.md).
:::

Install the `h2o-wave` package from PyPI:

```shell
pip install h2o-wave
```

To install in a virtual environment (recommended):

```shell
python3 -m venv venv
source venv/bin/activate
pip install h2o-wave
```

To install in a virtual environment (Windows):

```shell
python3 -m venv venv
venv\Scripts\activate.bat
pip install h2o-wave
```

To install using Conda:

```shell
conda install -c h2oai h2o_wave
```

To install in a Conda virtual environment:

```shell
conda create -n venv
conda activate venv
conda install -c h2oai h2o_wave
```

## Download examples

Run `wave fetch` to download examples, demos, and the interactive tour.

```shell
(venv) $ wave fetch
```

You should now have access to 200+ examples locally. 

```
Fetching examples and related files. Please wait...
Downloading https://github.com/h2oai/wave/releases/download/v0.20.0/wave-0.20.0-linux-amd64.tar.gz
Extracting...

All additional files downloaded and extracted successfully!
Examples and tour............. /home/wave/examples
Demos and layout samples...... /home/wave/demo
Automated test harness........ /home/wave/test
Wave daemon for deployments... /home/wave
```

:::info
On recent versions of OSX, it's possible to run into certificate verification errors while running `wave fetch`, specifically `urllib.error.URLError: urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate`. To fix this problem, navigate to `Application/Python 3.7` on your system and execute `Install Certificates.command`.
:::

## Run the tour

The Wave tour is a Wave app that lets you play with all the examples interactively. 

![tour](assets/tour__tour.png)

To run the tour, simply launch `examples/tour.py` like this:

```shell
cd wave
pip install -r examples/requirements.txt
wave run --no-reload examples.tour
```

Then navigate to [http://localhost:10101/tour](http://localhost:10101/tour) to access the tour.

`tour.py` is an ordinary Wave app that runs other apps. The tour itself runs at the route `/tour`, and each of the examples runs at `/demo`.

:::tip
To play with the tour's active example in isolation, simply open a new browser tab and head to [http://localhost:10101/demo](http://localhost:10101/demo).
:::

## Wrapping up

In this section, we installed Wave and then launched `tour.py` to experience the tour. In general, this is how you'd typically launch any app, including your own. There is nothing special about `tour.py`. In fact, to run any example, all you need to do is repeat the steps above in a new terminal window. For example, to run `todo.py`, simply run:

```shell
wave run examples.todo
```

You can now access the example at [http://localhost:10101/demo](http://localhost:10101/demo). Simple!

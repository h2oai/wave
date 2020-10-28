---
title: A Tour of Wave
---
import StartQ from './_start_q.md'

Your Wave release download ships with [over 150 examples](examples).

You can play around with these examples in your browser using `tour.py`, a Python script (itself a Wave app) located in `examples/`:

```none title="Contents of $HOME/wave"
wave/
├── examples/       <-- Examples live here.
|   └── tour.py     <-- The Wave Tour.
├── test/           
├── www/            
└── waved
```

To run the tour, as with any Wave app, we need to start both the Wave server (`waved`) and the tour (`tour.py`). Let's go ahead and do that.

## Step 1: Start the Wave server

<StartQ/>

## Step 2: Run the tour

First, create a [virtual environment](https://docs.python.org/3/tutorial/venv.html), install the tour's dependencies.

:::important
Do this from a new terminal window!
:::

```shell 
cd $HOME/wave
python3 -m venv venv
source venv/bin/activate
pip install -r examples/requirements.txt
```

On Windows:

```shell
cd $HOME\wave
python3 -m venv venv
venv\Scripts\activate.bat
pip install -r examples\requirements.txt
```

Finally, run the tour:

```shell
wave run --no-reload examples.tour
```

## Step 3: Enjoy the tour


Go to [http://localhost:55555/tour](http://localhost:55555/tour) to access the tour. 

![tour](assets/tour__tour.png)

`tour.py` is an ordinary Wave app that runs other apps. The tour itself runs at the route `/tour`, and each of the examples runs at `/demo`. 

:::tip
To play with the tour's active example in isolation, simply open a new browser tab and head to [http://localhost:55555/demo](http://localhost:55555/demo).
:::

## Wrapping up

In this section, we started the Wave server and then launched `tour.py` to experience the tour. In general, this is how you'd typically launch any app, including your own. There is nothing special about `tour.py`. In fact, to run any example, all you need to do is repeat the steps above in a new terminal window. For example, to run `todo.py`, simply run:

```shell 
wave run examples.todo
```

You can now access the example at [http://localhost:55555/demo](http://localhost:55555/demo). Simple!


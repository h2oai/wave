---
title: "Tutorial: System Monitor"
---

In this tutorial, we'll put our learnings from the [first](tutorial-hello.mdx) and [second](tutorial-beer.md) tutorials to some real-world use: a simple system monitoring tool that displays CPU, memory and network stats on a web page.

![CPU](assets/tutorial-monitor__cpu_mem.png)

For example, if you have a spare 256-node Raspberry Pi cluster lying somewhere, you can run this program to each node and monitor your entire cluster's system utilization from one place. How cool is that?

We'll also introduce a new concept, called [data buffers](buffers.md), which allows you to use the Wave server to store *rows* (also called *tuples* or *records*) of information - much like how you would use tables in a database, or dataframes in Python or R - to deal with structured data.

## Prerequisites

This tutorial assumes your Wave server is up and running, and you have a working directory for authoring programs. If not, head over to the [Hello World tutorial](tutorial-hello.mdx) and complete steps 1 and 2.

## Step 1: Install dependencies

We'll be using the excellent `psutil` package to read system stats. Let's go ahead and install that in our virtual environment:

```shell
cd $HOME/wave-apps
./venv/bin/pip install psutil
```

## Step 2: Monitor CPU usage

Here's what our program looks like:

```py {7,12,25} title="$HOME/wave-apps/system_monitor.py"
import time
import psutil
from h2o_wave import site, ui, data

page = site['/monitor']

cpu_card = page.add('cpu_stats', ui.small_series_stat_card(
    box='1 1 1 1',
    title='CPU',
    value='={{usage}}%',
    data=dict(usage=0.0),
    plot_data=data('tick usage', -15),
    plot_category='tick',
    plot_value='usage',
    plot_zero_value=0,
    plot_color='$red',
))

tick = 0
while True:
    tick += 1

    cpu_usage = psutil.cpu_percent(interval=1)
    cpu_card.data.usage = cpu_usage
    cpu_card.plot_data[-1] = [tick, cpu_usage]

    page.save()
    time.sleep(1)
```

## Step 3: Run your program

```shell
cd $HOME/wave-apps
./venv/bin/python system_monitor.py
```

Point your browser to [http://localhost:10101/monitor](http://localhost:10101/monitor).

![CPU](assets/tutorial-monitor__cpu.png)

## Step 4: Understand your program

You'll notice that the above program is quite similar to the program we wrote during the [Beer Wall](tutorial-beer.md) tutorial, with three important differences (see highlighted lines above):

1. We use a `ui.small_series_stat_card()` instead of a `ui.markdown_card()`.
2. The card is capable of dealing with multiple rows of data.
3. To display information on the card, you only need to send it new values (and not all the data rows all over again).

Let's explore these topics one by one.

### Using a stats card

The Wave SDK ships with a variety of *stats cards*, which are cards that display values or graphics, or a combination of both (see [Gallery](examples) for more).

In this case, we use `small_series_stats_card()`, which displays a value and a time series visualization.

```py
cpu_card = page.add('cpu_stats', ui.small_series_stat_card(...)
```

### Declaring a data buffer

The stats card is capable of rendering its visualization using a [data buffer](buffers.md). A data buffer is similar to a database table in that it has a predefined structure (columns and rows), but is write-only (you cannot query information; only insert, update or delete them).

:::info
The [data buffer](buffers.md) topic covers different types of buffers in more detail.
:::

In this case, we declare a *cyclic buffer*, a [FIFO](https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)) data structure that holds a fixed number of rows, and can only be appended to. Our buffer holds at most 15 rows, and has exactly two columns: `tick` (a one-up integer) and `usage` (the CPU usage).

```py
    plot_data=data('tick usage', -15),
```

Internally, the card's data buffer might look like this in memory when first created:

| # | tick | usage |
|---|------|-------|
| 0 | | |
| 1 | | |
| ...  | ... | ... |
| 13 | | |
| 14 | | |

### Inserting into the data buffer

Lastly, we measure CPU usage every second and append a new row to the end of card's data buffer, like this:

```py
    cpu_card.plot_data[-1] = [tick, cpu_usage]
```

Internally, the card's data buffer might look like this in memory while in use:

| # | tick | usage |
|---|------|-------|
| 0 | 1015 | 4.2 |
| 1 | 1016 | 4.9 |
| ... | ...  | ... |
| 13 | 1028 | 5.8 |
| 14 | 1039 | 7.5 |

## Step 5: Monitor memory usage

As a final step, we can duplicate parts of our program to create another card that displays memory stats. The two cards behave identically, except that one displays CPU usage and the other, memory.

```py {18-28,38-40} title="$HOME/wave-apps/system_monitor.py"
import time
import psutil
from h2o_wave import site, ui, data

page = site['/monitor']

cpu_card = page.add('cpu_stats', ui.small_series_stat_card(
    box='1 1 1 1',
    title='CPU',
    value='={{usage}}%',
    data=dict(usage=0.0),
    plot_data=data('tick usage', -15),
    plot_category='tick',
    plot_value='usage',
    plot_zero_value=0,
    plot_color='$red',
))
mem_card = page.add('mem_stats', ui.small_series_stat_card(
    box='1 2 1 1',
    title='Memory',
    value='={{usage}}%',
    data=dict(usage=0.0),
    plot_data=data('tick usage', -15),
    plot_category='tick',
    plot_value='usage',
    plot_zero_value=0,
    plot_color='$blue',
))

tick = 0
while True:
    tick += 1

    cpu_usage = psutil.cpu_percent(interval=1)
    cpu_card.data.usage = cpu_usage
    cpu_card.plot_data[-1] = [tick, cpu_usage]

    mem_usage = psutil.virtual_memory().percent
    mem_card.data.usage = mem_usage
    mem_card.plot_data[-1] = [tick, mem_usage]

    page.save()
    time.sleep(1)
```

## Step 6: Run your program again

Terminate your program (`^C`) and restart it:

```shell
cd $HOME/wave-apps
./venv/bin/python system_monitor.py
```

Point your browser to [http://localhost:10101/monitor](http://localhost:10101/monitor). You should now see both CPU and memory stats live:

![CPU](assets/tutorial-monitor__cpu_mem.png)

## Exercise

Explore other kinds of cards in the [Widgets](/docs/widgets/overview) and display additional stats gleaned from `psutil` (network, disk, processes, etc.).

## Summary

In this tutorial, we learned how to use stats cards to display live information. The knowledge you've gained from these first few tutorials should be enough to design and deploy live dashboards using Wave. You will also have noticed that you don't need to keep your Python program running all the time to continue displaying your pages. You can terminate your Python program any time, and the Wave server will happily display the last known state of all your pages.

The programs you've been authoring till now are one kind of programs, called [Wave scripts](scripts.md). Wave scripts are not interactive. They can modify pages on the Wave server, but cannot respond to user actions, like handling button clicks, menu commands, dropdown changes, and so on. To handle user interactions, you need to author [Wave Apps](apps.md), which are long-running programs (*servers* or *services*) that are capable of modifying pages in response to user actions. Let's see how to do that in the next tutorial.

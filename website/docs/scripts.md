---
title: Wave Scripts
---

A Wave script is the simplest way to publish content with Wave, especially live web content:

- Dashboards and visualizations for live monitoring.
- Live information displays: news, tickers, health, or performance data.

A Wave script is one kind of program you can author to interact with Wave. The other kind is a [Wave App](apps.md). The primary difference between an app and a script is that apps are interactive (able to handle user interactions) and scripts are not. If you are not interested in handling user interactions, and only want to publish content, use a Wave script.

Here is the skeleton of a Wave script ([example](tutorial-hello.mdx)):

```py
from h2o_wave import site, ui

# Grab a reference to a page
page = site['/foo']

# Modify the page
page['qux'] = ui.some_card()

# Save the page
page.save()
```

You can run it by using `python my_script.py` assuming your [Wave server](/docs/installation-8-20#step-4-run) is running.

Here is the skeleton of a Wave script that continuously updates a page ([example](tutorial-monitor.md)):

```py
import time
from h2o_wave import site, ui

# Grab a reference to a page
page = site['/foo']

# Grab a reference to a card on the page
card = page['qux']

# Update the page with stats every second
while True:
    # Read data from somewhere
    cpu_percent, mem_usage, disk_usage = read_system_stats()

    # Update card's data
    card.data[-1] = [cpu_percent, mem_usage, disk_usage]
    
    # Save the page
    page.save()
    
    # Wait a second
    time.sleep(1)
```

To update pages at a much lower frequency (say, minutes, hours, days), use a scheduler like [cron](https://en.wikipedia.org/wiki/Cron) along with a simpler Wave script:

```py {10-17}
import time
from h2o_wave import site, ui

# Grab a reference to a page
page = site['/foo']

# Grab a reference to a card on the page
card = page['qux']

# Read data from somewhere
cpu_percent, mem_usage, disk_usage = read_system_stats()

# Update card's data
card.data[-1] = [cpu_percent, mem_usage, disk_usage]

# Save the page
page.save()
```

Multiple Wave scripts running on multiple devices can update the same Wave page. You can use this capability to publish a single page that displays content originating from multiple sources. For example, a single page that displays stats for all the systems in your network, or a single page that displays tickers from different stock exchanges.

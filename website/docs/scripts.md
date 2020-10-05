---
title: Q Scripts
---

A Q script is the simplest way to publish content in Q, especially live web content:
- Dashboards and visualizations for live monitoring.
- Live information displays: news, tickers, health, or performance data.

A Q script is one kind of program you can author to interact with Q. The other kind is a [Q App](apps.md). The primary difference between an app and a script is that apps are interactive (able to handle user interactions) and scripts are not. If you are not interested in handling user interactions, and only want to publish content, use a Q script.


Here is the skeleton of a Q script ([example](tutorial-hello.md)):

```py 
from h2o_q import site, ui

# Grab a reference to a page
page = site['/foo']

# Modify the page
page['qux'] = ui.some_card()

# Save the page
page.save()
```

Here is the skeleton of a Q script that continuously updates a page ([example](tutorial-monitor.md)):

```py 
import time
from h2o_q import site, ui

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

To update pages at a much lower frequency (say, minutes, hours, days), use a scheduler like [cron](https://en.wikipedia.org/wiki/Cron) along with a simpler Q script:

```py {10-17}
import time
from h2o_q import site, ui

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

Multiple Q scripts running on multiple devices can update the same Q page. You can use this capability to publish a single page that displays content originating from multiple sources. For example, a single page that displays stats for all the systems in your network, or a single page that displays tickers from different stock exchanges.
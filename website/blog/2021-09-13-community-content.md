---
slug: community-content-bdv
title: Wave Workshop - Big Data Visualizer
author: Michelle Tanco
author_title: PM of the AI AppStore @ H2O.ai
author_url: https://github.com/mtanco
author_image_url: https://avatars3.githubusercontent.com/u/4793561
image: /img/wave-type-yellow-1100x400.png

tags: [community-content]
---


H2O Wave allows for easily building front ends to your projects. I was recently inspired by [this tutorial notebook](https://github.com/h2oai/h2o-tutorials/blob/master/best-practices/anomaly-detection/anomaly_detection.ipynb) which explains how to use open source H2O-3 for finding anomalies in a dataset. Part of this process is using the H2O-3 aggregator function to visualize relationships in large datasets. A data scientist is at home in a Jupyter Notebook, but we could make it easier for ourselves and analysts or other business users to run this code and benefit from the H2O-3 aggregator function by building a front-end using H2O Wave.

Below you can see our data aggregation and visualization app. Currently, the app itself is creating a 1M row dataset as a demo. We can see that the H2O-3 aggregation function reduces this down into 68 exemplar rows and tells us how many of the original rows fall into each exemplar.

![Aggregated data as a table.](https://github.com/h2oai/wave-big-data-visualizer/blob/master/static/screenshot-1.png?raw=true)

![Aggregated data as a plot.](https://github.com/h2oai/wave-big-data-visualizer/blob/master/static/screenshot-2.png?raw=true)

## Resources

You can find the full source code for this app on [GitHub](https://github.com/h2oai/wave-big-data-visualizer).

Interested in seeing what it takes to make this type of application? In a 1 hour live-coding session we were able to:

* Create the layout of our application
* Create two interactive tabs for navigating in the app
* Create a table view for a dataset
* Create a plot view for a dataset

Here's the replay:

<iframe width="560" height="315" src="https://www.youtube.com/embed/alYWqXv8Sdg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Ideas for Improvement

For this app to be fully useful to our business users, we would probably want to add the following features:

* Easily add data: allow users to aggregate and visualize on their own datasets
  * File upload from local machine
  * Connect to common SQL warehouses
  * Connect to common cloud data stores like s3
* Improved backend performance
  * Connect to a production H2O-3 cluster rather than creating a cluster on the local machine of the H2O Wave server
* Added user control
  * Let the end user decide parameters of the aggregator function like how many exemplar rows to attempt to make
* Improved and new visualizations
  * Add new visualizations based on different data types
* Robustness
  * Add unit tests!

If you do decide to work on this project, or use this as a template for your own projects, be sure to tag us on Twitter @h2o_wave or post as a Show and Tell on our [GitHub discussions](https://github.com/h2oai/wave/discussions)!

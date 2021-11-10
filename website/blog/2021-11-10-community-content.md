---
slug: community-content-ar
title: H2O Wave - Aggregated Resources
author: Michelle Tanco
author_title: PM of the AI Cloud @ H2O.ai
author_url: https://github.com/mtanco
author_image_url: https://avatars3.githubusercontent.com/u/4793561
image: https://wave.h2o.ai/img/logo.png
tags: [community-content]
---

This blog is intended to help new users learn and become comfortable with the H2O Wave framework. Use the [Overview](#overview) section for an ordered-list of how to get started, learn more, and get hands on with the capabilities of H2O Wave. Move onto the [Examples and Existing Apps](#examples-and-existing-apps) to see what’s possible and being built by other developers. In the [Friends of Wave](#friends-of-wave) section you can learn about companion libraries which help take your Wave projects to the next level.

## Overview
### RTFM: Setup and Tutorials

The best way to get started with a product is to read it’s docs and do some examples. It’s not always fun or glamorous, but each link below will take 1 to 10 minutes to read/execute and is the best way to get you up to speed on what is possible, where Wave excels, and to have everything running on your local machine.

Have feedback? Documentation is often written by the product experts. Have an opinion on something that is confusing, could be more clear, or is missing? Add a note in the [Wave Discussions](https://github.com/h2oai/wave/discussions) or feel free to make the changes and open a pull request (PR).

1.  [Learn what Wave does](https://wave.h2o.ai/docs/getting-started)
    
2.  [Install the software on your local workstation](https://wave.h2o.ai/docs/installation)
    
3.  [Run a pre-built app on your local workstation to have access to over 150 examples](https://wave.h2o.ai/docs/tour)
    
4.  Work through the [Hello World](https://wave.h2o.ai/docs/tutorial-hello), [Beer Wall](https://wave.h2o.ai/docs/tutorial-beer), [System Monitor](https://wave.h2o.ai/docs/tutorial-monitor), [Bean Counter](https://wave.h2o.ai/docs/tutorial-counter), and [Todo List](https://wave.h2o.ai/docs/tutorial-todo) tutorials
    

### RTFM: Detailed Guides

The best way to learn details on the intricacies of a product is to read it’s docs. It’s not always fun or glamorous, but each guide topic will take 3 to 15 minutes to read and make you the expert at various topics in the Wave framework.

Start at the [introduction](https://wave.h2o.ai/docs/guide) and then use the left hand navigation to read through all topics or pick the ones you are most interested in. Topics today are:

-   Architecture
    
-   Wave Scripts
    
-   Wave Apps
    
-   Pages
    
-   Layouts
    
-   Cards
    
-   Data Buffers
    
-   Components
    
-   Query Arguments
    
-   App State
    
-   Routing
    
-   Realtime Sync
    
-   Background Tasks
    
-   Data-binding
    
-   Files
    
-   Plots
    
-   Javascript
    
-   Graphics
    
-   Security
    
-   Logging
    
-   Command Line Interface
    
-   Development
    
-   Browser Testing
    
-   Configuration
    
-   Deployment
 
-   Backup and Recovery
    
-   WaveML
    
-   WaveDB
    

### Straight to the Source

Once you are feeling like you get how Wave works and what it is good for, it’s time to find the code. Start by reading the [GitHub README](https://github.com/h2oai/wave) which explains more about the project from a technical perspective.

Browse the recent [Discussions](https://github.com/h2oai/wave/discussions) to get an idea of what types of questions people have. A great way to learn is to teach! Look for an unanswered question, if it’s a bug and there’s no reproducible example, make one! If it’s asking how to do some specific task see if you can make an example.

Checkout specifically the Show and Tell section of the Discussions to get some inspiration for using Wave and best practices. Don’t forget to contribute to the community and make your own Show and Tell post when you develop something you’re proud of.

Another great way to learn about a product is to check out the [Issues](https://github.com/h2oai/wave/issues). Read through the suggested features from the community and the new features documented by the Development team to see where the product is going. Again, see a bug ticket with no reproducible example? Make one!

Finally, [get details on the entire API](https://wave.h2o.ai/docs/api/index) from the documentation page to learn what functions are available and the parameters and outputs of each one.

### What’s New

Another good way of knowing what the product can do is to look at what features are new. Checkout the [Change Log](https://wave.h2o.ai/docs/change-log) for a simple, ordered list. You can also check out the [Blog](https://wave.h2o.ai/blog) for more news and details on Wave and releases.

See a point in the Change Log or Blog that you want to know more about? Head over to the [source code](http://github.com/h2oai/wave) and search for your key word in the Issues, PRs, and generally in GitHub. Then browse the conversations, code, and docs to learn more.

## Examples and Existing Apps

A great way to learn what is possible with H2O Wave is to look at existing apps! Find an app you like? Go to the source code in GitHub, clone the repo, and try running the app on your local workstation. Make some changes to the app and see what happens. Read through the code to learn how it works. Maybe even fix a bug or add a new feature and submit a pull request (PR).

Here is a list of some apps you may want to use as reference:

-   A Tour of Wave - this is 150+ short examples which can be accessed in several different ways
    

    -   Use the documentation at [wave.h2o.ai](http://wave.h2o.ai/) when you want to search for something and get an example app returned. Look for the Examples title in the search results.
    
    -   Explore the examples directly in the [documentation gallery](https://wave.h2o.ai/docs/examples)
    
    -   [Run the examples as single app, a Tour of Wave, on your local workstation](https://wave.h2o.ai/docs/tour)


-   [OSS Example App](https://github.com/h2oai/wave-apps) - these eight apps can be used as a starting point in your app development journey. Have an idea for how to improve them or streamline the source code or make the code more readable? Make some changes and a PR.
    

	-   [Explainable Hotel Ratings](https://github.com/h2oai/wave-apps/blob/main/explaining-ratings/README.md): This app allows you to filter hotel reviews and compare the most common phrases from the subset to the overall most common phrases.
    
	-   [Guess the Number](https://github.com/h2oai/wave-apps/blob/main/guess-the-number/README.md): This a game where the machine "thinks" of a number and the human has to guess, getting told higher or lower. This application has a leader board where different users can compete to see who can guess numbers in the fewest number of turns, on average. This application teaches the developer about different app states and could be fun for new users.
    
	-   [Human-in-the-Loop Credit Risk](https://github.com/h2oai/wave-apps/blob/main/credit-risk/README.md): This application allows a business user to review model predictions on whether or not someone will pay off their credit card - a model used to approve or deny credit card applications. Specifically, this app provides a list of predictions the model is not confident about (predictions in the 0.4 to 0.6 range) and allows the end user to mark someone as approved or not.
    
	-   [Mitigating Churn Risk](https://github.com/h2oai/wave-apps/blob/main/churn-risk/README.md): This application builds a churn prediction model with H2O-3 and provides the likelihood to churn and actionable recommendations to prevent churn via nicely-presented top shapley values.
    
	-   [Online Shopping Recommendations](https://github.com/h2oai/wave-apps/blob/main/shopping-cart-recommendations/README.md): This application allows a marketing analyst to understand how their recommendation engine works. It allows them to add items to their cart and as they do a list of recommended products is updated.
    
	-   [Sales Forecasting EDA](https://github.com/h2oai/wave-apps/blob/main/sales-forecasting/README.md): This application provides an easy-to-use interface for exploring historical sales values and looking at future forecasts across store segments.
    
	-   [Social Media Sentiment](https://github.com/h2oai/wave-apps/blob/main/twitter-sentiment/README.md): This application pulls tweets and uses the open source VaderSentiment to understand positive and negative tweets.
    

-   [Big Data Visualizer](https://github.com/h2oai/wave-big-data-visualizer) - This application was started [live in a webinar](https://youtu.be/alYWqXv8Sdg) which gives you an idea of both how to build your own apps and also what is possible in an hour once you’re comfortable with the product. You can learn more about the inspiration for this app in [this blog pos](https://wave.h2o.ai/blog/community-content-bdv)t.
    

## Friends of Wave

### Machine Learning with Wave: WaveML

WaveML is a companion package to H2O Wave which makes it quick and easy to integrate machine learning models into Wave applications. This is done with a simple, high-level API to train, deploy, score, and explain ML models. This package uses H2O’s open source AutoML and can optionally use Driverless AI.

Get started by first reading the [ReadMe](https://github.com/h2oai/wave-ml) in Github which includes an installation guide to and quickstart example to get started.

Information we have already looked at is pertinent for WaveML, too:

-   There is a [guide section on WaveML](https://wave.h2o.ai/docs/wave-ml)
    
-   Twelve of the Tour of Wave examples are on WaveML
    
-   The [Mitigating Churn Risk](https://github.com/h2oai/wave-apps/blob/main/churn-risk/README.md) and [Human-in-the-Loop Credit Risk](https://github.com/h2oai/wave-apps/blob/main/credit-risk/README.md) OSS example apps use Wave-ML
    
-   WaveML API can be found in the [Wave API](https://wave.h2o.ai/docs/wave-ml/) documentation
  

### Data Storage with Wave: WaveDB

WaveDB is a lightweight companion database to Wave, based on SQLite. WaveDB is [SQLite](https://www.sqlite.org/index.html) with a HTTP interface. It is a ~6MB (~2MB [UPX](https://upx.github.io/)-compressed) self-contained, zero-dependency executable that bundles SQLite 3.35.5 (2021-04-19) with JSON1, RTREE, FTS5, GEOPOLY, STAT4, and SOUNDEX.

If you are already a fan of SQLite, WaveDB acts as a thin HTTP-server wrapper that lets you access your SQLite databases over a network. WaveDB can be used as a lightweight, cross-platform, installation-free companion SQL database for Wave apps. The h2o-wave package includes non-blocking async functions to access WaveDB.

Information we have already looked at is pertinent for WaveDB, too:

-   There is a [Guide section on WaveDB](https://wave.h2o.ai/docs/wavedb/) which included how to download and install the database
    
-   Two of the Tour of Wave examples are on WaveDB

-   WaveDB API can be found in the [Wave API](https://wave.h2o.ai/docs/api/db/) documentation
    

  

## Wrapping Up

We hope that this helps with getting started and learning more about H2O Wave. Use the GitHub discussion board or tag us on Twitter with any questions or reference to what you’re building!
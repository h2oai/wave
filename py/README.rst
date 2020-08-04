H2O Q
=====

H2O Q is a lightweight software stack for programming interactive web applications
entirely in Python (no HTML/Javascript/CSS) required.

It is designed to make it fast, fun and easy to build low-latency, realtime,
collaborative, web-based applications. It ships batteries-included with
a suite of form and data visualization components for rapidly prototyping
analytical and decision-support applications.

Q's components work in conjunction with the Q relay server that facilitates 
realtime state synchronization between Python and web browsers.


Installing
----------

Install and update using `pip`_:

.. code-block:: text

    pip install -U h2o-q


Hello world
----------------

``hello.py``:

.. code-block:: python

    from h2o_q import site, ui

    # Access the web page at http://localhost:55555/demo
    page = site['/demo']

    # Add some content.
    page['example'] = ui.markdown_card(
      box='1 1 2 2',
      title='Hello World!',
      content='And now for something completely different.',
    )

    # Save the page
    page.save()

Run ``hello.py``:

.. code-block:: text

    $ python hello.py


Links
-----

* Website: https://www.h2o.ai/h2o-q/
* Releases: https://pypi.org/project/h2o-q/
* Documentation: https://h2oai.github.io/qd/
* Code: https://github.com/h2oai/qd
* Issue tracker: https://github.com/h2oai/qd/issues

.. _pip: https://pip.pypa.io/en/stable/quickstart/

Change Log
---------------
* v0.1.1
    * Added
        * Options for file type and size to file upload component.
        * API for displaying desktop notifications.
        * Buttons can now submit specific values instead of only True/False.
        * Examples for layout and card sizing.
        * Image card for displaying base64-encoded images.
        * Example for image card.
        * Vector graphics API.
        * Turtle graphics based path generator.
        * Examples for graphics card.
    * Fixed
        * Re-rendering performance improvements.
* v0.1.0
    * Added
        * Example for displaying iframe content > 2MB.
        * Example for plotting using matplotlib.
        * Example for plotting using Altair.
        * Example for plotting using Vega.
        * Example for plotting using Bokeh.
        * Example for plotting using custom D3.js Javascript.
        * Example for live dashboard with stats cards.
        * Example for master-detail user interfaces using ``ui.table()``.
        * Example for authoring multi-step wizard user interfaces.
        * Unload API: ``q.unload()`` to delete uploaded files.
* v0.0.7
    * Added
        * Download API: ``q.download()``.
        * Vega-lite support: ``ui.vega_card()``.
        * Context menu support to all cards.
        * ``refresh`` attribute on ``meta_card`` allows static pages to stop receiving live updates.
        * Passing ``-debug`` when starting server displays site stats at ``/_d/site``.
        * Drag and drop support for file upload component.
        * Template expression support for markdown cards.
        * All APIs and examples documented.
        * All 110 examples now ship with the Sphinx documentation.
        * Documentation now ships with release download.
    * Changed
        * API consistency: ``ui.vis()`` renamed to ``ui.plot()``.
        * All stats cards now have descriptive names.
        * API consistency: ``ui.mark.mark`` renamed to ``ui.mark.type``.
        * API consistency: ``page.sync()`` and ``page.push()`` renamed to ``page.save()``.
    * Removed
        * ``ui.dashboard_card()`` and ``ui.notebook_card()``.
* v0.0.6
    * Added
        * Log network traffic when logging is set to debug mode.
        * Capture and display unhandled exceptions on the UI.
        * Routing using location hash.
        * Toolbar component.
        * Tabs component.
        * Nav component.
        * Upload API: ``q.upload()``.
    * Changed
        * ``q.session`` renamed to ``q.user``
* v0.0.5
    * Added
        * Add configure() API to configure environment before launching.
* v0.0.4
    * Added
        * Multi-user and multi-client support: launch apps in ``multicast`` or ``unicast`` modes in addition to ``broadcast`` mode.
        * Client-specific data can now be stored and accessed via ``q.client``, similar to ``q.session`` and ``q.app``.
        * Simpler page referencing: ``import site`` can be used instead of ``site = Site()``.
    * Changed
        * Apps now lauch in ``unicast`` mode by default instead of ``broadcast`` mode.
* v0.0.3
    * Added
        * Make ``Expando`` data structure available for apps.
* v0.0.2
    * Initial version
* v0.0.1
    * Package stub

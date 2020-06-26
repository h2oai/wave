Telesync
========

Telesync is a lightweight library for programming interactive web applications
entirely in Python (no HTML/Javascript/CSS) required.

It is designed to make it fast, fun and easy to build low-latency, realtime,
collaborative, web-based applications. It ships batteries-included with
a suite of form and data visualization components for rapidly prototyping
analytical and decision-support applications.

Telesync's components work in conjunction with the Telesync relay server
that facilitates realtime state synchronization between Python and web browsers.

The Telesync relay server is built into H2O.ai Q for enterprise-grade hosting.


Installing
----------

Install and update using `pip`_:

.. code-block:: text

    pip install -U telesync


Hello world
----------------

.. code-block:: python

    from telesync import site, ui

    # Get the web page at route 'http://localhost:55555/demo'.
    page = site['/demo']

    # Add some content to the page.
    page['example'] = ui.markdown_card(
      box='1 1 2 2',
      title='Hello World!',
      content='And now for something completely different.',
    )

    # Finally, sync the page to update the web browser.
    page.sync()


.. code-block:: text

    $ python hello.py


Links
-----

* Website: https://www.h2o.ai/h2o-q/
* Releases: https://pypi.org/project/telesync/
* Code: https://github.com/h2oai/telesync
* Issue tracker: https://github.com/h2oai/telesync/issues


.. _pip: https://pip.pypa.io/en/stable/quickstart/

Change Log
---------------

* v0.0.3
    * Added
        * Make Expando data structure available for apps.
* v0.0.2
    * Initial version
* v0.0.1
    * Package stub
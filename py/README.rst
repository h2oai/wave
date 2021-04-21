H2O Wave
========

H2O Wave is a lightweight software stack for programming interactive web applications
entirely in Python (no HTML/Javascript/CSS required).

It is designed to make it fast, fun and easy to build low-latency, realtime,
collaborative, web-based applications. It ships batteries-included with
a suite of form and data visualization components for rapidly prototyping
analytical and decision-support applications.

Wave's components work in conjunction with the Wave relay server that facilitates
realtime state synchronization between Python and web browsers.


Installing
----------

Install and update using `pip`_:

.. code-block:: text

    pip install -U h2o-wave


Hello world
----------------

``hello.py``:

.. code-block:: python

    from h2o_wave import site, ui

    # Access the web page at http://localhost:10101/demo
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

* Website: https://wave.h2o.ai/
* Releases: https://pypi.org/project/h2o-wave/
* Code: https://github.com/h2oai/wave
* Issue tracker: https://github.com/h2oai/wave/issues

.. _pip: https://pip.pypa.io/en/stable/quickstart/


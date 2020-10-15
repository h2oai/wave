---
title: Browser Testing
---

Wave supports authoring functional tests in Python for the [Cypress](https://www.cypress.io/) test framework. This feature lets you automate browser-based point-and-click tests for your app.

## Installation

#### Step 1: Install Node.js

Install a recent version of [Node.js](https://nodejs.org/en/).

#### Step 2: Set up Cypress

Using your terminal, go to your Wave installation's `test` directory and install Cypress

```
$ cd path/to/wave
$ cd test
$ npm install
```

## Writing a test

See the [Wizard](#wizard) example to understand how to author tests for your interactive app. Specifically, note how the `@cypress` attribute is used. Refer to the [Cypress API](https://docs.cypress.io/api/api/table-of-contents.html) to learn how to author assertions.


```py
from h2o_wave import cypress

@cypress('Walk through the wizard')
def test_wizard(cy):
    cy.visit('/demo')
    cy.locate('step1').click()
    cy.locate('text').should('contain.text', 'What is your name?')
    cy.locate('nickname').clear().type('Fred')
    cy.locate('step2').click()
    cy.locate('text').should('contain.text', 'Hi Fred! How do you feel right now?')
    cy.locate('feeling').clear().type('quirky')
    cy.locate('step3').click()
    cy.locate('text').should('contain.text', 'What a coincidence, Fred! I feel quirky too!')

```

## Running your test

#### Step 1: Start the Cypress test runner

```
$ cd path/to/wave
$ cd test
$ ./node_modules/.bin/cypress open
```

#### Step 2: Start the Wave server as usual

```
$ ./wave
```

#### Step 3: Translate your Python tests to Javascript

To translate your Python tests to Javascript, execute the Python module or file containing your tests like this:

```
$ CYPRESS_INTEGRATION_TEST_DIR=path/to/wave/test/cypress/integration ./venv/bin/python examples/wizard.py
```
The `CYPRESS_INTEGRATION_TEST_DIR` environment variable indicates where the Wave SDK should write translated files to. This must be set to the `cypress/integration` directory.

Alternatively, you can set the `CYPRESS_INTEGRATION_TEST_DIR` environment variable in your shell (or IDE) to simplify running your test file:

```
$ export CYPRESS_INTEGRATION_TEST_DIR=path/to/wave/test/cypress/integration
$ ./venv/bin/python examples/wizard.py
```

#### Step 4: Run your tests

At this point, you should find all your tests displayed in the Cypress UI. Simply click on a test to run it. Happy testing!



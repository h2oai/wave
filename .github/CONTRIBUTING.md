# Q Contributing Guide

Hi! We are really excited that you are interested in contributing to Q.
Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Code of Conduct](https://github.com/h2oai/qd/tree/master/.github/CODE_OF_CONDUCT.md)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)

## Issue Reporting Guidelines

- Bugs
  - Provide detailed description.
  - Provide OS version, Q version, browser name and version.
  - Gif showing the problem is highly preferred.
  - Code snippet causing the bug preferred.
- Features
  - Provide detailed description.
  - Provide a reason / usecase why this feature is needed.

## Pull Request Guidelines

- All development should be done in dedicated branches. **Do not submit PRs against the `master` branch.**

- Branch name should be named feat/issue-${ISSUE_NUMBER} or fix/issue-${ISSUE_NUMBER}. If your branch name ends with
a number, our `githooks/commit-msg.js` will assume it is an issue number and append `#${ISSUE_NUMBER}` to your commit message
automatically. This links the commit to the corresponding issue.

- Work in the `src` folder and **DO NOT** checkin `dist` in the commits.

- It's OK to have multiple small commits as you work on the PR - GitHub will automatically squash it before merging.

- Make sure `make test-ui-ci` passes. (see [development setup](#development-setup))

- If adding a new feature:
  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.
  - Provide Closes #issue-number (e.g. Closes #11)

- If fixing bug:
  - Provide an explanation of what was the cause of the bug.
  - Provide code changes description.
  - Don't forget to provide a unit test to make sure it won't repeat in the future.
  - Provide Closes #issue-number (e.g. Closes #11)

## Development Setup

You will need [Node.js](http://nodejs.org) **version 10+**, [Go](https://golang.org/) **version 10+**, [Python](https://www.python.org/) **version 3.7**
After cloning the repo, run:

``` bash
make all
```

After successful setup, you need to run:

- Q server (Go server) with command

``` bash
make run
```

- Q app (this will run `tour.py`, but can be any app)

``` bash
cd py && ./venv/bin/python examples/wizard.py
```

- Hot reload webpack server (for easier UI development)

``` bash
make run-ui
```

After that you can go to `http://localhost:55555/tour` (`http://localhost:3000/tour` if you enabled hot reload server).

### Committing Changes

Commit messages must follow [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). After commit, we have hooks in place that will:

- Lint commit message format.
- Lint staged files based on their extension. Linting supported for `.ts`, `.tsx`, `.go`, `.py`, `.md` files.
- Run accompanying unit tests if found.
- Run Typescript compiler for typescript files.

If any of these checks fails, the commit is aborted and you have to fix the errors first.

Make sure your commit message also ends with an issue number (e.g. fix: Typo #11).

### Commonly used make targets

``` bash
# Compiles Typescript API to Python API.
$ make generate

# Starts Q server.
$ make run

# Starts hot reload dev server for UI.
$ make run-ui

# Starts jest UI unit tests in watch mode.
$ make test-ui-watch

# Starts Cypress e2e server for python tests.
$ make run-cypress-bridge
```

## Project Structure

- **`data`**: contains data created by a Q-app itself (e.g. file upload files)

- **`docs`**: contains documentation page related files

- **`py`**: contains Python lib that is exported as a package

- **`r`**: contains R lib that is exported as a package

- **`site`**: contains new Vuepress-powered documentation site

- **`tools`**: contains Typescript to Python compiler

- **`ui`**: contains UI components written in React + Typescrip that are later translated to Python
  - **`config`** contains webpack configuration
  - **`eslint`** contains custom eslint rules for `ts` and `tsx` files
  It is required to run `npm ci` after changing `linter.js` in order for changes to take effect.

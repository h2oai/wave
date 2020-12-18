# Wave Contributing Guide

We appreciate all contributions. If you are planning to contribute back bug-fixes, please do so without any further discussion.

If you plan to contribute new features, please first [open an issue](https://github.com/h2oai/wave/issues/new/choose) and discuss the feature with us. Sending a PR without discussion might end up resulting in a rejected PR because we might be taking the software in a different direction than you might be aware of.

(Based on the [PyTorch Contribution Guide](https://pytorch.org/docs/stable/community/contribution_guide.html).)

## About open source development

If this is your first time contributing to an open source project, some aspects of the development process may seem unusual to you.

- **There is no way to "claim" issues.** People often want to "claim" an issue when they decide to work on it, to ensure that there isn’t wasted work when someone else ends up working on it. This doesn’t really work too well in open source, since someone may decide to work on something, and end up not having time to do it. Feel free to give information in an advisory fashion, but at the end of the day, we will take running code and rough consensus.

- **There is a high bar for new functionality that is added.** Unlike in a corporate environment, where the person who wrote code implicitly "owns" it and can be expected to take care of it in the beginning of its lifetime, once a pull request is merged into an open source project, it immediately becomes the collective responsibility of all maintainers on the project. When we merge code, we are saying that we, the maintainers, are able to review subsequent changes and make a bugfix to the code. This naturally leads to a higher standard of contribution.

## Proposing new features

New feature ideas are best discussed on a specific issue. Please include as much information as you can, any accompanying data, and your proposed solution. The H2O Wave team and community frequently reviews new issues and comments where they think they can help. If you feel confident in your solution, go ahead and implement it.

## Reporting issues

If you’ve identified an issue, first search through the list of existing issues on the repo. If you are unable to find a similar issue, then create a new one. Supply as much information you can to reproduce the problematic behavior. Also, include any additional insights like the behavior you expect.

## Implementing features

If you want to fix a specific issue, it’s best to comment on the individual issue with your intent. However, we do not lock or assign issues except in cases where we have worked with the developer before. It’s best to strike up a conversation on the issue and discuss your proposed solution. The H2O Wave team can provide guidance that saves you time.

Issues that are labeled **good first issue**, **low** or **medium** priority are great places to start. Only issues that have assigned a milestone or are tagged with **help needed** / **good first issue** will be merged.

## Improving documentation and tutorials

We aim to produce high quality documentation and tutorials. On rare occasions that content includes typos or bugs. If you find something you can fix, send us a pull request for consideration.

## Submitting pull requests

You can view a list of all [open issues](https://github.com/h2oai/wave/issues). Commenting on an issue is a great way to get the attention of the team. From here you can share your ideas and how you plan to resolve the issue.

For more challenging issues, the team will provide feedback and direction for how to best solve the issue.

If you’re not able to fix the issue yourself, commenting and sharing whether you can reproduce the issue can be useful for helping the team identify problem areas.

## Improving code readability

Improved code readability helps everyone. It is often better to submit a small number of pull requests that touch few files versus a large pull request that touches many files. Opening an issue related to your improvement is the best way to get started.

## Adding test cases

Additional test coverage is appreciated.  Help us make the codebase more robust.

## Security vulnerabilities

If you discover a security vulnerability within H2O Wave, please send an email to Prithvi Prabhu at prithvi@h2o.ai. All security vulnerabilities will be promptly addressed.

## Code of Conduct

This Code of Conduct provides community guidelines for a safe, respectful, productive, and collaborative place for any person who is willing to contribute to the H2O Wave community. It applies to all "collaborative space", which is defined as community communications channels (such as mailing lists, submitted patches, commit comments, etc.).

- Participants will be tolerant of opposing views.
- Participants must ensure that their language and actions are free of personal attacks and disparaging personal remarks.
- When interpreting the words and actions of others, participants should always assume good intentions.
- Behaviour which can be reasonably considered harassment will not be tolerated.

(Based on the [Ruby Code of Conduct](https://www.ruby-lang.org/en/conduct/).)

## Development Setup

You will need [Node.js](http://nodejs.org) **version 10+**, [Go](https://golang.org/) **version 1.13.10+**, [Python](https://www.python.org/) **version 3.7**
After cloning the repo, run:

``` bash
make all
```

After successful setup, you need to run:

- Wave server (Go server) with command

``` bash
make run
```

:warning: This project is best suited for Linux-based machines at the moment. If you develop on Windows machine, we suggest using [WSL](https://docs.microsoft.com/en-us/windows/wsl/about).

- Wave app (this will run `tour.py`, but can be any app)

``` bash
cd py && ./venv/bin/python examples/tour.py
```

- Hot reload webpack server (for easier UI development)

``` bash
make run-ui
```

After that you can go to `http://localhost:10101/tour` (`http://localhost:3000/tour` if you enabled hot reload server).

### Committing Changes

Commit messages must follow [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). After commit, we have hooks in place that will:

- Lint commit message format.
- Lint staged files based on their extension. Linting supported for `.ts`, `.tsx`, `.go`, `.py`, `.md` files.
- Run accompanying unit tests if found.

If any of these checks fails, the commit is aborted and you have to fix the errors first.

Make sure your commit message also ends with an issue number e.g. `fix: Typo #11`. (Tip: If you name your branch name in format `something-#GITHUB_ISSUE_NUM`, the issue number will get appended automatically to your commit message.)

### Commonly used make targets

``` bash
# Compiles Typescript API to Python API.
$ make generate

# Starts Wave server.
$ make run

# Starts hot reload dev server for UI.
$ make run-ui

# Starts jest UI unit tests in watch mode.
$ make test-ui-watch

# Starts Cypress e2e server for python tests.
$ make run-cypress-bridge
```

## Project Structure

- **`data`**: contains data created by a Wave-app itself (e.g. file upload files)

- **`docs`**: contains documentation page related files

- **`website`**: documentation page source files

- **`py`**: contains Python lib that is exported as a package

- **`r`**: contains R lib that is exported as a package

- **`tools`**: contains Typescript to Python generator

- **`ui`**: contains UI components written in React + Typescript that are later translated to Python
  - **`config`** contains webpack configuration
  - **`eslint`** contains custom eslint rules for `ts` and `tsx` files
  It is required to run `npm ci` after changing `linter.js` in order for changes to take effect.

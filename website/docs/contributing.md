---
title: Contributing
---

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

Please be respectful of maintainer's time and do not ask questions like "Which file should I edit" etc. Do some due diligence first. Chances are that if you are not able to find the file that needs to be changed, the feature implementation might be overwhelming for you as well.

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

If you discover a security vulnerability within H2O Wave, please send an email to Prithvi Prabhu at <prithvi@h2o.ai>. All security vulnerabilities will be promptly addressed.

## Code of Conduct

See <https://github.com/h2oai/wave/blob/main/.github/CODE_OF_CONDUCT.md>.

## Development Setup

Prerequisites:

- [Go](https://golang.org/) v1.19+
- [Node.js](http://nodejs.org) v16+
- [Python](https://www.python.org/) 3.8+
- A C/C++ compiler [XCode](https://developer.apple.com/xcode/) on OSX, `build-essential` on Debian, `base-devel` on Arch, etc.) to build Python/Node.js dependencies.

:warning: This project is best developed on OSX or Linux at the moment. If you develop on Windows, [WSL](https://docs.microsoft.com/en-us/windows/wsl/about) is recommended.

You will need [Go](https://golang.org/) 1.19+, [Node.js](http://nodejs.org) 16+, [Python](https://www.python.org/) 3.7+. You should already have Python 3.7+ on a modern OS. It is recommended that you get Go and Node.js from their websites, since your OS package managers (`apt`, `brew`, etc.) are likely to have old packages.

### Getting started

To set up all development dependencies, clone the repo and run:

``` bash
make all
```

To launch the Wave server, run:

``` bash
make run
```

Try running the button example to verify if your setup is functional:

``` bash
cd py && ./venv/bin/wave run examples.button
```

You should now see the button example at <http://localhost:10101/demo>.

For front-end development, you'll also need to start the a UI dev server:

``` bash
make run-ui
```

You should now see the button example at <http://localhost:3000/demo>.

Once you have the UI dev server running, you should be able to visualize any changes to `./ui` in real time.

Happy hacking!

### Daily development

For daily development, you'll only need to pull `main` from git and run `make run` and `make run-ui`. Running `make setup` is not necessary unless `make run` or `make run-ui` fail due to missing dependencies.

### Other make targets

``` bash
# Generates Python and R APIs.
# Run only if you add new cards/components, attributes or fix docstrings.
$ make generate

# Displays all the available make targets.
$ make help
```

## Repo Structure

- `cmd`: Go executables
- `data`: contains data created by a Wave-app itself (e.g. file upload files)
- `py`: Python package
- `r`: R package
- `tools/wavegen`: Typescript to Python/R code-generator
- `ui`: Typescript + React sources, primarily built using Fluent UI.
  - `config` contains webpack configuration
  - `eslint` contains custom eslint rules for `ts` and `tsx` files.  It is required to run `npm ci` after changing `linter.js` in order for changes to take effect.
- `website`: documentation sources

### Committing Changes

Commit messages must follow [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

Make sure your commit message also ends with an issue number e.g. `fix: Typo #11`.

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
- [Python](https://www.python.org/) 3.7+
- A C/C++ compiler [XCode](https://developer.apple.com/xcode/) on OSX, `build-essential` on Debian, `base-devel` on Arch, etc.) to build Python/Node.js dependencies.

:warning: This project is best developed on OSX or Linux. If you are on Windows, use [WSL](https://docs.microsoft.com/en-us/windows/wsl/about).

Setup:

``` bash
git clone https://github.com/h2oai/wave.git
cd wave
make all
```

Launch the Wave server at <http://localhost:10101/>

``` bash
make run
```

To modify the `h2o-wave` Python package or examples, open `./py` in PyCharm or your preferred IDE. To test your modifications, first activate the `venv` in `./py`:

``` bash
cd py
./venv/bin/activate
```

If you want to run for example a python button example:

```bash
wave run examples.button
```

All examples are located in [py/examples](https://github.com/h2oai/wave/tree/main/py/examples) folder.

If you intend to modify the UI (Typescript), also launch the UI development server at <http://localhost:3000/> to watch and hot-reload your modifications. Open `./ui` in Visual Studio Code or your preferred IDE.

``` bash
make run-ui
```

If you modify the Typescript card/component definitions (TS interfaces), run `make generate` to re-generate the corresponding Python and R definitions.

To view a list of additional make tasks:

```bash
$ make help
all                            Setup and build everything
build                          Build everything
build-db                       Build database server for current OS/Arch
build-ide                      Build IDE
build-py                       Build h2o_wave wheel
build-server                   Build server for current OS/Arch
build-server-micro             Build smaller (~2M instead of ~10M) server executable
build-ui                       Build UI
build-website                  Build website
clean                          Clean
docs                           Generate API docs and copy to website
generate                       Generate driver bindings
generator                      Build driver generator
help                           List all make tasks
preview-website                Preview website
publish-website                Publish website
release                        Prepare release builds (e.g. "VERSION=1.2.3 make release)"
run-cypress                    Run Cypress
run-db                         Run database server
run-micro                      Run microwave
run                            Run server
run-ui                         Run UI in development mode (hot reloading)
setup                          Set up development dependencies
tag                            Bump version and tag
test-ui-ci                     Run UI unit tests in CI mode
test-ui-watch                  Run UI unit tests
```

## Project Structure

- `cmd`: Go executable.
- `pkg`: Go shared package.
- `ide`: Browser-based IDE.
- `py`: Python package (`h2o-wave`) and examples.
- `r`: R package and examples.
- `tools`: additional tools, including Typescript-to-Python/R generator.
- `ui`: UI (Typescript + React + Fluent UI):
- `ts`: NPM package (`h2o-wave`).
- `website`: Documentation website (Docusaurus 2).

### Committing Changes

Commit messages must follow [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/).

Make sure your commit message also ends with an issue number e.g. `fix: Typo #11`.

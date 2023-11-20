# Wave Studio

In-browser IDE for building Wave apps. No local environment setup needed.

## Building for H2O Appstore

A common ask for this app is to install arbitrary python dependencies. Even though there is no such native feature [yet](https://github.com/h2oai/wave/issues/2193), it's possible to achieve via custom build.

The steps below work on Linux/MacOS. For MacOS one needs to run `brew install gsed` if hasn't done already.

Clone the repo first.

```sh
git clone https://github.com/h2oai/wave
```

Then update the [requirements.txt](https://github.com/h2oai/wave/blob/main/studio/requirements.txt) file with your desired dependencies.

Once done, make a new build

```sh
cd studio
make setup
VERSION=1.2.3 make build
```

If there were no errors, your `.wave` bundle should be located at `build/apps/wave-studio`. Once complete, you are ready to deploy the bundle into Appstore and start coding!

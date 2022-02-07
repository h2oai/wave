---
slug: wave-on-heroku
title: "Deploying Wave apps on Heroku"
author: Srinivas Neppalli
author_title: Sr. AI Software Engineer @ H2O.ai
author_url: https://github.com/srini-x
author_image_url: https://media-exp1.licdn.com/dms/image/C5603AQFDvAMk4rSJHQ/profile-displayphoto-shrink_400_400/0/1516346833817?e=1648684800&v=beta&t=45kV7SbqzTUDznPYGLAftGzrW5GC-hUfD6OFM3Tbe20
image: /img/wave-type-yellow-1100x400.png

tags: [community-content]
---

Wave makes it very easy to create data science applications. Heroku is a cloud platform where we can quickly deploy our Wave app and share it with the rest of the world.
The following is a walk through on how to deploy a Wave app on Heroku.

<!--truncate-->

Following are the step by step instructions to deploy your [Wave][wave] app to [Heroku][heroku-home] platform. A GitHub repository with an example Wave app that can be deployed to Heroku is available [here][wave-heroku-repo].

To know more about Heroku, read [What is Heroku ?][what-is-heroku] And yes, we can deploy our Wave apps for free on Heroku.

## Requirements

Before we begin, please make sure you have these requirements covered.

- [Docker][docker-get-started]
- [Heroku Account][heroku-sign-up]
- [Heroku CLI][heroku-cli]

## Overview

1. Create a Wave app and make sure it is running on our local machine.
2. Dockerize the Wave app.
3. Deploy the Docker image to Heroku.
4. Cake.

## Step by Step

Let's begin.

### 1. Create a Wave App

You can create your own Wave app ([examples][wave-examples]) or use an existing one. For the sake of this tutorial, let's clone from [srini-x/wave-heroku][wave-heroku-repo]

If you already have an app ready to go, you can skip to the next section.

#### Clone the repo

```shell
$ git clone https://github.com/srini-x/wave-heroku.git
$ cd wave-heroku
```

#### Setup Virtual Environment

```shell
$ python -V
Python 3.8.11

$ python -m venv .venv
$ . .venv/bin/activate
(.venv)$ pip install --upgrade pip
(.venv)$ pip install -r requirements.txt
```

#### Run the Wave App

Let's run our app on our local machine.
If you are using Wave version older than `0.20.0`, you need to start the Wave server (`waved`) before running the
Python app. Please refer to the [Wave Docs][wave-older-versions].

```shell
(.venv)$ wave run ai_app/app.py

2022/02/04 19:13:52 #
2022/02/04 19:13:52 # ┌────────────────┐ H2O Wave
2022/02/04 19:13:52 # │  ┐┌┐┐┌─┐┌ ┌┌─┐ │ 0.20.0 20220131055911
2022/02/04 19:13:52 # │  └┘└┘└─└└─┘└── │ © 2021 H2O.ai, Inc.
2022/02/04 19:13:52 # └────────────────┘
2022/02/04 19:13:52 #
```

The app will be available at http://localhost:10101.

### 2. Dockerize the Wave app

#### Get Dockerfile

For this step we need to add 3 new files to our repo. All three files are available at [srini-x/wave-heroku][wave-heroku-repo].
Place all three files at the root of the repo/project.

- [Dockerfile][wave-app-dockerfile] - This is the file we need to build our Docker image.
- [docker-entrypoint.sh][wave-app-docker-entrypoint] - This is the bash script that is called to start out Wave app inside the Docker container.
- [.dockerignore][wave-app-dockerignore] - This file is similar to `.gitignore` file which contains the list of all unnecessary files.

If you are following along from the top and cloned the example repo, the files are already there.

**Note**

Please make sure there is a `requirements.txt` file at the root of the repo/project. If
you don't have one, please generate one using the following command

While the virtual environment is activated, run

```shell
(.venv)$ pip freeze > requirements.txt

```

#### Build the Docker Image

Be at the root of the repo and run this command to create a Docker image with our Wave app inside it.
Change the values of `PYTHON_VERSION`, `WAVE_VERSION`, and `PYTHON_MODULE` to match your setup.
`PYTHON_MODULE` is same as the last part of the `wave run <PYTHON_MODULE>` command.

```shell
$ docker build \
--build-arg PYTHON_VERSION=3.8 \
--build-arg WAVE_VERSION=0.20.0 \
--build-arg PYTHON_MODULE="ai_app/app.py" \
-t wave-heroku:0.1.0 .
```

Check that our image is available

```shell
$ docker image ls

REPOSITORY                                 TAG                        IMAGE ID       CREATED         SIZE
wave-heroku                                0.1.0                      84621557615e   2 minutes ago     457MB
```

#### Run the Wave app using Docker

Let's start a Docker container from the Docker image we created.

**Note**:

In the following command, you can pick any `PORT` values for `-p` and `-e PORT`.
This `-e PORT=<waved-port-inside-container>` option is used by Heroku to set the `PORT` for our `waved` server.
When running locally, we can select any value for `PORT` as long as it is available.
However, we need to use the same `PORT` value for `-p` option. Ex: `-p <app-port-outside-container>:<waved-port-inside-container>`

If we select our `PORT` inside the container to be `9999` and port outside the container to be `8080`, the command will look like
`-p 8080:9999 -e PORT=9999`. In this case, the app will be available at http://localhost:8080.

You can also select same `PORT` for inside and outside, Ex: `-p 10101:10101 -e PORT=10101`.

```shell
$ docker run --rm --name wave-heroku -p 10101:8888 -e PORT=8888 wave-heroku:0.1.0

$ ( cd /home/appuser/wave/wave-0.20.0-linux-amd64 && ./waved -listen ":8888" & )

2022/02/05 03:34:26 #
2022/02/05 03:34:26 # ┌────────────────┐ H2O Wave
2022/02/05 03:34:26 # │  ┐┌┐┐┌─┐┌ ┌┌─┐ │ 0.20.0 20220131055911
2022/02/05 03:34:26 # │  └┘└┘└─└└─┘└── │ © 2021 H2O.ai, Inc.
2022/02/05 03:34:26 # └────────────────┘
2022/02/05 03:34:26 #
2022/02/05 03:34:26 # {"address":":8888","base-url":"/","t":"listen","web-dir":"/home/appuser/wave/wave-0.20.0-linux-amd64/www"}

$ wave run --no-reload --no-autostart ai_app/app.py

2022/02/05 03:34:30 #
2022/02/05 03:34:30 # ┌────────────────┐ H2O Wave
2022/02/05 03:34:30 # │  ┐┌┐┐┌─┐┌ ┌┌─┐ │ 0.20.0 20220131055911
2022/02/05 03:34:30 # │  └┘└┘└─└└─┘└── │ © 2021 H2O.ai, Inc.
2022/02/05 03:34:30 # └────────────────┘
2022/02/05 03:34:30 #
2022/02/05 03:34:30 # {"address":":10101","base-url":"/","t":"listen","web-dir":"/home/appuser/venv/www"}
INFO:     Started server process [1]
INFO:     Waiting for application startup.
2022/02/05 03:34:31 # {"host":"http://127.0.0.1:8000","route":"/","t":"app_add"}
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

app will be available at http://localhost:10101

### 3. Deploy the Docker image to Heroku

Ok. Hard part is over. Let's login to Heroku and deploy our app.

#### Log into Heroku using CLI

Once we have Heroku CLI installed, we can login to Heroku using the following command.
This will open a browser and ask you to login to Heroku.

```shell
$ heroku login

heroku: Press any key to open up the browser to login or q to exit:
Opening browser to https://cli-auth.heroku.com/auth/cli/browser/77d5068e-0r48-34g2-uiw9-0805c7280efe?requestor=SFMyNTY.g2hoqGFFFF02Ny4xODAuMTA1Ljc2bgYACBy8x34BYgABUYA.uF3ICR3g2gehvgFiblrd6jfHRIiHbAXZkGbmUFxXICg
Logging in... done
Logged in as <your-email@mail.com>
```

#### Log into Container Registry

```shell
$ heroku container:login
```

#### Create a Heroku app

Be in the root of the repo and run.

```shell
$ heroku create

Creating app... done, ⬢ hidden-reef-76107
https://hidden-reef-76107.herokuapp.com/ | https://git.heroku.com/hidden-reef-76107.git
```

Optionally, rename the app to give it a friendly name.
Make sure that the name is unique.

```shell
$ heroku apps:rename --app hidden-reef-76107 my-wave-app-1234

Renaming hidden-reef-76107 to my-wave-app-1234... done
https://my-wave-app-1234.herokuapp.com/ | https://git.heroku.com/my-wave-app-1234.git
 ▸    Don't forget to update git remotes for all other local checkouts of the app.
Git remote heroku updated
```

#### Tag the Docker Image

Get the `<app-name>` from the previous step.
You can also run `heroku apps` command to get the list of app names.
In this example, our Heroku app name is `my-wave-app-1234`.

Use the following command to give a new tag to our existing Docker image. Please replace `<app-name>` below.

```shell
$ docker tag wave-heroku:0.1.0 registry.heroku.com/<app-name>/web
```

#### Push the image to Heroku

Push our docker image to Heroku's registry.

```shell
$ docker push registry.heroku.com/<app-name>/web
```

#### Release the image to your app

Finally, tell Heroku to deploy your app and make it publicly available on the internet.

```shell
$ heroku container:release web
```

#### Open the app in your browser

Open your Wave app running on Heroku platform. The following command will automatically open the app in your default browser.

```shell
$ heroku open
```

To get the `Web URL` of the app, run

```shell
$ heroku apps:info

=== my-wave-app-1234
Auto Cert Mgmt: false
Dynos:          web: 1
Git URL:        https://git.heroku.com/my-wave-app-1234.git
Owner:          <your-email@mail.com>
Region:         us
Repo Size:      0 B
Slug Size:      0 B
Stack:          container
Web URL:        https://my-wave-app-1234.herokuapp.com/
```

## What is Next?

- Learn more about Wave from the [Docs][wave-docs]
- Learn more about deploying on Heroku at [Deploying with Docker][heroku-deploy-with-docker]
- Also, checkout the blog post about [deploying Wave apps on AWS Lightsail or EC2][wave-app-on-lightsail]

## Feedback

We are eager to hear your feature requests, bugfixes or just general feedback in our [discussions][wave-discussions] and [issues][wave-issues] sections.

[docker-get-started]: https://www.docker.com/get-started
[heroku-cli]: https://devcenter.heroku.com/articles/heroku-cli
[heroku-deploy-with-docker]: https://devcenter.heroku.com/categories/deploying-with-docker
[heroku-home]: https://www.heroku.com/home
[heroku-sign-up]: https://signup.heroku.com
[wave-app-docker-entrypoint]: https://github.com/srini-x/wave-heroku/blob/main/docker-entrypoint.sh
[wave-app-dockerfile]: https://github.com/srini-x/wave-heroku/blob/main/Dockerfile
[wave-app-dockerignore]: https://github.com/srini-x/wave-heroku/blob/main/.dockerignore
[wave-app-on-lightsail]: https://www.h2o.ai/blog/install-h2o-wave-on-aws-lightsail-or-ec2/
[wave-discussions]: https://github.com/h2oai/wave/discussions
[wave-docs]: https://wave.h2o.ai/docs/getting-started
[wave-examples]: https://wave.h2o.ai/docs/examples
[wave-heroku-repo]: https://github.com/srini-x/wave-heroku
[wave-issues]: https://github.com/h2oai/wave/issues
[wave-older-versions]: https://wave.h2o.ai/docs/installation-8-20
[wave]: https://wave.h2o.ai/
[what-is-heroku]: https://www.heroku.com/what

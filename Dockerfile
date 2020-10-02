FROM golang:1.13
ENV DEBIAN_FRONTEND=noninteractive

# This needs to be set up from Jenkins
# Docker needs to know user and group of a standard user to set it up for Jenkins
ARG uid
ARG gid

RUN apt-get -q -y update
RUN apt-get install -y python3 python3-pip python3-venv make wget xz-utils

WORKDIR /nodejs
RUN wget https://nodejs.org/dist/v14.4.0/node-v14.4.0-linux-x64.tar.xz
RUN tar xf node-v14.4.0-linux-x64.tar.xz
ENV PATH="/nodejs/node-v14.4.0-linux-x64/bin:${PATH}"

RUN echo 'PATH="/nodejs/node-v14.4.0-linux-x64/bin:${PATH}"' >> /etc/profile.d/nodejs.sh

# # Install chromium
RUN apt-get -y --no-install-recommends install \
    chromium

# Cypress deps
RUN apt-get -y --no-install-recommends install \
    xvfb \
    libgtk-3-dev \
    libnotify-dev \
    libgconf-2-4 \
    libnss3 \
    libxss1 \
    libasound2

# Install s3cmd (couldn't install it from apt-get)
RUN pip3 install s3cmd

# NodeJS required directory
RUN mkdir /.npm && \
    chown $uid:$gid /.npm

# Cypress required directory (...and some other packages later too)
# https://github.com/cypress-io/cypress/issues/819
RUN mkdir /.cache /.config && \
    chown $uid:$gid /.cache /.config

RUN echo ". /qd/py/venv/bin/activate" >> /etc/profile.d/venv.sh

USER ${uid}
COPY --chown=${uid} . /qd
WORKDIR /qd/test
RUN npm i

WORKDIR /qd
RUN make all

# docker run will have venv from qd build
ENTRYPOINT [ "/bin/bash" , "-l"]

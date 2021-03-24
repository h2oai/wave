FROM ubuntu:18.04

# Needed for python "click" lib.
ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
# Needed for playwright's Babel.
ENV NODE_ENV=test

RUN apt-get update -y
# Deps needed for visual testing.
RUN apt-get install -y python3-venv make libnss3 libnspr4\
  libatk1.0-0\
  libatk-bridge2.0-0\
  libcups2\
  libxcb1\
  libdrm2\
  libxkbcommon0\
  libx11-6\
  libxcomposite1\
  libxdamage1\
  libxext6\
  libxfixes3\
  libxrandr2\
  libgbm1\
  libgtk-3-0\
  libpango-1.0-0\
  libcairo2\
  libgdk-pixbuf2.0-0\
  libasound2\
  libatspi2.0-0\
  libbrotli1\
  libgl1\
  libegl1\
  libnotify4\
  libvpx5\
  libopus0\
  libxslt1.1\
  libwoff1\
  libharfbuzz-icu0\
  libgstreamer-plugins-base1.0-0\
  libgstreamer1.0-0\
  libgstreamer-gl1.0-0\
  libgstreamer-plugins-bad1.0-0\
  libopenjp2-7\
  libwebpdemux2\
  libwebp6\
  libenchant1c2a\
  libsecret-1-0\
  libhyphen0\
  libgles2\
  gstreamer1.0-libav\
  libx11-xcb1\
  libdbus-glib-1-2\
  libxt6\
  wget

# Install Go
RUN wget https://golang.org/dl/go1.13.10.linux-amd64.tar.gz
RUN tar -C /usr/local -xzf go1.13.10.linux-amd64.tar.gz
ENV PATH="${PATH}:/usr/local/go/bin"

# Install NodeJS
RUN wget -O - https://deb.nodesource.com/setup_13.x | bash
RUN apt-get install -y nodejs

WORKDIR /wave
COPY . /wave

RUN make setup generate build

CMD ./ui/test/visual_regression/start_visual_testing.sh 
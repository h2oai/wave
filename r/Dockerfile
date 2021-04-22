#base ubuntu:20.04
FROM ubuntu:20.04

#maintainer Ashrith
MAINTAINER "Ashrith Barthur" ashrith.barthur@h2o.ai 

#setting the timezone (to LA) so that r-base is not confused about tz and location
ENV TZ=America/Los_Angeles
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# fresh install, get the latest from repos
RUN apt-get update -qy

# install libraries of libcurl and xml - the notorious ones that can break many r package installations
# and do an update before installing, because ubuntu. 
RUN apt-get update -q && apt-get  -y install libcurl4-openssl-dev libxml2-dev

# get wget curl git and gebi-core, gdebi-core in case we get *.deb packages and need to get dependencies
RUN apt-get update -q && apt-get -y install wget curl git gdebi-core

# step 6! clone our library, note that this might be cached so run docker with --no-cache if you have done
# changes to repo
RUN git clone --branch rdriver --single-branch https://github.com/h2oai/wave

# install r-packages from ubuntu repo - easier, and faster
RUN apt-get update -q && apt-get install -y r-base-dev r-cran-openssl r-cran-xml2 r-cran-curl r-cran-httr

# mek me a package, please! 
# if this runs fine then the dependencies have been installed and package will be ready in wave directory in docker
RUN cd wave/r/ && make package
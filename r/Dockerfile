#base rdriver image
FROM r-base:latest

COPY ../ /wave

WORKDIR /wave

RUN apt-get update -q && apt-get -y install libcurl4-openssl-dev \
                                            libxml2-dev \
                                            wget \
                                            curl \
                                            git \
                                            gdebi-core \
                                            r-base-dev \
                                            r-cran-openssl \
                                            r-cran-xml2 \
                                            r-cran-curl \
                                            r-cran-httr \
                                            r-cran-httpuv

# mek me a package, please! 
# if this runs fine then the dependencies have been installed and package will be ready in wave directory in docker
RUN make build

#base rdriver image
FROM opsh2oai/rdriver:latest

# clone our library, note that this might be cached so run docker with --no-cache if you have done
# changes to repo
RUN git clone --depth 1 https://github.com/h2oai/wave

# step 6! clone our library, note that this might be cached so run docker with --no-cache if you have done
# changes to repo
RUN git clone --depth 1 https://github.com/h2oai/wave

# mek me a package, please! 
# if this runs fine then the dependencies have been installed and package will be ready in wave directory in docker
RUN cd wave/r/ && make package

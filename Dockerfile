FROM ubuntu:16.04
RUN apt-get update && apt-get install -y curl git

RUN curl -sL https://deb.nodesource.com/setup_6.x | bash
RUN apt-get update && apt-get install -y nodejs

ENV NODE_PATH /usr/lib/node_modules
RUN npm install -g express@4 morgan@1

FROM ubuntu:16.04

ENV Node.js 6.x
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash
RUN apt-get update && apt-get install -y nodejs

ENV Solidity 2016-23-07
RUN apt-get update && apt-get install -y software-properties-common
RUN add-apt-repository ppa:ethereum/ethereum
RUN add-apt-repository ppa:ethereum/ethereum-qt
RUN apt-get update && apt-get install -y cpp-ethereum

ENV NODE_PATH /usr/lib/node_modules
RUN npm install -g express@4
RUN npm install -g morgan@1

CMD stablecoin-ui

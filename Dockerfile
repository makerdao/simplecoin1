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

RUN apt-get update && apt-get install -y python3
WORKDIR /usr/local
ENV PORT 8888
CMD echo http://localhost:$PORT && python3 -m http.server $PORT
COPY . /usr/local

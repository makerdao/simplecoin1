FROM node:6.9.5-alpine
RUN apk add --no-cache bash git
RUN git clone https://github.com/makerdao/simplecoin.git --recursive /root/simplecoin
WORKDIR /root/simplecoin
RUN npm install -g pushstate-server
CMD [ "pushstate-server", ".", "3001"]
export ETH_ENV ?= morden
export ETH_RPC_URL ?= http://localhost:8545
export PORT ?= 3000

name = simple-stablecoin
repo = makerdao

all: image test
test:; dapple test --report

js:; dapple build -e $(ETH_ENV)
deploy:; dapple run deploy/$(ETH_ENV).ds

run: kill image; $(run) --name=$(name) $(image) stablecoin-ui
kill:; docker kill $(name)

run = docker run --rm -it --net=host \
  -e PORT -e ETH_RPC_URL \
  -w /usr/local -v $(shell pwd):/usr/local:ro

image = $(repo)/$(name)
image:; docker build -t $(image) .

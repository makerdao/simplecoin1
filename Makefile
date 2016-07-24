export ETH_RPC_URL ?= http://localhost:8545
export PORT ?= 3000

name = simple-stablecoin
repo = makerdao

all: image test
test:; dapple test --report

run: kill image; $(run) --name=$(name) $(image) stablecoin-ui
kill:; docker kill $(name)

run = docker run --rm -it --net=host \
  -e PORT -e ETH_RPC_URL \
  -w /usr/local -v $(shell pwd):/usr/local:ro

image = $(repo)/$(name)
image:; docker build -t $(image) .

deploy: test
	dapple run deploy/$(ETH_ENV).ds
	dapple build -e $(ETH_ENV)
	@echo OK

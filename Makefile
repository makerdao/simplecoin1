cmd ?= stablecoin-ui
env ?= morden

name = simple-stablecoin
repo = makerdao

default: test run
test:; dapple test --report

.PHONY: build deploy
build:; dapple build -e $(env)
deploy:; dapple run deploy/$(env).ds -e $(env)

run: kill image; $(run) --name=$(cmd) $(image) $(cmd)
kill:; docker kill $(cmd) || true
console: image; $(run) -it $(image) bash
run = docker run --rm --net=host -e PORT \
  -w /usr/local -v $(shell pwd):/usr/local:ro

image = $(repo)/$(name)
image:; docker build -t $(image) .

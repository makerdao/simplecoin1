cmd ?= stablecoin-ui
env ?= morden

name = simple-stablecoin
repo = makerdao

all: image test
test:; dapple test --report

deploy:; dapple run deploy/$(env).ds -e $(env)
js:; dapple build -e $(env)

ui: kill image; $(run) --name=$(cmd) $(image) $(cmd)
kill:; docker kill $(cmd) || true

console: image; $(run) $(image) bash

run = docker run --rm -it --net=host -e PORT \
  -w /usr/local -v $(shell pwd):/usr/local:ro

image = $(repo)/$(name)
image:; docker build -t $(image) .

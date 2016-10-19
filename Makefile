env ?= morden

default: test

test:; dapple test --report
run:; python -m SimpleHTTPServer

deploy:; dapple run deploy/$(env).ds -e $(env)
build:; dapple build -e $(env)

.PHONY: deploy build

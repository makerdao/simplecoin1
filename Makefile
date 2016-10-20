env ?= morden
prefix ?= /usr/local
SHELL = bash

test:; dapple test --report
run:; python -m SimpleHTTPServer
deploy:; dapple run deploy/$(env).ds -e $(env)
build:; dapple build -e $(env)
.PHONY: deploy build

dirs = {bin,libexec}
dirs:; mkdir -p $(prefix)/$(dirs)
files = $(shell ls -d $(dirs)/*)
install:; cp -r -n $(dirs) $(prefix)
link: dirs; for x in $(files); do ln -s `pwd`/$$x $(prefix)/$$x; done
uninstall:; rm -rf $(addprefix $(prefix)/,$(files))

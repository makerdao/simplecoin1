name = stablecoin-ui
repo = makerdao

all: image run

image = $(repo)/$(name)
image:; docker build -t $(image) .

run = docker run --rm -it --net=host \
-w /usr/local -v $(shell pwd):/usr/local:ro
run:; $(run) --name=$(name) $(image)
console:; $(run) $(image) bash

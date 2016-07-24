all: image run

name = stablecoin-ui
repo = makerdao

$(shell touch .env.local)
run = docker run --rm -it --net=host \
  --env-file=.env --env-file=.env.local \
  -w /usr/local -v $(shell pwd):/usr/local:ro

image = $(repo)/$(name)
image:; docker build -t $(image) .
run:; $(run) --name=$(name) $(image)
console:; $(run) $(image) bash

name = stablecoin-ui
repo = makerdao

image = $(repo)/$(name)
image:; docker build -t $(image) .

volumes = -v $(shell pwd):/usr/local:ro

run = docker run --rm -it --net=host $(volumes)
run:; $(run) --name=$(name) $(image)

console:; $(run) $(image) bash

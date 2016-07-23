name = stablecoin-ui
repo = makerdao

image = $(repo)/$(name)
image:; docker build -t $(image) .

run = docker run --rm -it --net=host
run:; $(run) --name=$(name) $(image)

console:; $(run) $(image) bash

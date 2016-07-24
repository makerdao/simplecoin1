cmd = stablecoin-ui
name = simple-stablecoin
repo = makerdao

all: image

run: image; $(run) --name=$(name) $(image) $(cmd)
kill:; docker kill $(name)
console: image; $(run) $(image)

run = touch .env.local \
&& docker run --env-file=.env --env-file=.env.local \
  -w /usr/local -v $(shell pwd):/usr/local:ro \
  --rm -it --net=host

image = $(repo)/$(name)
image:; docker build -t $(image) .

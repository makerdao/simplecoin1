let chain = {}, state = {}, views = {}
let redraw = $ => async.each(all("[data-view]"), redraw1, $)
let redraw1 = (x, $) => render(tag(views[x.dataset.view], state), x, $)
let reload = $ => parallel(fetch, hopefully(x => update(x, $)))
let save = (x, $) => (assign(storage, convert(x, json)), update(x, $))
let update = (x, $) => (assign(state, x), redraw($))

let web3 = new Web3(this.web3 ? this.web3.currentProvider : (
  new Web3.providers.HttpProvider("http://localhost:8545")
))

for (let phase of uniq(map(all("[data-when]"), x => x.dataset.when))) {
  style(`[data-phase=${phase}] [data-when=${phase}] { display: block; }`)
}

define(state, {
  phase: {
    get: () => body.dataset.phase,
    set: x => body.dataset.phase = x,
  },
  quiet: {
    get: () => body.classList.contains("quiet"),
    set: x => body.classList.toggle("quiet", x),
  },
})

assign(state, convert(storage, unjson))
web3.version.getNetwork(timeout(300, () => {
  state.phase = "loading"
}, hopefully(network => {
  chain.env = [, "live", "morden"][network]
  assign(chain, get_dapple_env(chain.env))
  reload(() => update({ phase: "loaded" }))
})))

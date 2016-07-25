let state = {}, change = (x, $) => render(Object.assign(state, x), $)
let render = (props=state, $) => async.each(view_nodes, renderer(props), $)
let renderer = props => (x, $) => ReactDOM.render(view_tag(x, props), x, $)
let views = {}, view_nodes = document.querySelectorAll("[data-view]")
let view_tag = (node, props) => tag(views[node.dataset.view], props)
let tag = (name, props, xs=[]) => React.createElement(name, props, ...xs)

let chain = {}, infer_chain_environment = x => [, "live", "morden"][x]
let get_package = name => new dapple[name].class(web3, chain.environment)
let use_package = pkg => Object.assign(chain, pkg.classes, pkg.objects)
let web3 = new Web3(this.web3 ? this.web3.currentProvider : geth())
let geth = () => new Web3.providers.HttpProvider("http://localhost:8545")

let hopefully = $ => (error, result) => error ? fail(error) : $(result)
let fail = msg => { throw msg instanceof Error ? msg : new Error(msg) }

web3.version.getNetwork(hopefully(network_version => {
  chain.environment = infer_chain_environment(network_version)
  import_chain_artifacts(), reload_application_state(() => {
    document.body.className = "loaded"
  })
}))

function import_chain_artifacts() {
  Object.keys(dapple).map(get_package).forEach(use_package)
}

function reload_application_state($) {
  async.parallel(Object.keys(fetch).reduce(function(requests, name) {
    return Object.assign(requests, { [name]: fetch[name] })
  }, {}), hopefully(values => change(values, $)))
}

function get_contract_props(type, address, $) {
  let contract = type.at(address)
  let is_property = x => x.constant && x.inputs.length == 0
  let properties = contract.abi.filter(is_property)
  let extra_props = { address: async.constant(address) }
  async.parallel(properties.reduce(function(requests, { name }) {
    return Object.assign(requests, { [name]: contract[name] })
  }, extra_props), $)
}

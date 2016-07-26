let sequentially = async.waterfall, begin = sequentially
let simultaneously = async.parallel, incrementally = async.times
let always = async.constant, bind = async.apply, keys = Object.keys
let hopefully = $ => (error, result) => error ? fail(error) : $(result)
let fail = msg => { throw msg instanceof Error ? msg : new Error(msg) }

let both = Object.assign, assign = both, fold = (xs, z, f) => xs.reduce(f, z)
let pick = (s, k) => kv(k, s[k]), kv = (k, v) => ({ [k]: v })
let map = (s, f) => fold(keys(s), {}, (t, k) => both(t, kv(k, f(s[k]))))
let select = (s, ks) => fold(ks, {}, (t, k) => both(t, pick(s, k)))

let state = {}, save = (changes, $) => render(assign(state, changes), $)
let render = (props=state, $) => async.each(view_nodes(), renderer(props), $)
let renderer = props => (x, $) => ReactDOM.render(view_tag(x, props), x, $)
let view_tag = (node, props) => tag(views[node.dataset.view], props)
let views = {}, view_nodes = () => document.querySelectorAll("[data-view]")
let tag = (name, props, xs=[]) => React.createElement(name, props, ...xs)

let chain = {}, infer_chain_environment = x => [, "live", "morden"][x]
let get_package = name => new dapple[name].class(web3, chain.environment)
let use_package = pkg => assign(chain, pkg.classes, pkg.objects)
let web3 = new Web3(this.web3 ? this.web3.currentProvider : geth())
let geth = () => new Web3.providers.HttpProvider("http://localhost:8545")

let code = x => tag("code", {}, [x])
let small = x => tag("small", {}, [x])
let ascii = x => web3.toAscii(x)

let persist = changes => {
  assign(localStorage, map(changes, x => JSON.stringify(x)))
  save(changes)
}

assign(state, map(localStorage, x => {
  try { return JSON.parse(x) } catch (e) { return null }
}))

web3.version.getNetwork(hopefully(network => {
  chain.environment = infer_chain_environment(network)
  keys(dapple).map(get_package).forEach(use_package)
  fetch_application_state(() => reveal_user_interface())
}))

function fetch_application_state($) {
  simultaneously(fetch, hopefully(state => save(state, $)))
}

function reveal_user_interface() {
  document.body.className = "loaded"
}

function extract_contract_props(type, address, $) {
  let contract = type.at(address)
  let is_property = abi => abi.constant && !abi.inputs.length
  let names = contract.abi.filter(is_property).map(abi => abi.name)
  let fetch_props = select(contract, names)
  let add_extra_props = map({ address }, always)
  simultaneously(both(fetch_props, add_extra_props), $)
}

function table_list(entries, fields) {
  return tag("table", {}, entries.map((entry, i) => {
    return tag("tbody", { key: i }, keys(fields).map((label, i) => {
      return tag("tr", { key: i }, [
        tag("th", {}, [label]),
        tag("td", {}, [fields[label](entry)]),
      ])
    }))
  }))
}

let hide_message = () => persist({ hide_message: true })
// views.message = () => state.hide_message ? tag("div", {}, [
//   tag("a", {
//     href: "#", onClick: () => persist({ hide_message: false })
//   }, ["Show introductory message"])
// ]) : tag("div", {
//   dangerouslySetInnerHTML: {
//     __html: document.querySelector("[rel=import]").import
//       .querySelector("#message").innerHTML
//   },
// })

let subdoc = document.querySelector("[rel=import]").import

onload = () => {
  document.registerElement("stablecoin-header", {
    prototype: Object.create(HTMLElement.prototype, {
      createdCallback: {
        value: function() {
          this.appendChild(document.importNode(
            subdoc.querySelector("header"), true
          ))
        }
      }
    })
  })
}

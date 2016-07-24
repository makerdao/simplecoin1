console.warn("Note: A recent Chrome may be needed to run this app")

var web3 = new Web3
var feedbase, factory
var state = { loading: true, rules: "Only professionals" }

function update(changes) {
  render(state = React.addons.update(state, changes))
}

function render(state) {
  forEach(document.querySelectorAll("[data-view]"), app => {
    var name = app.dataset.view
    if (!(name in window)) throw new Error(`No such view: ${name}`)
    var View = window[name]
    ReactDOM.render(React.createElement(View, state), app)
  })
}

onload = () => fetch("/env").then(response => {
  response.json().then(json => { env = json; load() })
})

var Stablecoins = state => React.DOM.div(null,
  state.coins ? `${state.coins}` : React.DOM.small(null, `(none)`)
)

function load() {
  web3.setProvider(new Web3.providers.HttpProvider(env.ETH_RPC_URL))
  feedbase = find_object("feedbase")
  factory = find_object("factory", "simple-stablecoin")
  reload()
}

function reload() {
  if (state.refresh) setTimeout(refresh, state.refresh)
  if (state.paused) return
  if (!factory) return

  state.coins = Number(factory.count())

  delete state.loading
  console.log("Application reloaded.")
  render(state)
  document.body.style.visibility = "visible"
}

function find_object(name, module, object) {
  module = module || name
  object = object || name

  if (!(module in dapple)) {
    throw new Error(`Not found: dapple["${module}"]`)
  }

  var environment = dapple[module].environments[env.APP_ENV]
  var instance = new dapple[module].class(web3, env.APP_ENV)

  state[name] = environment.objects[object].address

  return instance.objects[object]
}

function create() {
  factory.newSimpleStablecoin(
    feedbase.address, web3.toHex(rules.value), {
      from: web3.eth.coinbase
    }, (error, tx) => {
      if (error){
        alert(error)
      } else {
        console.log(`Transaction created: ${tx}`)
        alert(`Transaction created: ${tx}`)
      }
    }
  )
}

var RulesTextarea = state => React.DOM.div(null,
  React.DOM.textarea({
    id: "rules",
    maxLength: 32,
    value: state.rules,
    onChange: event => update({ rules: { $set: event.target.value } })
  })
)

function forEach(array, thunk) {
  return [].forEach.call(array, thunk)
}

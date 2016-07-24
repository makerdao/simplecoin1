console.warn("Note: A recent Chrome may be needed to run this app")

function poke() { load(); render(); loop() }
function loop() { if (app.loop) setTimeout(poke, app.loop) }

onload = () => fetch("/env").then(response => {
  response.json().then(json => { app.env = json; poke() })
})

var app = {
  loading: true,
  loop: false,
  rules: "Only professionals",
}

var web3 = new Web3
var feedbase
var stablecoin_factory

function load() {
  delete app.loading
  web3.setProvider(new Web3.providers.HttpProvider(app.env.ETH_RPC_URL))

  feedbase           = find_dapple_object("feedbase")
  stablecoin_factory = find_dapple_object("factory", "simple-stablecoin")

  app.coin_count = Number(stablecoin_factory.count())
}

var Coins = app => React.DOM.div(null,
  app.coins ? `${app.coins}` : React.DOM.small(null, `(none)`)
)

function create_stablecoin() {
  stablecoin_factory.newSimpleStablecoin(
    feedbase.address, web3.toHex(rules.value), {
      from: web3.eth.coinbase
    }, (error, tx) => {
      if (error) {
        alert(error)
      } else {
        console.log(`Transaction created: ${tx}`)
        alert(`Transaction created: ${tx}`)
      }
    }
  )
}

var Rules = app => React.DOM.div(null,
  React.DOM.textarea({
    id: "rules",
    maxLength: 32,
    value: app.rules,
    onChange: event => update({ rules: { $set: event.target.value } })
  })
)

function render() {
  document.body.style.visibility = "visible"
  forEach(document.querySelectorAll("[data-render]"), element => {
    var name = element.dataset.render
    if (!(name in window)) throw new Error(`No such element: ${name}`)
    ReactDOM.render(React.createElement(window[name], app), element)
  })
}

function find_dapple_object(name, module, object) {
  module = module || name
  object = object || name

  if (!(module in dapple)) {
    throw new Error(`Not found: dapple["${module}"]`)
  }

  var environment = dapple[module].environments[app.env.APP_ENV]
  var instance = new dapple[module].class(web3, app.env.APP_ENV)

  app.env[name] = environment.objects[object].address

  return instance.objects[object]
}

function update(changes) {
  app = React.addons.update(app, changes)
  render()
}

function forEach(array, thunk) {
  return [].forEach.call(array, thunk)
}

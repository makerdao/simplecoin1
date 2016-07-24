console.warn("Note: A recent Chrome may be needed to run this app")

var web3

if (web3) {
  setup(web3.currentProvider)
} else {
  onload = () => fetch("/env").then(response => {
    response.json().then(env => {
      setup(new Web3.providers.HttpProvider(env.ETH_RPC_URL))
    })
  })
}

function setup(provider) {
  web3 = new Web3(provider)
  web3.version.getNetwork((error, result) => {
    if (error) {
      throw error
    } else if (result == "1") {
      app.env = "live"
    } else if (result == "2") {
      app.env = "morden"
    } else {
      alert(`Unknown network: ${JSON.stringify(result)}`)
    }

    load()
  })
}

//----------------------------------------------------------

var feedbase
var factory

var app = {
  loading: true,
  rules: "Only professionals",
}

function load() {
  feedbase = dapple_instance("feedbase")
  factory  = dapple_instance("simple-stablecoin", "factory")

  factory.count((error, result) => {
    app.count = Number(result)
    
    delete app.loading
    render()
    if (app.reload) setTimeout(load, app.reload)
  })
}

var Coins = app => React.DOM.div(null,
  app.coins ? `${app.count}` : React.DOM.small(null, `(none)`)
)

var Rules = app => React.DOM.div(null,
  React.DOM.textarea({
    id: "rules",
    maxLength: 32,
    value: app.rules,
    onChange: event => update({ rules: { $set: event.target.value } })
  })
)

function create_stablecoin() {
  factory.newSimpleStablecoin(
    feedbase.address, web3.toHex(app.rules), {
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

//----------------------------------------------------------

function render() {
  document.body.style.visibility = "visible"
  forEach(document.querySelectorAll("[data-render]"), element => {
    var name = element.dataset.render
    if (!(name in window)) throw new Error(`No such element: ${name}`)
    ReactDOM.render(React.createElement(window[name], app), element)
  })
}

function dapple_address(module, object) {
  object = object || module
  return dapple[module].environments[app.env].objects[object].address
}

function dapple_instance(module, object) {
  object = object || module
  return new dapple[module].class(web3, app.env).objects[object]
}

function update(changes) {
  app = React.addons.update(app, changes)
  render()
}

function forEach(array, thunk) {
  return [].forEach.call(array, thunk)
}

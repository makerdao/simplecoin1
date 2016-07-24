var web3, feedbase, factory

console.warn("Note: This app is only tested in the latest Chrome")

onload = render
var app = { coins: [], rules: "" }

if (web3) {
  console.log("Using injected web3 provider.")
  setup(web3.currentProvider)
} else {
  fetch("/ETH_RPC_URL").then(response => {
    if (response.ok) {
      response.text().then(url => {
        console.log(`Found local web3 provider: ${url}`)
        setup(new Web3.providers.HttpProvider(url))
      })
    } else {
      console.error("No web3 provider found.")
      document.body.classList.add("failed")
    }
  })
}

function load() {
  feedbase = dapple_instance("feedbase")
  factory  = dapple_instance("simple-stablecoin", "factory")

  factory.count((error, result) => {
    document.body.classList.add("loaded")

    var count = Number(result) || 0

    for (var i = 0; i < count; i++) {
      load_coin(i)
    }

    if (app.reload) {
      setTimeout(load, app.reload)
    }
  })
}

function load_coin(i) {
  factory.stablecoins(i, (error, result) => {
    if (error) {
      throw error
    } else {
      var patch ={ coins: {} }
      patch.coins[i] = { $set: result }
      update(patch)
    }
  })
}

var Coins = app => React.DOM.div(null,
  app.coins.length
    ? app.coins.map(coin => React.DOM.pre({ key: coin }, coin))
    : React.DOM.small(null, `(none)`)
)

var Rules = app => React.DOM.div(null,
  React.DOM.textarea({
    id: "rules",
    maxLength: 32,
    value: app.rules,
    disabled: app.loading,
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
      throw new Error(`Unknown network: ${JSON.stringify(result)}`)
    }
    
    load()
  })
}

function render() {
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

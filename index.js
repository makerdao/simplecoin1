var web3, feedbase, factory

console.warn("Note: This app is only tested in the latest Chrome")

onload = render

var app = {
  coins: [],
  rules: [],
  owners: [],
  new_rules: "",
  reload: 5000,
}

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
      document.body.className = "failed"
    }
  })
}

function load() {
  feedbase = dapple_instance("feedbase", "feedbase")
  factory  = dapple_instance("simple-stablecoin", "factory")

  factory.count((error, result) => {
    document.body.className = "loaded"

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
  factory.stablecoins(i, (error, address) => {
    if (error) {
      throw error
    } else {
      var patch ={ coins: {} }
      patch.coins[i] = { $set: address }
      update(patch)

      var SimpleStablecoin = dapple_class(
        "simple-stablecoin", "SimpleStablecoin"
      )

      var coin = SimpleStablecoin.at(address)

      coin.rules((error, rules) => {
        var patch ={ rules: {} }
        patch.rules[i] = { $set: web3.toAscii(rules) }
        update(patch)
      })

      coin.owner((error, owner) => {
        var patch ={ owners: {} }
        patch.owners[i] = { $set: owner }
        update(patch)
      })
    }
  })
}

var Coins = app => {
  if (app.coins.length) {
    return React.DOM.div({}, React.DOM.table(
      { style: { marginTop: "1rem" }, },
      app.coins.map((address, i) => React.DOM.tbody({ key: i },
        React.DOM.tr({},
          React.DOM.th({}, "Address"),
          React.DOM.td({}, React.DOM.code({}, address))
        ),
        React.DOM.tr({},
          React.DOM.th({}, "Owner"),
          React.DOM.td({}, React.DOM.code({}, `${app.owners[i]}`))
        ),
        React.DOM.tr({},
          React.DOM.th({}, "Rules"),
          React.DOM.td({}, `${app.rules[i]}`)
        ),
        React.DOM.tr({ style: { height: "1rem" } })
      ))
    ))
  } else {
    React.DOM.div({}, React.DOM.small({}, `(none)`))
  }
}

var Rules = app => React.DOM.div({},
  React.DOM.textarea({
    id: "rules",
    maxLength: 32,
    value: app.new_rules,
    disabled: app.loading,
    onChange: event => update({ new_rules: { $set: event.target.value } })
  })
)

function create_stablecoin() {
  factory.newSimpleStablecoin(
    feedbase.address, web3.toHex(app.new_rules), {
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
  document.body.className = "loading"
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
  return dapple[module].environments[app.env].objects[object].address
}

function dapple_class(module, name) {
  return new dapple[module].class(web3, app.env).classes[name]
}

function dapple_instance(module, name) {
  return new dapple[module].class(web3, app.env).objects[name]
}

function update(changes) {
  app = React.addons.update(app, changes)
  render()
}

function forEach(array, thunk) {
  return [].forEach.call(array, thunk)
}

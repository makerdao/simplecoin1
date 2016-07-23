var env = {}
var web3 = new Web3

var Feedbase = dapple.feedbase.class
var feedbase

function update() {
  web3.setProvider(new Web3.providers.HttpProvider(env.ETH_RPC_URL))
  feedbase = new Feedbase(web3, env.ETH_ENV).objects.feedbase
  console.log(web3.eth.coinbase)
}

onload = () => {
  requestAnimationFrame(onload)
  ReactDOM.render(React.createElement(Stablecoin), app)
}

fetch("/env").then(response => {
  response.json().then(json => {
    env = json
    update()
  })
})

var stablecoin = null
var Stablecoin = React.createClass({
  render: () => {
    return React.DOM.div(null, `
      ${JSON.stringify(stablecoin)}
    `)
  }
})

var app = {}

onload = () => {
  requestAnimationFrame(onload)
  ReactDOM.render(React.createElement(App), document.querySelector("#app"))
}

fetch("/env").then(response => {
  response.json().then(env => {
    var web3 = new Web3
    web3.setProvider(new Web3.providers.HttpProvider(env.ETH_RPC_URL))

    app.env = env
    app.feedbase = object("feedbase")

    update()

    function object(name, object_name) {
      return new dapple[name].class(web3, env.ETH_ENV)
        .objects[object_name || name]
    }
  })
})

function update() {
}

var App = React.createClass({
  render: () => {
    return React.DOM.pre(null, JSON.stringify(app.env, null, 2))
  }
})

onload = () => {
  requestAnimationFrame(onload)
  ReactDOM.render(React.createElement(SimpleStablecoin), app)
}

var x = 0
setInterval(() => x++)

var SimpleStablecoin = React.createClass({
  render: function() {
    return React.DOM.div({
    }, "hello" + x)
  }
})

ReactDOM.render(React.createElement(React.createClass({
  render: function() {
    return React.DOM.div({
      style: { color: "green" },
    }, this.props.hello)
  }
}), {
  hello: "hello world"
}), app)

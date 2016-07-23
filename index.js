ReactDOM.render(React.createElement(React.createClass({
  render: function() {
    return React.DOM.div({
    }, this.props.hello)
  }
}), {
  hello: "hello world"
}), app)

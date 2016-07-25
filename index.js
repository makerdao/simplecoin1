state.stablecoins = []
fetch.stablecoins = $ => async.waterfall([
  chain.factory.count, (n, $) => async.times(n, (i, $) => async.waterfall([
    async.apply(chain.factory.stablecoins, i),
    async.apply(get_contract_props, chain.SimpleStablecoin),
  ], $), $),
], $)

views.stablecoins = ({ stablecoins }) => {
  if (!stablecoins.length) {
    return tag("div", {}, [tag("small", {}, ["(none)"])])
  } else {
    return tag("div", null, [tag("table", {
      style: { marginTop: "1rem" }
    }, stablecoins.map((x, i) => tag("tbody", { key: i }, [
      row("Address", tag("code", {}, [`${x.address}`])),
      row("Owner", tag("code", {}, [`${x.owner}`])),
      row("Rules", `${web3.toAscii(x.rules)}`),
      tag("tr", { style: { height: "1rem" } }),
    ])))])

    function row(label, content) {
      return tag("tr", {}, [
        tag("th", {}, [label]),
        tag("td", {}, [content]),
      ])
    }
  }
}

views.textarea = ({ rules }) => tag("textarea", {
  onChange: event => change({ rules: event.target.value }),
  value: rules, maxLength: 32,
})

function create_stablecoin() {
  chain.factory.newSimpleStablecoin(
    feedbase.address, web3.toHex(state.rules), {
      from: web3.eth.coinbase
    }, (error, tx) => {
      alert(error || `Transaction created: ${tx}`)
    }
  )
}

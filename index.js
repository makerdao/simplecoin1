state.stablecoins = []
fetch.stablecoins = $ => begin([
  chain.factory.count, (n, $) => incrementally(n, (i, $) => begin([
    bind(chain.factory.stablecoins, i),
    bind(extract_contract_props, chain.SimpleStablecoin),
  ], $), $),
], $)

views.stablecoins = ({ stablecoins }) => {
  return !stablecoins.length ? small("(none)") : table_list(stablecoins, {
    Contract: x => code(x.address),
    Owner: x => code(x.owner),
    Rules: x => ascii(x.rules),
  })
}

views.textarea = ({ rules }) => tag("textarea", {
  onChange: event => save({ rules: event.target.value }),
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

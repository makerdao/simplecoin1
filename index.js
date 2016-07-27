let hide_explanation = () => save({ quiet: true })
let show_explanation = () => save({ quiet: false })

views.textarea = ({ rules }) => textarea({
  value: rules, maxLength: 32,
  onChange: event => update({ rules: event.target.value }),
})

function create_stablecoin() {
  chain.factory.newSimpleStablecoin(
    chain.feedbase.address, hex(state.rules),
    { from: web3.eth.coinbase },
    (error, tx) => alert(error || `Transaction created: ${tx}`)
  )
}

fetch.stablecoins = $ => begin([
  chain.factory.count, (n, $) => times(n, (i, $) => begin([
    bind(chain.factory.stablecoins, i),
    bind(extract_contract_props, chain.SimpleStablecoin),
  ], $), $),
], $)

views.stablecoins = ({ stablecoins=[] }) => {
  return stablecoins.length ? table_list(stablecoins, {
    "Contract": x => code({}, [x.address]),
    "Owner":    x => code({}, [x.owner]),
    "Rules":    x => ascii(x.rules),
  }) : small({}, ["(none)"])
}

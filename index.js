let hide_explanation = () => save({ quiet: true })
let show_explanation = () => save({ quiet: false })

views.textarea = ({ rules }) => textarea({
  value: rules, maxLength: 32,
  onChange: event => update({ rules: event.target.value }),
})

function create_stablecoin() {
  send(chain.factory.newSimpleStablecoin, [
    chain.feedbase.address, hex(state.rules),
  ], hopefully(tx => alert(`Transaction created: ${tx}`)))
}

let stablecoin = x => chain.SimpleStablecoin.at(x)

function register_collateral_type(address, params) {
  let { token, vault, feed, spread } = params
  send(stablecoin(address).registerCollateralType, [
    token, vault, feed, spread
  ], hopefully(tx => alert(`Transaction created: ${tx}`)))
}

fetch.stablecoins = $ => begin([
  chain.factory.count, (n, $) => times(n, (i, $) => begin([
    bind(chain.factory.stablecoins, i),
    bind(extract_contract_props, chain.SimpleStablecoin),
    (x, $) => times(Number(x.type_count), (i, $) => parallel(fold(words(`
      token feed vault spread current_debt max_debt
    `), { id: always(i) }, (result, name) => assign(result, {
      [name]: bind(stablecoin(x.address)[name], i)
    })), $), hopefully(types => $(null, assign(x, { types }))))
  ], $), $),
], $)

let owner    = x => x == coinbase() ? "You" : code({}, [x])
let feedbase = x => x == chain.feedbase.address ? "Standard" : code({}, [x])

views.stablecoins = ({ stablecoins=[] }) => {
  return table_list(stablecoins, {
    "Address":          x => strong({}, [code({}, [x.address])]),
    "Owner":            x => owner(x.owner),
    "Feedbase":         x => feedbase(x.feedbase),
    "Rules":            x => ascii(x.rules),
    "Total supply":     x => Number(x.totalSupply),
    "Collateral types": x => Number(x.type_count) && [
      Number(x.type_count), table_list(x.types, {
        "ID":               x => Number(x.id),
        "Token":            x => code({}, [x.token]),
        "Feed":             x => Number(x.feed),
        "Vault":            x => code({}, [x.vault]),
        "Spread":           x => Number(x.spread),
        "Current debt":     x => Number(x.current_debt),
        "Max debt":         x => Number(x.max_debt),
      })
    ]
  })
}

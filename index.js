/// index.js -- UI components, application-specific logic

init()
setInterval(reload, 3000)

let Stablecoin = x => chain.SimpleStablecoin.at(x)
let feedbase = x => x == chain.feedbase.address ? "Standard" : code({}, [x])
let own = x => x.owner == coinbase()

fetch.stablecoins = $ => begin([
  chain.factory.count, (n, $) => times(n, (i, $) => begin([
    bind(chain.factory.stablecoins, i),
    bind(extract_contract_props, chain.SimpleStablecoin),
    (x, $) => times(Number(x.type_count), (i, $) => parallel(fold(words(`
      token feed vault spread current_debt max_debt
    `), { id: always(i) }, (result, name) => assign(result, {
      [name]: bind(Stablecoin(x.address)[name], i)
    })), $), hopefully(types => $(null, assign(x, { types }))))
  ], $), $),
], $)

function extract_contract_props(type, address, $) {
  let contract = type.at(address)
  let is_property = abi => abi.constant && !abi.inputs.length
  let names = contract.abi.filter(is_property).map(abi => abi.name)
  parallel(assign(select(contract, names), convert({ address }, always)), $)
}

let owner_view = ({ address, owner }) => div({}, [
  owner == coinbase() ? "You" : code({}, [owner]),
  span({ style: { float: "right" } }, [owner == coinbase() && a({
    onClick: () => change_owner(address),
  }, ["Transfer"])])
])

let type_id_view = ({ address }, { id, token }) => div({}, [
  Number(id), span({ style: { float: "right" } }, [Number(token) ? a({
    onClick: () => cancel_collateral_type(address, id),
  }, ["Cancel collateral type"]) : small({}, ["(canceled)"])])
])

let feed_view = ({ address }, { id, token, feed }) => div({}, [
  Number(feed), Number(token) && a({
    style: { float: "right" },
    onClick: () => change_price_feed(address, id),
  }, ["Change feed"])
])

let max_debt_view = ({ address }, { id, token, max_debt }) => div({}, [
  Number(max_debt), Number(token) && a({
    style: { float: "right" },
    onClick: () => change_max_debt(address, id),
  }, ["Change max debt"])
])

views.stablecoins = ({ stablecoins=[] }) => {
  return table_list(stablecoins, {
    "Stablecoin":       x => strong({}, [code({}, [x.address])]),
    "Owner":            x => owner_view(x),
    "Feedbase":         x => feedbase(x.feedbase),
    "Rules":            x => ascii(x.rules),
    "Total supply":     x => Number(x.totalSupply),
    "Collateral types": x => [
      Number(x.type_count), table_list(x.types, {
        "Collateral type":  y => type_id_view(x, y),
        "Token":            y => code({}, [y.token]),
        "Vault":            y => code({}, [y.vault]),
        "Price feed":       y => feed_view(x, y),
        "Max debt":         y => max_debt_view(x, y),
        "Spread":           y => Number(y.spread),
        "Current debt":     y => Number(y.current_debt),
      }), own(x) && form({
        onSubmit: event => {
          event.preventDefault()
          if (confirm(`Register new collateral type?`)) {
            register_collateral_type(x.address)
          }
        }
      }, [
        h4({}, "Register collateral type"),
        label({}, ["Token address", input({
          value: state[`new_token_${x.address}`],
          onChange: event => update({
            [`new_token_${x.address}`]: event.target.value,
          }),
        })]),
        label({}, ["Vault address", input({
          value: state[`new_vault_${x.address}`],
          onChange: event => update({
            [`new_vault_${x.address}`]: event.target.value,
          }),
        })]),
        label({}, ["Price feed", input({
          value: state[`new_feed_${x.address}`],
          onChange: event => update({
            [`new_feed_${x.address}`]: event.target.value,
          }),
        })]),
        label({}, ["Spread", input({
          value: state[`new_spread_${x.address}`],
          onChange: event => update({
            [`new_spread_${x.address}`]: event.target.value,
          }),
        })]),
        div({ style: { textAlign: "right" } }, [
          button({}, ["Register collateral type"])
        ]),
      ])
    ]
  })
}

function table_list(xs, fields) {
  return table({}, xs.map((x, i) => {
    return tbody({ key: i }, concat(keys(fields).map((name, i) => {
      let values = (x => x instanceof Array ? x : [x])(fields[name](x))
      return [
        tr({ key: i }, [th({}, [name]), td({}, [values[0]])]),
        ...(values.length > 1 ? [
          tr({ key: `${i}+` }, [td({ colSpan: 2 }, values.slice(1))])
        ] : [])
      ]
    })))
  }))
}

//----------------------------------------------------------
// Forms and actions
//----------------------------------------------------------

views.textarea = ({ rules }) => textarea({
  value: rules, maxLength: 32,
  onChange: event => update({ rules: event.target.value }),
})

function create_stablecoin() {
  send(chain.factory.newSimpleStablecoin, [
    chain.feedbase.address, hex(state.rules),
  ], hopefully(tx => alert(`Transaction created: ${tx}`)))
}

function change_owner(address) {
  let new_value = prompt(`New owner for stablecoin ${address}:`)
  if (new_value) {
    send(Stablecoin(address).updateOwner, [new_value], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

function cancel_collateral_type(address, id) {
  if (confirm(`Cancel collateral type ${id} of stablecoin ${address}?`)) {
    send(Stablecoin(address).cancelCollateralType, [id], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

function change_price_feed(address, id) {
  let new_value = prompt(`New price feed for collateral type ${id}:`)
  if (Number(new_value)) {
    send(Stablecoin(address).setFeed, [id, new_value], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

function change_max_debt(address, id) {
  let new_value = prompt(`New max debt for collateral type ${id}:`)
  if (Number(new_value)) {
    send(Stablecoin(address).setMaxDebt, [id, new_value], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

function register_collateral_type(address) {
  send(Stablecoin(address).registerCollateralType, [
    state[`new_token_${address}`],
    state[`new_vault_${address}`],
    state[`new_feed_${address}`],
    state[`new_spread_${address}`],
  ], hopefully(tx => {
    alert(`Transaction created: ${tx}`)
    each(keys(state), x => {
      if (new RegExp(`^new_.*_${address}$`).test(x)) {
        update({ [x]: null })
      }
    })
  }))
}

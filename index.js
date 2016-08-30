/// index.js -- UI components, application-specific logic

init()
setInterval(() => chain.env && reload(), 3000)

let Stablecoin = x => chain.SimpleStablecoin.at(x)
let feedbase = x => x == chain.feedbase.address ? "Standard" : code({}, [x])
let own = x => x.owner == coinbase()

fetch.stablecoins = $ => begin([
  chain.factory.count, (n, $) => times(n, (i, $) => begin([
    bind(chain.factory.stablecoins, i),
    (address, $) => parallel({
      props: bind(extract_contract_props, chain.SimpleStablecoin, address),
      balance: $ => Stablecoin(address).balanceOf(coinbase(), $),
      whitelisted: $ => Stablecoin(address).whitelist(coinbase(), $),
    }, hopefully(({ props, whitelisted, balance }) => {
      $(null, assign(props, { whitelisted, balance }))
    })),
    (x, $) => times(Number(x.nextType), (i, $) => parallel(fold(words(`
      token feed vault spread current_debt max_debt
    `), { id: always(i) }, (result, name) => assign(result, {
      [name]: bind(Stablecoin(x.address)[name], i)
    })), hopefully(props => {
      Stablecoin(props.token).balanceOf(coinbase(), hopefully(balance => {
        $(null, assign(props, { balance }))
      }))
    })), hopefully(types => $(null, assign(x, { types }))))
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
  owner == coinbase() && a({
    style: { float: "right" },
    onClick: () => set_owner(address),
  }, ["Transfer"]),
])

let whitelist_view = ({ address, owner, whitelisted }) => div({}, [
  whitelisted ? "Yes" : "No",
  small({ style: { marginLeft: ".5rem" } }, [
    " (cannot display whole whitelist)"
  ]),
  div({ style: { float: "right" } }, owner == coinbase() ? [a({
    onClick: () => add_whitelist(address),
  }, ["Add"]), " ", a({
    style: { marginLeft: ".25rem" },
    onClick: () => remove_whitelist(address),
  }, ["Remove"])] : [])
])

let balance_view = ({ address, balance }) => div({}, [
  Number(balance),
  div({ style: { float: "right" } }, [a({
    onClick: () => purchase(address),
  }, ["Purchase"]), " ", a({
    style: { marginLeft: ".25rem" },
    onClick: () => redeem(address),
  }, ["Redeem"])])
])

let type_id_view = ({ address }, { id, token }) => div({}, [
  Number(id), span({ style: { float: "right" } }, [Number(token) ? a({
    onClick: () => cancel_collateral_type(address, id),
  }, ["Cancel collateral type"]) : small({}, ["(cancelled)"])])
])

let feed_view = ({ address }, { id, token, feed }) => div({}, [
  Number(feed), !!Number(token) && a({
    style: { float: "right" },
    onClick: () => change_price_feed(address, id),
  }, ["Change price feed"])
])

let max_debt_view = ({ address }, { id, token, max_debt }) => div({}, [
  Number(max_debt), !!Number(token) && a({
    style: { float: "right" },
    onClick: () => change_max_debt(address, id),
  }, ["Change max debt"])
])

let collateral_balance_view = (
  { address, whitelisted }, { id, token, balance }
) => div({}, [
  Number(balance),
  div({ style: { float: "right" } }, whitelisted ? [a({
    onClick: () => purchase(address, id),
  }, ["Purchase"]), " ", a({
    style: { marginLeft: ".25rem" },
    onClick: () => redeem(address, id),
  }, ["Redeem"])] : [small({}, ["(not whitelisted)"])])
])

views.stablecoins = ({ stablecoins=[] }) => {
  return stablecoins.length ? table_list(stablecoins, {
    "Stablecoin":       x => strong({}, [code({}, [x.address])]),
    "Feedbase":         x => feedbase(x.feedbase),
    "Owner":            x => owner_view(x),
    "Rules":            x => ascii(x.rules),
    "Whitelisted":      x => whitelist_view(x),
    "Total supply":     x => Number(x.totalSupply),
    "Your balance":     x => Number(x.balance),
    "Collateral types": x => [
      Number(x.type_count), table_list(x.types, {
        "Collateral type":  y => type_id_view(x, y),
        "Token":            y => code({}, [y.token]),
        "Vault":            y => code({}, [y.vault]),
        "Price feed":       y => feed_view(x, y),
        "Max debt":         y => max_debt_view(x, y),
        "Spread":           y => Number(y.spread),
        "Current debt":     y => Number(y.current_debt),
        "Your balance":     y => collateral_balance_view(x, y),
      }), own(x) && (state[`new_${x.address}`] ? form({
        onSubmit: event => {
          event.preventDefault()
          if (confirm(`Register new collateral type?`)) {
            register_collateral_type(x.address)
          }
        }
      }, [
        h4({}, "Register collateral type"),
        label({}, ["Token address", input({
          value: state[`new_token_${x.address}`] || "",
          onChange: event => update({
            [`new_token_${x.address}`]: event.target.value,
          }),
        })]),
        label({}, ["Vault address", input({
          value: state[`new_vault_${x.address}`] || "",
          onChange: event => update({
            [`new_vault_${x.address}`]: event.target.value,
          }),
        })]),
        label({}, ["Price feed", input({
          value: state[`new_feed_${x.address}`] || "",
          onChange: event => update({
            [`new_feed_${x.address}`]: event.target.value,
          }),
        })]),
        label({}, ["Spread", input({
          value: state[`new_spread_${x.address}`] || "",
          onChange: event => update({
            [`new_spread_${x.address}`]: event.target.value,
          }),
        })]),
        div({ style: { textAlign: "right" } }, [
          button({}, ["Register collateral type"])
        ]),
      ]) : div({
        style: { marginLeft: "1rem", marginTop: "1rem" },
      }, [a({
        onClick: () => update({ [`new_${x.address}`]: true }),
      }, ["Register new collateral type"])]))
    ]
  }) : small({}, ["(none)"])
}

function table_list(xs, fields) {
  return !!xs.length && table({}, xs.map((x, i) => {
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
  ], hopefully(tx => {
    alert(`Transaction created: ${tx}`)
    update({ rules: "" })
  }))
}

function set_owner(address) {
  let new_value = prompt(`New owner for stablecoin ${address}:`)
  if (new_value) {
    send(Stablecoin(address).setOwner, [new_value], hopefully(tx => {
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
    send(Stablecoin(address).setCeiling, [id, new_value], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

function add_whitelist(address) {
  let x = prompt(`Add which address to whitelist for ${address}?`)
  if (x) {
    send(Stablecoin(address).setWhitelist, [x, true], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

function remove_whitelist(address) {
  let x = prompt(`Remove which address from whitelist for ${address}?`)
  if (x) {
    send(Stablecoin(address).setWhitelist, [x, false], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

function purchase(address, id) {
  let x = prompt(`Buy stablecoins for how many of these collateral tokens?`)
  if (Number(x)) {
    send(Stablecoin(address).purchase, [id, Number(x)], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

function redeem(address, id) {
  let x = prompt(`Redeem how many stablecoins for this collateral type?`)
  if (Number(x)) {
    send(Stablecoin(address).redeem, [id, Number(x)], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

function register_collateral_type(address) {
  send(Stablecoin(address).register, [
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

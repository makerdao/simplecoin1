/// index.js -- UI components, application-specific logic

init()
setInterval(() => chain.env && reload(), 3000)

let Simplecoin = x => chain.Simplecoin.at(x)
let feedbase = x => x == chain.feedbase.address ? "Standard" : code({}, [x])
let own = x => x.owner == coinbase()

fetch.coins = $ => begin([
  chain.factory.count, (n, $) => times(n, (i, $) => begin([
    bind(chain.factory.coins, i),
    (address, $) => parallel({
      props: bind(extract_contract_props, chain.Simplecoin, address),
      balance: $ => Simplecoin(address).balanceOf(coinbase(), $),
    }, hopefully(({ props, balance }) => {
      $(null, assign(props, { balance }))
    })),
    (x, $) => times(Number(x.nextType), (i, $) => parallel(fold(words(`
      token feed vault spread debt ceiling
    `), { id: always(i) }, (result, name) => assign(result, {
      [name]: bind(Simplecoin(x.address)[name], i)
    })), hopefully(props => {
      Simplecoin(props.token).balanceOf(coinbase(), hopefully(balance => {
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

// let whitelist_view = ({ address, owner, whitelisted }) => div({}, [
//   whitelisted ? "Yes" : "No",
//   small({ style: { marginLeft: ".5rem" } }, [
//     " (cannot display whole whitelist)"
//   ]),
//   div({ style: { float: "right" } }, owner == coinbase() ? [a({
//     onClick: () => add_whitelist(address),
//   }, ["Add"]), " ", a({
//     style: { marginLeft: ".25rem" },
//     onClick: () => remove_whitelist(address),
//   }, ["Remove"])] : [])
// ])

let balance_view = ({ address, balance }) => div({}, [
  Number(balance),
  div({ style: { float: "right" } }, [a({
    onClick: () => issue(address),
  }, ["Issue"]), " ", a({
    style: { marginLeft: ".25rem" },
    onClick: () => cover(address),
  }, ["Cover"])])
])

let type_id_view = ({ address }, { id, token }) => div({}, [
  Number(id), span({ style: { float: "right" } }, [Number(token) ? a({
    onClick: () => unregister(address, id),
  }, ["Cancel collateral type"]) : small({}, ["(cancelled)"])])
])

let feed_view = ({ address }, { id, token, feed }) => div({}, [
  Number(feed), !!Number(token) && a({
    style: { float: "right" },
    onClick: () => set_feed(address, id),
  }, ["Change price feed"])
])

let ceiling_view = ({ address }, { id, token, ceiling }) => div({}, [
  Number(ceiling), !!Number(token) && a({
    style: { float: "right" },
    onClick: () => set_ceiling(address, id),
  }, ["Change debt ceiling"])
])

let collateral_balance_view = (
  { address, whitelisted }, { id, token, balance }
) => div({}, [
  Number(balance),
  div({ style: { float: "right" } }, whitelisted ? [a({
    onClick: () => issue(address, id),
  }, ["Issue"]), " ", a({
    style: { marginLeft: ".25rem" },
    onClick: () => cover(address, id),
  }, ["Cover"])] : [small({}, ["(not whitelisted)"])])
])

views.coins = ({ coins=[] }) => {
  return coins.length ? table_list(coins, {
    "Coin":       x => strong({}, [code({}, [x.address])]),
    "Feedbase":         x => feedbase(x.feedbase),
    "Owner":            x => owner_view(x),
    "Rules":            x => ascii(x.rules),
    "Whitelisted":      x => "[TODO]", // whitelist_view(x),
    "Total supply":     x => Number(x.totalSupply),
    "Your balance":     x => Number(x.balance),
    "Collateral types": x => [
      Number(x.nextType), table_list(x.types, {
        "Collateral type":  y => type_id_view(x, y),
        "Token":            y => code({}, [y.token]),
        "Vault":            y => code({}, [y.vault]),
        "Price feed":       y => feed_view(x, y),
        "Spread":           y => Number(y.spread),
        "Debt ceiling":     y => ceiling_view(x, y),
        "Debt":             y => Number(y.debt),
        "Your balance":     y => collateral_balance_view(x, y),
      }), own(x) && (state[`new_${x.address}`] ? form({
        onSubmit: event => {
          event.preventDefault()
          if (confirm(`Register new collateral type?`)) {
            register(x.address)
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

function create_coin() {
  send(chain.factory.create, [
    chain.feedbase.address,
    hex(state.rules),
    // TODO: issuer whitelist
    // TODO: holder whitelist
  ], hopefully(tx => {
    alert(`Transaction created: ${tx}`)
    update({ rules: "" })
  }))
}

function set_owner(address) {
  let new_value = prompt(`New owner for coin ${address}:`)
  if (new_value) {
    send(Simplecoin(address).setOwner, [new_value], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

//----------------------------------------------------------

function register(address) {
  send(Simplecoin(address).register, [
    state[`new_token_${address}`],
  ], hopefully(tx => {
    alert(`Transaction created: ${tx}`)
    each(keys(state), x => {
      if (new RegExp(`^new_.*_${address}$`).test(x)) {
        update({ [x]: null })
      }
    })
  }))
}

// TODO: set_vault

function set_feed(address, id) {
  let new_value = prompt(`New price feed for collateral type ${id}:`)
  if (Number(new_value)) {
    send(Simplecoin(address).setFeed, [id, new_value], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

// TODO: set_spread

function set_ceiling(address, id) {
  let new_value = prompt(`New debt ceiling for collateral type ${id}:`)
  if (Number(new_value)) {
    send(Simplecoin(address).setCeiling, [id, new_value], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

function unregister(address, id) {
  if (confirm(`Cancel collateral type ${id} of coin ${address}?`)) {
    send(Simplecoin(address).unregister, [id], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

//----------------------------------------------------------

function issue(address, id) {
  let x = prompt(`Issue coins with how many of these collateral tokens?`)
  if (Number(x)) {
    send(Simplecoin(address).issue, [id, Number(x)], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

function cover(address, id) {
  let x = prompt(`Cover how many coins with this collateral type?`)
  if (Number(x)) {
    send(Simplecoin(address).cover, [id, Number(x)], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

//----------------------------------------------------------

// TODO: deprecated
function add_whitelist(address) {
  let x = prompt(`Add which address to whitelist for ${address}?`)
  if (x) {
    send(Simplecoin(address).setWhitelist, [x, true], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

// TODO: deprecated
function remove_whitelist(address) {
  let x = prompt(`Remove which address from whitelist for ${address}?`)
  if (x) {
    send(Simplecoin(address).setWhitelist, [x, false], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

/// index.js -- UI components, application-specific logic

init()
setInterval(() => chain.env && reload(), 3000)

let Simplecoin = x => chain.Simplecoin.at(x)
let feedbase = x => x == chain.feedbase.address ? "Standard" : code({}, [x])
let own = x => x.owner == coinbase()

fetch.coins = $ => begin([
  chain.factory.count,
  (n, $) => times(n, (i, $) => begin([

    bind(chain.factory.coins, i),

    (address, $) => parallel({
      props: bind(extract_contract_props, chain.Simplecoin, address),
      balance: $ => Simplecoin(address).balanceOf(coinbase(), $),
    }, hopefully(({ props, balance }) => {
      $(null, assign(props, { balance }))
    })),

    (props, $) => parallel({
      roles : bind(extract_authority_roles, props),
    }, hopefully(({ roles }) => {
      $(null, assign(props, { roles }))
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

function extract_authority_roles(props, $) {
  let role_auth = chain.SimpleRoleAuth.at(props.authority)
  parallel(
    { owner:  async.constant(props.authorityOwner == coinbase()),
      admin:  bind(role_auth.isAdmin,  coinbase()),
      issuer: bind(role_auth.isIssuer, coinbase()),
      holder: bind(role_auth.isHolder, coinbase()),
    },
  $)
}

let register_view = ({ address }) => (
  state[`new_${address}`]
  ? form({ onSubmit: event => {
      event.preventDefault()
      if (confirm(`Register new collateral type?`)) {
        register(address)
      }
    }
  }, [
    h4({}, "Register collateral type"),
    label({}, ["Token address", input({
      value: state[`new_token_${address}`] || "",
      onChange: event => update({
        [`new_token_${address}`]: event.target.value,
      }),
    })]),
    div({ style: { textAlign: "right" } }, [
      button({}, ["Register collateral type"])
    ]),
  ])
  : div({
      style: { marginLeft: "1rem", marginTop: "1rem" },
    },
    [a({
      onClick: () => update({ [`new_${address}`]: true }),
    },
    ["Register new collateral type"])])
)


let owner_view = ({ address, authorityOwner, authority }) => div({}, [
  authorityOwner == coinbase() ? "You" : code({}, [authorityOwner]),
  authorityOwner == coinbase() && a({
    style: { float: "right" },
    onClick: () => set_owner(address, authority),
  }, ["Transfer"]),
])

let role_view = ({ roles }) => div({}, [
    roles.owner  && "Owner | ",
    roles.admin  && "Admin | ",
    roles.issuer && "Issuer | ",
    roles.holder && "Holder",
])

let role_control_view = ({ authorityOwner, authority }) => div({}, [
  authorityOwner == coinbase() && div({ style: { float: "left" }}, [
    "Admin: ",
    a({ onClick: () => add_role(authority, "admin"), }, ["Add"]),
    "/",
    a({ onClick: () => del_role(authority, "admin"), }, ["Remove"]),
    " | Issuer: ",
    a({ onClick: () => add_role(authority, "issuer"), }, ["Add"]),
    "/",
    a({ onClick: () => del_role(authority, "issuer"), }, ["Remove"]),
    " | Holder: ",
    a({ onClick: () => add_role(authority, "holder"), }, ["Add"]),
    "/",
    a({ onClick: () => del_role(authority, "holder"), }, ["Remove"]),
  ]),
  authorityOwner != coinbase() && "Unauthorized",
])

let balance_view = ({ address, balance, roles }) => div({}, [
  Number(balance),
  roles.holder && a({ onClick: () => transfer(address),
                      style: { float: "right" },
                    }, ["Transfer"]),
])

let type_id_view = ({ address, roles }, { id, token }) => div({}, [
  Number(id),
  span({ style: { float: "right" } },
    [ !!Number(token)
      && roles.admin
      && a({ onClick: () => unregister(address, id), },
           ["Cancel collateral type"]),

      !Number(token) && small({}, ["(cancelled)"])
    ])
])

let vault_view = ({ address, roles }, { id, token, vault }) => div({}, [
  code({}, vault),
  !!Number(token)
    && roles.admin
    && a({ style: { float: "right" },
           onClick: () => set_vault(address, id),
         }, ["Change vault"])
])

let feed_view = ({ address, roles }, { id, token, feed }) => div({}, [
  Number(feed),
  !!Number(token)
    && roles.admin
    && a({ style: { float: "right" },
           onClick: () => set_feed(address, id),
         }, ["Change price feed"])
])

let spread_view = ({ address, roles }, { id, token, spread }) => div({}, [
  Number(spread),
  !!Number(token)
    && roles.admin
    && a({ style: { float: "right" },
           onClick: () => set_spread(address, id),
         }, ["Change spread"])
])

let ceiling_view = ({ address, roles }, { id, token, ceiling }) => div({}, [
  Number(ceiling),
  !!Number(token)
    && roles.admin
    && a({ style: { float: "right" },
           onClick: () => set_ceiling(address, id),
         }, ["Change debt ceiling"])
])

let collateral_balance_view = (
  { address, roles }, { id, token, balance }
) => div({}, [
  Number(balance),
  div({ style: { float: "right" } }, [
    roles.issuer && a({ onClick: () => issue(address, id),
                      }, ["Issue"]),
    " ",
    roles.issuer && a({ onClick: () => cover(address, id),
                      }, ["Cover"]),
    " ",
    !!Number(balance) && a({ onClick: () => transfer(token),
                           }, ["Transfer"]),
    " ",
    !!Number(balance) && a({ onClick: () => approve(token, address),
                           }, ["Approve"]),
  ])
])

views.coins = ({ coins=[] }) => {
  return coins.length ? table_list(coins, {
    "Coin":             x => strong({}, [code({}, [x.address])]),
    "Feedbase":         x => feedbase(x.feedbase),
    "Owner":            x => owner_view(x),
    "Rules":            x => ascii(x.rules),
    "Your roles":       x => role_view(x),
    "Role Control":     x => role_control_view(x),
    "Total supply":     x => Number(x.totalSupply),
    "Your balance":     x => balance_view(x),
    "Collateral types": x => [
      Number(x.nextType), table_list(x.types, {
        "Collateral type":  y => type_id_view(x, y),
        "Token":            y => code({}, [y.token]),
        "Vault":            y => vault_view(x, y),
        "Price feed":       y => feed_view(x, y),
        "Spread":           y => spread_view(x, y),
        "Debt ceiling":     y => ceiling_view(x, y),
        "Debt":             y => Number(y.debt),
        "Your balance":     y => collateral_balance_view(x, y),
      }), x.roles.admin && register_view(x)
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
  ], hopefully(tx => {
    alert(`Transaction created: ${tx}`)
    update({ rules: "" })
  }))
}

function set_owner(address, authority) {
  let new_value = prompt(`New owner for coin ${address}:`)
  if (new_value) {
    send(chain.SimpleRoleAuth.at(authority).setOwner, [new_value], hopefully(tx => {
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

function set_vault(address, id) {
  let new_value = prompt(`New vault for collateral type ${id}:`)
  if (Number(new_value)) {
    send(Simplecoin(address).setVault, [id, new_value], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

function set_feed(address, id) {
  let new_value = prompt(`New price feed for collateral type ${id}:`)
  if (Number(new_value)) {
    send(Simplecoin(address).setFeed, [id, new_value], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

function set_spread(address, id) {
  let new_value = prompt(`New spread for collateral type ${id}:`)
  if (Number(new_value)) {
    send(Simplecoin(address).setSpread, [id, new_value], hopefully(tx => {
      alert(`Transaction created: ${tx}`)
    }))
  }
}

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

function transfer(token) {
  let recipient = prompt(`Transfer coins to who?`)
  let how_much = prompt(`Transfer how many coins?`)
  if (Number(how_much) && Number(recipient)) {
    send(Simplecoin(token).transfer,  // should use ERC20
         [recipient, Number(how_much)],
         hopefully(tx => { alert(`Transaction created: ${tx}`)
    }))
  }
}

function approve(token, address='') {
  let recipient = prompt(`Approve who? (default this simplecoin)`, address)
  let how_much = prompt(`Approve how much?`)
  if (Number(how_much) && Number(recipient)) {
    send(Simplecoin(token).approve,  // should use ERC20
         [recipient, Number(how_much)],
         hopefully(tx => { alert(`Transaction created: ${tx}`)
    }))
  }
}

//----------------------------------------------------------

function add_role(authority, role) {
  let address = prompt(`Address for new ${role}?`)
  if (role == "admin") {
    send(chain.SimpleRoleAuth.at(authority).addAdmin,
         [address],
         hopefully(tx => { alert(`Transaction created: ${tx}`)
    }))
  } else if (role == "issuer") {
    send(chain.SimpleRoleAuth.at(authority).addIssuer,
         [address],
         hopefully(tx => { alert(`Transaction created: ${tx}`)
    }))
  } else if (role == "holder") {
    send(chain.SimpleRoleAuth.at(authority).addHolder,
         [address],
         hopefully(tx => { alert(`Transaction created: ${tx}`)
    }))
  }
}

function del_role(authority, role) {
  let address = prompt(`Address to remove from ${role}?`)
  if (role == "admin") {
    send(chain.SimpleRoleAuth.at(authority).delAdmin,
         [address],
         hopefully(tx => { alert(`Transaction created: ${tx}`)
    }))
  } else if (role == "issuer") {
    send(chain.SimpleRoleAuth.at(authority).delIssuer,
         [address],
         hopefully(tx => { alert(`Transaction created: ${tx}`)
    }))
  } else if (role == "holder") {
    send(chain.SimpleRoleAuth.at(authority).delHolder,
         [address],
         hopefully(tx => { alert(`Transaction created: ${tx}`)
    }))
  }
}

let timeout = (ms, callback, $) => {
  let x = setTimeout(callback, ms)
  return (...rest) => (clearTimeout(x), $(...rest))
}

let get_dapple_env = env => fold(keys(dapple), {}, (result, name) => {
  let { classes, objects } = new dapple[name].class(web3, chain.env)
  return assign(result, classes, objects)
})

function extract_contract_props(type, address, $) {
  let contract = type.at(address)
  let is_property = abi => abi.constant && !abi.inputs.length
  let names = contract.abi.filter(is_property).map(abi => abi.name)
  parallel(assign(select(contract, names), convert({ address }, always)), $)
}

function table_list(xs, fields) {
  return table({}, xs.map((x, i) => {
    return tbody({ key: i }, keys(fields).map((name, i) => {
      return tr({ key: i }, [
        th({}, [name]),
        td({}, [fields[name](x)]),
      ])
    }))
  }))
}

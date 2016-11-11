let Tag       = name => (...rest) => tag(name, ...rest)
let a         = Tag("a")
let all       = x => array(document.querySelectorAll(x))
let always    = async.constant
let array     = x => [].slice.call(x)
let ascii     = x => web3.toAscii(x)
let assign    = Object.assign
let begin     = async.waterfall
let bind      = async.apply
let body      = document.body
let button    = Tag("button")
let code      = Tag("code")
let coinbase  = () => web3.eth.coinbase
let concat    = xs => [].concat(...xs)
let convert   = (o, f) => mapkv(o, (k, v) => kv(k, f(v)))
let create    = Object.create
let define    = Object.defineProperties
let div       = Tag("div")
let each      = (a, f) => [].forEach.call(a, f)
let fail      = x => { throw x instanceof Error ? x : new Error(x) }
let fold      = (xs, z, f) => xs.reduce(f, z)
let form      = Tag("form")
let h1        = Tag("h1")
let h2        = Tag("h2")
let h3        = Tag("h3")
let h4        = Tag("h4")
let hex       = x => web3.toHex(x)
let hopefully = $ => (e, x) => e ? fail(e) : $(x)
let input     = Tag("input")
let json      = x => JSON.stringify(x)
let keys      = Object.keys
let ks        = Object.keys
let kv        = (k, v) => ({ [k]: v })
let label     = Tag("label")
let map       = (a, f) => [].map.call(a, f)
let mapkv     = (o, f) => fold(keys(o), {}, (r, k) => assign(r, f(k, o[k])))
let maybe     = f => { try { return f() } catch (err) {} }
let noop      = () => void 0
let parallel  = async.parallel
let pick      = (o, k) => kv(k, o[k])
let render    = ReactDOM.render
let select    = (o, ks) => fold(ks, {}, (r, k) => assign(r, pick(o, k)))
let send      = (f, xs, $) => f(...xs.concat([{ from: coinbase(), gas: 4500000 }, $]))
let sheet     = document.styleSheets[0]
let small     = Tag("small")
let span      = Tag("span")
let storage   = localStorage
let strong    = Tag("strong")
let style     = x => sheet.insertRule(x, sheet.cssRules.length)
let table     = Tag("table")
let tag       = (name, o, xs=[]) => React.createElement(name, o, ...xs)
let tbody     = Tag("tbody")
let td        = Tag("td")
let textarea  = Tag("textarea")
let th        = Tag("th")
let times     = async.times
let tr        = Tag("tr")
let uniq      = x => keys(select({}, x))
let unjson    = x => maybe(() => JSON.parse(x))
let words     = x => x ? x.replace(/^\s+|\s+$/g, "").split(" ") : []

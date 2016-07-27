let mapvk   = (o, f) => mapkv(o, (k, v) => kv(k, f(v, k)))
let mapk    = (o, f) => mapkv(o, (k, v) => kv(f(k), v))

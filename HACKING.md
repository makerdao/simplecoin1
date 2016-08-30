Simplecoin UI
=============

This document briefly explains the architecture of the simplecoin UI.

The source code consists of thee parts: `lib.js`, which is just a
bunch of generic utilities and shortcuts; `init.js`, which contains
some semi-generic features (connecting to the blockchain, fetching
data, dealing with local storage and runtime state, rendering views).

But the real interesting stuff happens in `index.html`, `index.css`,
and of course `index.js`, which has most of the application logic.


State management
----------------

The UI has one global variable, called `state`.  It can be changed by
calling `update({ foo: 123 }, callback)`.  Obviously, it's easy to
inspect or change the `state` variable from the browser dev tools.

When the application starts, the `state` variable is initialized from
local storage.  The `persist({ foo: 123 }, callback)` function works
like `update()` except it also saves the values into local storage.

Every time `state` changes, all views are re-rendered using React.


Blockchain data fetching 
------------------------

**TODO:**  Although this is quite fail-safe, it's not very efficient,
           especially not refetching everything every three seconds,
           which matters if you're using something like MetaMask.

When the application starts, all data is fetched from the blockchain,
and after that whenever the `reload()` function is called (right now,
every few seconds).  In order to avoid having subtle caching problems,
no blockchain data is saved to local storage right now.

Fetching data is done by calling all the functions named `fetch.foo`,
which tend to get a little bit hairy as they need to fetch multiple
layers of data and then piece together all the different fragments.

The `async` library is heavily used for the asynchronous control flow.
See <https://github.com/caolan/async> for more information about that.
The name `$` is used instead of `callback` in the fetch functions just
because it's repeated so often that it causes a lot of visual clutter.

The `extract_contract_props` function is useful to automatically pull
out the public properties (i.e., zero-parameter `constant` functions)
of a chain object, which can be a good starting point for fetching the
rest of the information that is needed.

The classes and on-chain objects exported by Dapple are instantiated
as Web3.js objects and stored in the `chain` variable: the Feedbase
object is stored in `chain.feedbase`, the class in `chain.Feedbase`.
Documentation: <https://github.com/ethereum/wiki/wiki/JavaScript-API>.


View rendering and updating
---------------------------

Elements with a `data-view=foo` attribute are rendered by looking up
the corresponding view in the `views` object.  A view is basically a
function that takes the `state` object and returns a React element.

React elements are creating using the `tag("name", { ... }, [ ... ])`
function (or more often shortcuts like `div({ ... }, [ ... ])`, etc.).
The props always come first and we put the child elements into arrays,
because the nesting makes the code more regular and easy to indent.
(For regularity, even single child elements need to go into arrays.)
 
Some basic on/off toggling of elements is done using `data-when=foo`,
which causes an element to display only when `state.phase == "foo"`.
(This is used mostly to display the "loading" and "error" screens.)


User action handling
--------------------

User actions are handled in very simple way, usually by calling a
global function named after the action (such as `change_owner`).

Most user input/output is done using `prompt`, `confirm` and `alert`
(which work on every device and are extremely simple and robust), but
a more sophisticated version of this UI will likely use more complex
custom widgets instead of these browser primitives in most cases.

That's basically it.  Happy hacking!

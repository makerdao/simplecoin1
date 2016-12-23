'use strict';

// For geth
if (typeof dapple === 'undefined') {
  var dapple = {};
}

if (typeof web3 === 'undefined' && typeof Web3 === 'undefined') {
  var Web3 = require('web3');
}

dapple['feedbase'] = (function builder () {
  var environments = {
      'develop': {},
      'ropsten': {
        'feedbase': {
          'value': '0xaa63c8683647ef91b3fdab4b4989ee9588da297b',
          'type': 'Feedbase200[282b38333408c885a889cc295f573bac4b5e65f290fa838a40bae0d8d6af032c]'
        }
      }
    };

  function ContractWrapper (headers, _web3) {
    if (!_web3) {
      throw new Error('Must supply a Web3 connection!');
    }

    this.headers = headers;
    this._class = _web3.eth.contract(headers.interface);
  }

  ContractWrapper.prototype.deploy = function () {
    var args = new Array(arguments);
    args[args.length - 1].data = this.headers.bytecode;
    return this._class.new.apply(this._class, args);
  };

  var passthroughs = ['at', 'new'];
  for (var i = 0; i < passthroughs.length; i += 1) {
    ContractWrapper.prototype[passthroughs[i]] = (function (passthrough) {
      return function () {
        return this._class[passthrough].apply(this._class, arguments);
      };
    })(passthroughs[i]);
  }

  function constructor (_web3, env) {
    if (!env) {
      env = {
      'objects': {
        'feedbase': {
          'value': '0xaa63c8683647ef91b3fdab4b4989ee9588da297b',
          'type': 'Feedbase200[282b38333408c885a889cc295f573bac4b5e65f290fa838a40bae0d8d6af032c]'
        }
      },
      'type': 'ropsten'
    };
    }
    if(typeof env === "object" && !("objects" in env)) {
      env = {objects: env};
    }
    while (typeof env !== 'object') {
      if (!(env in environments)) {
        throw new Error('Cannot resolve environment name: ' + env);
      }
      env = {objects: environments[env]};
    }

    if (typeof _web3 === 'undefined') {
      if (!env.rpcURL) {
        throw new Error('Need either a Web3 instance or an RPC URL!');
      }
      _web3 = new Web3(new Web3.providers.HttpProvider(env.rpcURL));
    }

    this.headers = {
      'Callback': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'addr',
                'type': 'address'
              },
              {
                'name': 'eventName',
                'type': 'string'
              },
              {
                'name': 'functioncall',
                'type': 'string'
              }
            ],
            'name': 'on',
            'outputs': [],
            'payable': false,
            'type': 'function'
          }
        ],
        'bytecode': '606060405234610000575b610124806100196000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680636985e72414603c575b6000565b3460005760f0600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505060f2565b005b5b5050505600a165627a7a7230582096e27c9ce07ebcf4108080da00fcbf6ea28feb33da4738ef4ba2e049524e34650029'
      },
      'DappleEnv': {
        'interface': [
          {
            'inputs': [],
            'payable': false,
            'type': 'constructor'
          }
        ],
        'bytecode': '6060604052346000575b73aa63c8683647ef91b3fdab4b4989ee9588da297b600260000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073aa63c8683647ef91b3fdab4b4989ee9588da297b600460000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b6035806100c96000396000f30060606040525b60005600a165627a7a7230582014dd3b685d74e7817e1782f89c7e0883fbe27385f7f1573d0929a2d4bb2088f40029'
      },
      'DappleLogger': {
        'interface': [],
        'bytecode': '6060604052346000575b60358060166000396000f30060606040525b60005600a165627a7a723058207247ebbfc6e1c9ed9441a445f4db595f3822f0ef71d7ed10dd825888da104f9e0029'
      },
      'DeployFeedbase': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'export',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txoff',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txon',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'inputs': [],
            'payable': false,
            'type': 'constructor'
          },
          {
            'payable': false,
            'type': 'fallback'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'number',
                'type': 'uint256'
              }
            ],
            'name': 'exportNumber',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'exportObject',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'flag',
                'type': 'bool'
              }
            ],
            'name': 'setCalls',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'origin',
                'type': 'address'
              }
            ],
            'name': 'setOrigin',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'chaintype',
                'type': 'bytes32'
              }
            ],
            'name': 'assertChain',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'pushEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'popEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'eventName',
                'type': 'string'
              },
              {
                'indexed': false,
                'name': 'functioncall',
                'type': 'string'
              }
            ],
            'name': 'on',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'input',
                'type': 'bytes'
              },
              {
                'indexed': false,
                'name': 'result',
                'type': 'uint256'
              }
            ],
            'name': 'shUint',
            'type': 'event'
          }
        ],
        'bytecode': '606060405234610000575b5b5b73aa63c8683647ef91b3fdab4b4989ee9588da297b600260000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073aa63c8683647ef91b3fdab4b4989ee9588da297b600460000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b727202eeaad2c871c74c094231d1a4d28028321b600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073127202eeaad2c871c74c094231d1a4d28028321b600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b7fdeb8643b9b3399f6925a9b6f1f780d90946f75267aaab1d59685d28dd846b9c3604051610e4680610405833901809050604051809103906000f080156100005760405180807f66656564626173650000000000000000000000000000000000000000000000008152506020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a15b5b6101e3806102226000396000f30060606040523615610055576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680635067a4bd146100635780639fc288d1146100a3578063d900596c146100b2575b34610000576100615b5b565b005b34610000576100a160048080356000191690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506100c1565b005b34610000576100b0610139565b005b34610000576100bf610178565b005b7fdeb8643b9b3399f6925a9b6f1f780d90946f75267aaab1d59685d28dd846b9c382826040518083600019166000191681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a15b5050565b7fe68392b8656cb7ab571c539efc7ce5a43464478a591f773a55db9984c089f4d16001604051808215151515815260200191505060405180910390a15b565b7fe68392b8656cb7ab571c539efc7ce5a43464478a591f773a55db9984c089f4d16000604051808215151515815260200191505060405180910390a15b5600a165627a7a723058206817ce4975dbbfc9e13fddca56487e22017286dc361999494a7f9183ecb01e270029606060405260017401000000000000000000000000000000000000000002600160006101000a8154816bffffffffffffffffffffffff0219169083740100000000000000000000000000000000000000009004021790555034610000575b610dda8061006c6000396000f300606060405236156100c3576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302e0c14a146100c85780630fba34a41461011857806320202965146101645780633f29cd27146101b05780634e71d92d14610201578063770eb5bb146102525780638981d51314610293578063a160bdf514610307578063a69a55881461035d578063a99ffb7b1461039e578063ac016a31146103f4578063c908582014610444578063cd5f5c4a14610497575b610000565b34610000576100fa600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919050506104f2565b60405180826000191660001916815260200191505060405180910390f35b346100005761014a600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190505061051c565b604051808215151515815260200191505060405180910390f35b3461000057610196600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610544565b604051808215151515815260200191505060405180910390f35b34610000576101ff600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919080356000191690602001909190803564ffffffffff1690602001909190505061056f565b005b346100005761020e610742565b604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b3461000057610291600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919080356000191690602001909190505061093a565b005b34610000576102c5600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610a25565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3461000057610339600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610a94565b604051808264ffffffffff1664ffffffffff16815260200191505060405180910390f35b346100005761039c600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803560001916906020019091905050610af4565b005b34610000576103d0600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610b24565b604051808264ffffffffff1664ffffffffff16815260200191505060405180910390f35b3461000057610426600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610b84565b60405180826000191660001916815260200191505060405180910390f35b3461000057610495600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610bd3565b005b34610000576104c9600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610d18565b604051808360001916600019168152602001821515151581526020019250505060405180910390f35b60006000600061050184610d18565b9150915080151561051157610000565b8192505b5050919050565b600061052782610544565b15610535576000905061053f565b6001905061053f565b5b919050565b600061054f82610a94565b64ffffffffff1661055e610d81565b64ffffffffff16101590505b919050565b826105af61057c82610a25565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d8a565b82600060008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206002018160001916905550610604610d81565b600060008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160006101000a81548164ffffffffff021916908364ffffffffff16021790555081600060008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160056101000a81548164ffffffffff021916908364ffffffffff1602179055508373ffffffffffffffffffffffffffffffffffffffff19167f90a633a4a2ae23be4c20dd1f7cfe2f504e94c72375b96ad676914f78b67cd22884846040518083600019166000191681526020018264ffffffffff1664ffffffffff1681526020019250505060405180910390a25b5b50505050565b6000600160009054906101000a9004740100000000000000000000000000000000000000000290506107a5600074010000000000000000000000000000000000000000028273ffffffffffffffffffffffffffffffffffffffff19161415610d8a565b6001600160009054906101000a90047401000000000000000000000000000000000000000002740100000000000000000000000000000000000000009004017401000000000000000000000000000000000000000002600160006101000a8154816bffffffffffffffffffffffff0219169083740100000000000000000000000000000000000000009004021790555033600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff19167fff320af0a152725afb95a20a16c559e2324e0f998631b6892e0c1f3720415f4933604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a28090505b90565b8161097a61094782610a25565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d8a565b81600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060010181600019169055508273ffffffffffffffffffffffffffffffffffffffff19167f66f3485fca28b64e1fb0ce419f2fe27fc84b3d02de3dd7edc449f5b35a1779028360405180826000191660001916815260200191505060405180910390a25b5b505050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b919050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160059054906101000a900464ffffffffff1690505b919050565b610b1f82827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff61056f565b5b5050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160009054906101000a900464ffffffffff1690505b919050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206001015490505b919050565b81610c13610be082610a25565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d8a565b81600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508273ffffffffffffffffffffffffffffffffffffffff19167ff9748c45e3ee6ce874c66a836fcc6267e8fb43966eec794f6cac34450256ab1d83604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a25b5b505050565b60006000610d263384610d9a565b15610d7b57600060008473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060020154600191509150610d7c565b5b915091565b60004290505b90565b801515610d9657610000565b5b50565b6000610da58261051c565b90505b929150505600a165627a7a72305820b9e58618e8254a20e510a7636704825ecdbcebfe2d5104c498aa97fabb63f06f0029'
      },
      'FakePerson': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'target',
                'type': 'address'
              }
            ],
            'name': '_target',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'tryGet',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              },
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'payable': false,
            'type': 'fallback'
          }
        ],
        'bytecode': '606060405234610000575b6102af806100196000396000f3006060604052361561004a576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680634bbb216c146100c7578063cd5f5c4a146100fa575b34610000576100c55b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16600036604051808383808284378201915050925050506000604051808303816000866161da5a03f191505015156100c257610000565b5b565b005b34610000576100f8600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610155565b005b346100005761012c600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190505061019a565b604051808360001916600019168152602001821515151581526020019250505060405180910390f35b80600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b50565b60006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663cd5f5c4a846000604051604001526040518263ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001915050604060405180830381600087803b156100005760325a03f1156100005750505060405180519060200180519050915091505b9150915600a165627a7a72305820d97b2244c3a1a465abfdf199f62e1385d9ffdb8b12c33e44e938e1fd22bc0c3b0029'
      },
      'FakeToken': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'account',
                'type': 'address'
              },
              {
                'name': 'balance',
                'type': 'uint256'
              }
            ],
            'name': 'set_balance',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'a',
                'type': 'address'
              },
              {
                'name': 'x',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'totalSupply',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'from',
                'type': 'address'
              },
              {
                'name': 'to',
                'type': 'address'
              },
              {
                'name': 'amount',
                'type': 'uint256'
              }
            ],
            'name': 'transferFrom',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'name': 'balances',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'disable_throwing',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'a',
                'type': 'address'
              }
            ],
            'name': 'balanceOf',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'a',
                'type': 'address'
              },
              {
                'name': 'x',
                'type': 'uint256'
              }
            ],
            'name': 'transfer',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'a',
                'type': 'address'
              },
              {
                'name': 'b',
                'type': 'address'
              }
            ],
            'name': 'allowance',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'from',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': 'to',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'Transfer',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'owner',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': 'spender',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'Approval',
            'type': 'event'
          }
        ],
        'bytecode': '606060405234610000575b610500806100196000396000f30060606040523615610097576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630776e4fa1461009c578063095ea7b3146100d857806318160ddd1461012c57806323b872dd1461014f57806327e235e3146101c257806352929a0c1461020957806370a0823114610218578063a9059cbb1461025f578063dd62ed3e146102b3575b610000565b34610000576100d6600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610319565b005b3461000057610112600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610362565b604051808215151515815260200191505060405180910390f35b346100005761013961036b565b6040518082815260200191505060405180910390f35b34610000576101a8600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610371565b604051808215151515815260200191505060405180910390f35b34610000576101f3600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610484565b6040518082815260200191505060405180910390f35b346100005761021661049c565b005b3461000057610249600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506104ba565b6040518082815260200191505060405180910390f35b3461000057610299600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506104c2565b604051808215151515815260200191505060405180910390f35b3461000057610303600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506104cb565b6040518082815260200191505060405180910390f35b80600060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055505b5050565b60005b92915050565b60005b90565b6000600060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020548211156103de57600160009054906101000a900460ff16156103d8576000905061047d565b610000565b5b81600060008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550600190505b9392505050565b60006020528060005260406000206000915090505481565b6001600160006101000a81548160ff0219169083151502179055505b565b60005b919050565b60005b92915050565b60005b929150505600a165627a7a72305820e33673be8a35df231ad4afcfcef81e613277174d20ac2a86bef9e7f04dee62440029'
      },
      'Feedbase200': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'get',
            'outputs': [
              {
                'name': 'value',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'has',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'expired',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'name': 'expiration',
                'type': 'uint40'
              }
            ],
            'name': 'set',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claim',
            'outputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'name': 'label',
                'type': 'bytes32'
              }
            ],
            'name': 'set_label',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'expiration',
            'outputs': [
              {
                'name': '',
                'type': 'uint40'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'name': 'value',
                'type': 'bytes32'
              }
            ],
            'name': 'set',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'timestamp',
            'outputs': [
              {
                'name': '',
                'type': 'uint40'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'label',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'set_owner',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'tryGet',
            'outputs': [
              {
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'LogClaim',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'expiration',
                'type': 'uint40'
              }
            ],
            'name': 'LogSet',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'LogSetOwner',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'label',
                'type': 'bytes32'
              }
            ],
            'name': 'LogSetLabel',
            'type': 'event'
          }
        ],
        'bytecode': '606060405260017401000000000000000000000000000000000000000002600160006101000a8154816bffffffffffffffffffffffff0219169083740100000000000000000000000000000000000000009004021790555034610000575b610dda8061006c6000396000f300606060405236156100c3576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302e0c14a146100c85780630fba34a41461011857806320202965146101645780633f29cd27146101b05780634e71d92d14610201578063770eb5bb146102525780638981d51314610293578063a160bdf514610307578063a69a55881461035d578063a99ffb7b1461039e578063ac016a31146103f4578063c908582014610444578063cd5f5c4a14610497575b610000565b34610000576100fa600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919050506104f2565b60405180826000191660001916815260200191505060405180910390f35b346100005761014a600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190505061051c565b604051808215151515815260200191505060405180910390f35b3461000057610196600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610544565b604051808215151515815260200191505060405180910390f35b34610000576101ff600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919080356000191690602001909190803564ffffffffff1690602001909190505061056f565b005b346100005761020e610742565b604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b3461000057610291600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919080356000191690602001909190505061093a565b005b34610000576102c5600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610a25565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3461000057610339600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610a94565b604051808264ffffffffff1664ffffffffff16815260200191505060405180910390f35b346100005761039c600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803560001916906020019091905050610af4565b005b34610000576103d0600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610b24565b604051808264ffffffffff1664ffffffffff16815260200191505060405180910390f35b3461000057610426600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610b84565b60405180826000191660001916815260200191505060405180910390f35b3461000057610495600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610bd3565b005b34610000576104c9600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610d18565b604051808360001916600019168152602001821515151581526020019250505060405180910390f35b60006000600061050184610d18565b9150915080151561051157610000565b8192505b5050919050565b600061052782610544565b15610535576000905061053f565b6001905061053f565b5b919050565b600061054f82610a94565b64ffffffffff1661055e610d81565b64ffffffffff16101590505b919050565b826105af61057c82610a25565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d8a565b82600060008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206002018160001916905550610604610d81565b600060008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160006101000a81548164ffffffffff021916908364ffffffffff16021790555081600060008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160056101000a81548164ffffffffff021916908364ffffffffff1602179055508373ffffffffffffffffffffffffffffffffffffffff19167f90a633a4a2ae23be4c20dd1f7cfe2f504e94c72375b96ad676914f78b67cd22884846040518083600019166000191681526020018264ffffffffff1664ffffffffff1681526020019250505060405180910390a25b5b50505050565b6000600160009054906101000a9004740100000000000000000000000000000000000000000290506107a5600074010000000000000000000000000000000000000000028273ffffffffffffffffffffffffffffffffffffffff19161415610d8a565b6001600160009054906101000a90047401000000000000000000000000000000000000000002740100000000000000000000000000000000000000009004017401000000000000000000000000000000000000000002600160006101000a8154816bffffffffffffffffffffffff0219169083740100000000000000000000000000000000000000009004021790555033600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff19167fff320af0a152725afb95a20a16c559e2324e0f998631b6892e0c1f3720415f4933604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a28090505b90565b8161097a61094782610a25565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d8a565b81600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060010181600019169055508273ffffffffffffffffffffffffffffffffffffffff19167f66f3485fca28b64e1fb0ce419f2fe27fc84b3d02de3dd7edc449f5b35a1779028360405180826000191660001916815260200191505060405180910390a25b5b505050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b919050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160059054906101000a900464ffffffffff1690505b919050565b610b1f82827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff61056f565b5b5050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160009054906101000a900464ffffffffff1690505b919050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206001015490505b919050565b81610c13610be082610a25565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d8a565b81600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508273ffffffffffffffffffffffffffffffffffffffff19167ff9748c45e3ee6ce874c66a836fcc6267e8fb43966eec794f6cac34450256ab1d83604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a25b5b505050565b60006000610d263384610d9a565b15610d7b57600060008473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060020154600191509150610d7c565b5b915091565b60004290505b90565b801515610d9657610000565b5b50565b6000610da58261051c565b90505b929150505600a165627a7a72305820b9e58618e8254a20e510a7636704825ecdbcebfe2d5104c498aa97fabb63f06f0029'
      },
      'FeedbaseEvents200': {
        'interface': [
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'LogClaim',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'expiration',
                'type': 'uint40'
              }
            ],
            'name': 'LogSet',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'LogSetOwner',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'label',
                'type': 'bytes32'
              }
            ],
            'name': 'LogSetLabel',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052346000575b60358060166000396000f30060606040525b60005600a165627a7a723058209ce456c989b1083b3d4d3ceb7752c34f894846574ea83dfd0c8d4087f688cb1e0029'
      },
      'FeedbaseInterface200': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'get',
            'outputs': [
              {
                'name': 'value',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'has',
            'outputs': [
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'name': 'expiration',
                'type': 'uint40'
              }
            ],
            'name': 'set',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claim',
            'outputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'tryGet',
            'outputs': [
              {
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          }
        ],
        'bytecode': ''
      },
      'PaidFeedbase': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'get',
            'outputs': [
              {
                'name': 'value',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'has',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'token',
                'type': 'address'
              }
            ],
            'name': 'claim',
            'outputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'expired',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'token',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'name': 'expiration',
                'type': 'uint40'
              }
            ],
            'name': 'set',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'unpaid',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'user',
                'type': 'address'
              },
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'pay',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'claim',
            'outputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'name': 'price',
                'type': 'uint256'
              }
            ],
            'name': 'set_price',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'name': 'label',
                'type': 'bytes32'
              }
            ],
            'name': 'set_label',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'price',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'expiration',
            'outputs': [
              {
                'name': '',
                'type': 'uint40'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'name': 'value',
                'type': 'bytes32'
              }
            ],
            'name': 'set',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'timestamp',
            'outputs': [
              {
                'name': '',
                'type': 'uint40'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'label',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'free',
            'outputs': [
              {
                'name': '',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'set_owner',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'id',
                'type': 'bytes12'
              }
            ],
            'name': 'tryGet',
            'outputs': [
              {
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'payable': false,
            'type': 'function'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'price',
                'type': 'uint256'
              }
            ],
            'name': 'LogSetPrice',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': true,
                'name': 'user',
                'type': 'address'
              }
            ],
            'name': 'LogPay',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'LogClaim',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'expiration',
                'type': 'uint40'
              }
            ],
            'name': 'LogSet',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'LogSetOwner',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'label',
                'type': 'bytes32'
              }
            ],
            'name': 'LogSetLabel',
            'type': 'event'
          }
        ],
        'bytecode': '606060405260017401000000000000000000000000000000000000000002600160006101000a8154816bffffffffffffffffffffffff0219169083740100000000000000000000000000000000000000009004021790555034610000575b6117448061006c6000396000f30060606040523615610110576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806302e0c14a146101155780630fba34a4146101655780631e83409a146101b15780632020296514610226578063361b5eaa146102725780633f29cd27146102e65780634a3e2b21146103375780634a729fe1146103835780634e71d92d146103d657806362a52ed614610427578063770eb5bb146104645780638981d513146104a55780639a3ce54114610519578063a160bdf514610561578063a69a5588146105b7578063a99ffb7b146105f8578063ac016a311461064e578063c614da671461069e578063c9085820146106ea578063cd5f5c4a1461073d575b610000565b3461000057610147600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610798565b60405180826000191660001916815260200191505060405180910390f35b3461000057610197600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919050506107c2565b604051808215151515815260200191505060405180910390f35b34610000576101e2600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506107ea565b604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b3461000057610258600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610882565b604051808215151515815260200191505060405180910390f35b34610000576102a4600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919050506108ad565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3461000057610335600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919080356000191690602001909190803564ffffffffff1690602001909190505061091c565b005b3461000057610369600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610992565b604051808215151515815260200191505060405180910390f35b34610000576103d4600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff19169060200190919050506109ee565b005b34610000576103e3610bf3565b604051808273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b3461000057610462600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091908035906020019091905050610deb565b005b34610000576104a3600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803560001916906020019091905050610edc565b005b34610000576104d7600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050610fc7565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b346100005761054b600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050611036565b6040518082815260200191505060405180910390f35b3461000057610593600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050611085565b604051808264ffffffffff1664ffffffffff16815260200191505060405180910390f35b34610000576105f6600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091908035600019169060200190919050506110e5565b005b346100005761062a600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050611115565b604051808264ffffffffff1664ffffffffff16815260200191505060405180910390f35b3461000057610680600480803573ffffffffffffffffffffffffffffffffffffffff1916906020019091905050611175565b60405180826000191660001916815260200191505060405180910390f35b34610000576106d0600480803573ffffffffffffffffffffffffffffffffffffffff19169060200190919050506111c4565b604051808215151515815260200191505060405180910390f35b346100005761073b600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050611206565b005b346100005761076f600480803573ffffffffffffffffffffffffffffffffffffffff191690602001909190505061134b565b604051808360001916600019168152602001821515151581526020019250505060405180910390f35b6000600060006107a78461134b565b915091508015156107b757610000565b8192505b5050919050565b60006107cd82610882565b156107db57600090506107e5565b600190506107e5565b5b919050565b60006107f4610bf3565b905081600260008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508090505b919050565b600061088d82611085565b64ffffffffff1661089c6113b4565b64ffffffffff16101590505b919050565b6000600260008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b919050565b6109278383836113bd565b610930836111c4565b15600260008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060020160006101000a81548160ff0219169083151502179055505b505050565b6000600260008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060020160009054906101000a900460ff1690505b919050565b610a253073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611590565b6000600260008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060020160006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff19167f9d80096b676e42de6830e8a9256f4f9fdafb23527a99b51bcbc2ed719eb3ae3360405180905060405180910390a3610bed610aec826108ad565b73ffffffffffffffffffffffffffffffffffffffff166323b872dd84610b1185610fc7565b610b1a86611036565b6000604051602001526040518463ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019350505050602060405180830381600087803b156100005760325a03f1156100005750505060405180519050611590565b5b5b5050565b6000600160009054906101000a900474010000000000000000000000000000000000000000029050610c56600074010000000000000000000000000000000000000000028273ffffffffffffffffffffffffffffffffffffffff19161415611590565b6001600160009054906101000a90047401000000000000000000000000000000000000000002740100000000000000000000000000000000000000009004017401000000000000000000000000000000000000000002600160006101000a8154816bffffffffffffffffffffffff0219169083740100000000000000000000000000000000000000009004021790555033600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508073ffffffffffffffffffffffffffffffffffffffff19167fff320af0a152725afb95a20a16c559e2324e0f998631b6892e0c1f3720415f4933604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a28090505b90565b81610e2b610df882610fc7565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611590565b610e3d610e37846111c4565b15611590565b81600260008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600101819055508273ffffffffffffffffffffffffffffffffffffffff19167f787069bab7c2ae49c1ac37620b4eae6872cafed41e29cc8e3dc1fed0d2150149836040518082815260200191505060405180910390a25b5b505050565b81610f1c610ee982610fc7565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611590565b81600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060010181600019169055508273ffffffffffffffffffffffffffffffffffffffff19167f66f3485fca28b64e1fb0ce419f2fe27fc84b3d02de3dd7edc449f5b35a1779028360405180826000191660001916815260200191505060405180910390a25b5b505050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b919050565b6000600260008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206001015490505b919050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160059054906101000a900464ffffffffff1690505b919050565b61111082827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff61091c565b5b5050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160009054906101000a900464ffffffffff1690505b919050565b6000600060008373ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206001015490505b919050565b6000600073ffffffffffffffffffffffffffffffffffffffff166111e7836108ad565b73ffffffffffffffffffffffffffffffffffffffff161490505b919050565b8161124661121382610fc7565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611590565b81600060008573ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055508273ffffffffffffffffffffffffffffffffffffffff19167ff9748c45e3ee6ce874c66a836fcc6267e8fb43966eec794f6cac34450256ab1d83604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a25b5b505050565b6000600061135933846115a0565b156113ae57600060008473ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600201546001915091506113af565b5b915091565b60004290505b90565b826113fd6113ca82610fc7565b73ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611590565b82600060008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060020181600019169055506114526113b4565b600060008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160006101000a81548164ffffffffff021916908364ffffffffff16021790555081600060008673ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060030160056101000a81548164ffffffffff021916908364ffffffffff1602179055508373ffffffffffffffffffffffffffffffffffffffff19167f90a633a4a2ae23be4c20dd1f7cfe2f504e94c72375b96ad676914f78b67cd22884846040518083600019166000191681526020018264ffffffffff1664ffffffffff1681526020019250505060405180910390a25b5b50505050565b80151561159c57610000565b5b50565b60006115ab82610882565b156115b957600090506115e3565b6115c282610992565b156115d8576115d183836115e9565b90506115e3565b600190506115e3565b5b5b92915050565b6000600060405180807f70617928616464726573732c62797465733132290000000000000000000000008152506014019050604051809103902090503073ffffffffffffffffffffffffffffffffffffffff16817c0100000000000000000000000000000000000000000000000000000000900485856040518363ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff191673ffffffffffffffffffffffffffffffffffffffff19168152602001925050506000604051808303816000876161da5a03f19250505091505b50929150505600a165627a7a723058204d62b9227682036150b98417922426565d01eb3ebecd632b790b330b3debdc450029'
      },
      'PaidFeedbaseEvents': {
        'interface': [
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'price',
                'type': 'uint256'
              }
            ],
            'name': 'LogSetPrice',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': true,
                'name': 'user',
                'type': 'address'
              }
            ],
            'name': 'LogPay',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'LogClaim',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'value',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'expiration',
                'type': 'uint40'
              }
            ],
            'name': 'LogSet',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'owner',
                'type': 'address'
              }
            ],
            'name': 'LogSetOwner',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'id',
                'type': 'bytes12'
              },
              {
                'indexed': false,
                'name': 'label',
                'type': 'bytes32'
              }
            ],
            'name': 'LogSetLabel',
            'type': 'event'
          }
        ],
        'bytecode': '6060604052346000575b60358060166000396000f30060606040525b60005600a165627a7a723058200c1b3e409c9a199f79df25210170b24096a497c977e1487aec0afe1ce4f6c6f70029'
      },
      'SMS': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'number',
                'type': 'string'
              },
              {
                'name': 'message',
                'type': 'string'
              }
            ],
            'name': 'send',
            'outputs': [],
            'payable': false,
            'type': 'function'
          }
        ],
        'bytecode': '606060405234610000575b610104806100196000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063bd6de11c14603c575b6000565b3460005760d1600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505060d3565b005b5b50505600a165627a7a7230582043d54b4567458e57f1ba572c4a6ec0ebec399083ab5f73100e1c9334837b2ba60029'
      },
      'Script': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'export',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txoff',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [],
            'name': 'txon',
            'outputs': [],
            'payable': false,
            'type': 'function'
          },
          {
            'inputs': [],
            'payable': false,
            'type': 'constructor'
          },
          {
            'payable': false,
            'type': 'fallback'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'number',
                'type': 'uint256'
              }
            ],
            'name': 'exportNumber',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'name',
                'type': 'bytes32'
              },
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              }
            ],
            'name': 'exportObject',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'flag',
                'type': 'bool'
              }
            ],
            'name': 'setCalls',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'origin',
                'type': 'address'
              }
            ],
            'name': 'setOrigin',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'chaintype',
                'type': 'bytes32'
              }
            ],
            'name': 'assertChain',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'pushEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'env',
                'type': 'bytes32'
              }
            ],
            'name': 'popEnv',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'addr',
                'type': 'address'
              },
              {
                'indexed': false,
                'name': 'eventName',
                'type': 'string'
              },
              {
                'indexed': false,
                'name': 'functioncall',
                'type': 'string'
              }
            ],
            'name': 'on',
            'type': 'event'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': false,
                'name': 'input',
                'type': 'bytes'
              },
              {
                'indexed': false,
                'name': 'result',
                'type': 'uint256'
              }
            ],
            'name': 'shUint',
            'type': 'event'
          }
        ],
        'bytecode': '606060405234610000575b5b73aa63c8683647ef91b3fdab4b4989ee9588da297b600260000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073aa63c8683647ef91b3fdab4b4989ee9588da297b600460000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b727202eeaad2c871c74c094231d1a4d28028321b600660006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073127202eeaad2c871c74c094231d1a4d28028321b600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5b6101e3806101766000396000f30060606040523615610055576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680635067a4bd146100635780639fc288d1146100a3578063d900596c146100b2575b34610000576100615b5b565b005b34610000576100a160048080356000191690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506100c1565b005b34610000576100b0610139565b005b34610000576100bf610178565b005b7fdeb8643b9b3399f6925a9b6f1f780d90946f75267aaab1d59685d28dd846b9c382826040518083600019166000191681526020018273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019250505060405180910390a15b5050565b7fe68392b8656cb7ab571c539efc7ce5a43464478a591f773a55db9984c089f4d16001604051808215151515815260200191505060405180910390a15b565b7fe68392b8656cb7ab571c539efc7ce5a43464478a591f773a55db9984c089f4d16000604051808215151515815260200191505060405180910390a15b5600a165627a7a72305820864902d4850b4066f2e396841a4d837fa7b685f218868a6cb80c92a69b57e0b20029'
      },
      'System': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'input',
                'type': 'string'
              }
            ],
            'name': 'to_uint',
            'outputs': [
              {
                'name': 'output',
                'type': 'uint256'
              }
            ],
            'payable': false,
            'type': 'function'
          }
        ],
        'bytecode': '606060405234610000575b60dc806100186000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806360cfa96314603c575b6000565b34600057608e600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505060a4565b6040518082815260200191505060405180910390f35b6000600b90505b9190505600a165627a7a723058206834155eb74742d9bc0e49b659ab8a673e1faed9da240bf5d45dda0ab0249d020029'
      }
    };

    this.classes = {};
    for (var key in this.headers) {
      this.classes[key] = new ContractWrapper(this.headers[key], _web3);
    }

    this.objects = {};
    for (var i in env.objects) {
      var obj = env.objects[i];
      if(!(obj['type'].split('[')[0] in this.classes)) continue;
      this.objects[i] = this.classes[obj['type'].split('[')[0]].at(obj.value);
    }
  }

  return {
    class: constructor,
    environments: environments
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dapple['feedbase'];
}

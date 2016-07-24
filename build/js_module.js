'use strict';

// For geth
if (typeof dapple === 'undefined') {
  var dapple = {};
}

if (typeof web3 === 'undefined' && typeof Web3 === 'undefined') {
  var Web3 = require('web3');
}

dapple['simple-stablecoin'] = (function builder () {
  var environments = {
      'morden': {
        'objects': {
          'factory': {
            'class': 'SimpleStablecoinFactory',
            'address': '0x14470b676d133155f20159e0a6ff41ddc7b5abfd'
          }
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
        'factory': {
          'class': 'SimpleStablecoinFactory',
          'address': '0x14470b676d133155f20159e0a6ff41ddc7b5abfd'
        }
      }
    };
    }
    while (typeof env !== 'object') {
      if (!(env in environments)) {
        throw new Error('Cannot resolve environment name: ' + env);
      }
      env = environments[env];
    }

    if (typeof _web3 === 'undefined') {
      if (!env.rpcURL) {
        throw new Error('Need either a Web3 instance or an RPC URL!');
      }
      _web3 = new Web3(new Web3.providers.HttpProvider(env.rpcURL));
    }

    this.headers = {
      'SimpleStablecoin': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'spender',
                'type': 'address'
              },
              {
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'totalSupply',
            'outputs': [
              {
                'name': 'supply',
                'type': 'uint256'
              }
            ],
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
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'transferFrom',
            'outputs': [
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'token',
                'type': 'address'
              },
              {
                'name': 'vault',
                'type': 'address'
              },
              {
                'name': 'feedID',
                'type': 'uint24'
              },
              {
                'name': 'spread',
                'type': 'uint256'
              }
            ],
            'name': 'registerCollateralType',
            'outputs': [
              {
                'name': 'id',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'rules',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              },
              {
                'name': 'what',
                'type': 'bool'
              }
            ],
            'name': 'setWhitelist',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'collateral_type',
                'type': 'uint256'
              },
              {
                'name': 'pay_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'purchase',
            'outputs': [
              {
                'name': 'purchased_quantity',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'balanceOf',
            'outputs': [
              {
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'collateral_type',
                'type': 'uint256'
              },
              {
                'name': 'stablecoin_quantity',
                'type': 'uint256'
              }
            ],
            'name': 'redeem',
            'outputs': [
              {
                'name': 'returned_amount',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'new_owner',
                'type': 'address'
              }
            ],
            'name': 'updateOwner',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getOwner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'to',
                'type': 'address'
              },
              {
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'transfer',
            'outputs': [
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'col_type',
                'type': 'uint256'
              },
              {
                'name': 'feed_id',
                'type': 'uint24'
              }
            ],
            'name': 'setFeed',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'collateral_type',
                'type': 'uint256'
              },
              {
                'name': 'max_debt',
                'type': 'uint256'
              }
            ],
            'name': 'setMaxDebt',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'owner',
                'type': 'address'
              },
              {
                'name': 'spender',
                'type': 'address'
              }
            ],
            'name': 'allowance',
            'outputs': [
              {
                'name': '_allowance',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'collateral_type',
                'type': 'uint256'
              }
            ],
            'name': 'cancelCollateralType',
            'outputs': [],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': 'feedbase',
                'type': 'address'
              },
              {
                'name': 'rules',
                'type': 'bytes32'
              }
            ],
            'type': 'constructor'
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
        'bytecode': '6060604052604051604080611785833981016040528080519060200190919080519060200190919050505b60005b80600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550806002600050819055505b5033600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550806004600050819055505b50506116a7806100de6000396000f3606060405236156100ed576000357c010000000000000000000000000000000000000000000000000000000090048063095ea7b3146100fa57806318160ddd1461013157806323b872dd1461015457806335c72a4d1461019457806352f6747a146101db57806353d6fd591461020257806370876c981461022357806370a08231146102585780637cbc237314610284578063880cdc31146102b9578063893d20e8146102d15780638da5cb5b1461030a578063a9059cbb14610343578063cb73fbb51461037a578063d214ed271461039b578063dd62ed3e146103bc578063fc561106146103f1576100ed565b6100f85b610002565b565b005b6101196004808035906020019091908035906020019091905050610409565b60405180821515815260200191505060405180910390f35b61013e60048050506104dd565b6040518082815260200191505060405180910390f35b61017c60048080359060200190919080359060200190919080359060200190919050506104ef565b60405180821515815260200191505060405180910390f35b6101c5600480803590602001909190803590602001909190803590602001909190803590602001909190505061072a565b6040518082815260200191505060405180910390f35b6101e8600480505061090d565b604051808260001916815260200191505060405180910390f35b610221600480803590602001909190803590602001909190505061091f565b005b61024260048080359060200190919080359060200190919050506109d9565b6040518082815260200191505060405180910390f35b61026e6004808035906020019091905050610d2a565b6040518082815260200191505060405180910390f35b6102a36004808035906020019091908035906020019091905050610d68565b6040518082815260200191505060405180910390f35b6102cf600480803590602001909190505061107c565b005b6102de600480505061111e565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610317600480505061114d565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610362600480803590602001909190803590602001909190505061117c565b60405180821515815260200191505060405180910390f35b61039960048080359060200190919080359060200190919050506112ea565b005b6103ba600480803590602001909190803590602001909190505061139e565b005b6103db6004808035906020019091908035906020019091905050611442565b6040518082815260200191505060405180910390f35b61040760048080359060200190919050506114ab565b005b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a3600190506104d7565b92915050565b600060026000505490506104ec565b90565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101561052d57610002565b81600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101561059357610002565b6105cc600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054836115c9565b15156105d757610002565b81600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050610723565b9392505050565b6000600160066000508054806001018281815481835581811511610804576005028160050283600052602060002091820191016108039190610767565b808211156107ff5760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549062ffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600050600090556003820160005060009055600482016000506000905550600501610767565b5090565b5b5050509190906000526020600020906005020160005b60c0604051908101604052808a8152602001888152602001898152602001878152602001600081526020016000815260200150909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060208201518160000160146101000a81548162ffffff0219169083021790555060408201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550606082015181600201600050556080820151816003016000505560a082015181600401600050555050039050610905565b949350505050565b6000600460005054905061091c565b90565b60003414156109cf57600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156109c55780600860005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908302179055506109ca565b610002565b6109d4565b610002565b5b5050565b60006000600033600860005060008273ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615610d1b576000341415610d1157600760009054906101000a900460ff1615610a4257610002565b6001600760006101000a81548160ff02191690830217905550600660005086815481101561000257906000526020600020906005020160005b509250600073ffffffffffffffffffffffffffffffffffffffff168360000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610adc57610002565b8260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd338560010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1688604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f11561000257505050604051805190602001501515610bde57610002565b610bfa8360000160149054906101000a900462ffffff166115de565b915082600201600050548204820185670de0b6b3a7640000020493508350610c51600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054856115c9565b1515610c5c57610002565b610c6b600260005054856115c9565b1515610c7657610002565b83600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508360026000828282505401925050819055508383600301600082828250540192505081905550826004016000505483600301600050541115610cf357610002565b6000600760006101000a81548160ff02191690830217905550610d16565b610002565b610d20565b610002565b505b505092915050565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610d63565b919050565b60006000600033600860005060008273ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161561106d57600034141561106357600760009054906101000a900460ff1615610dd157610002565b6001600760006101000a81548160ff02191690830217905550600660005086815481101561000257906000526020600020906005020160005b509250600073ffffffffffffffffffffffffffffffffffffffff168360000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610e6b57610002565b610e878360000160149054906101000a900462ffffff166115de565b915084600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015610ec557610002565b84600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055508460026000828282505403925050819055508483600301600082828250540392505081905550670de0b6b3a7640000836002016000505483048303860204935083508260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd8460010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff163387604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150151561104557610002565b6000600760006101000a81548160ff02191690830217905550611068565b610002565b611072565b610002565b505b505092915050565b600034141561111557600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561110b5780600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550611110565b610002565b61111a565b610002565b5b50565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905061114a565b90565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050611179565b90565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410156111ba57610002565b6111f3600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054836115c9565b15156111fe57610002565b81600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190506112e4565b92915050565b600034141561139457600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561138a5780600660005083815481101561000257906000526020600020906005020160005b5060000160146101000a81548162ffffff0219169083021790555061138f565b610002565b611399565b610002565b5b5050565b600034141561143857600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561142e5780600660005083815481101561000257906000526020600020906005020160005b5060040160005081905550611433565b610002565b61143d565b610002565b5b5050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506114a5565b92915050565b60003414156115c057600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156115b657600660005081815481101561000257906000526020600020906005020160005b6000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549062ffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600050600090556003820160005060009055600482016000506000905550506115bb565b610002565b6115c5565b610002565b5b50565b600082828401101590506115d8565b92915050565b600060006000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e1ac1a1185604051827c0100000000000000000000000000000000000000000000000000000000028152600401808262ffffff1681526020019150506040604051808303816000876161da5a03f11561000257505050604051805190602001805190602001509150915080151561169457610002565b816001900492506116a0565b505091905056'
      },
      'SimpleStablecoinFactory': {
        'interface': [
          {
            'constant': true,
            'inputs': [],
            'name': 'count',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'name': 'stablecoins',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'fb',
                'type': 'address'
              },
              {
                'name': 'rules',
                'type': 'bytes32'
              }
            ],
            'name': 'newSimpleStablecoin',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          }
        ],
        'bytecode': '60606040526119ee806100126000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806306661abd1461004f57806321371809146100725780638e7adbf3146100b45761004d565b005b61005c60048050506100ff565b6040518082815260200191505060405180910390f35b6100886004808035906020019091905050610108565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100d36004808035906020019091908035906020019091905050610140565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60016000505481565b600060005060205280600052604060002060009150909054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60006000838360405161178580610269833901808373ffffffffffffffffffffffffffffffffffffffff1681526020018260001916815260200192505050604051809103906000f090508073ffffffffffffffffffffffffffffffffffffffff1663880cdc3133604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506000604051808303816000876161da5a03f11561000257505050806000600050600060016000818150548092919060010191905055815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550809150610262565b5092915050566060604052604051604080611785833981016040528080519060200190919080519060200190919050505b60005b80600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550806002600050819055505b5033600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550806004600050819055505b50506116a7806100de6000396000f3606060405236156100ed576000357c010000000000000000000000000000000000000000000000000000000090048063095ea7b3146100fa57806318160ddd1461013157806323b872dd1461015457806335c72a4d1461019457806352f6747a146101db57806353d6fd591461020257806370876c981461022357806370a08231146102585780637cbc237314610284578063880cdc31146102b9578063893d20e8146102d15780638da5cb5b1461030a578063a9059cbb14610343578063cb73fbb51461037a578063d214ed271461039b578063dd62ed3e146103bc578063fc561106146103f1576100ed565b6100f85b610002565b565b005b6101196004808035906020019091908035906020019091905050610409565b60405180821515815260200191505060405180910390f35b61013e60048050506104dd565b6040518082815260200191505060405180910390f35b61017c60048080359060200190919080359060200190919080359060200190919050506104ef565b60405180821515815260200191505060405180910390f35b6101c5600480803590602001909190803590602001909190803590602001909190803590602001909190505061072a565b6040518082815260200191505060405180910390f35b6101e8600480505061090d565b604051808260001916815260200191505060405180910390f35b610221600480803590602001909190803590602001909190505061091f565b005b61024260048080359060200190919080359060200190919050506109d9565b6040518082815260200191505060405180910390f35b61026e6004808035906020019091905050610d2a565b6040518082815260200191505060405180910390f35b6102a36004808035906020019091908035906020019091905050610d68565b6040518082815260200191505060405180910390f35b6102cf600480803590602001909190505061107c565b005b6102de600480505061111e565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610317600480505061114d565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610362600480803590602001909190803590602001909190505061117c565b60405180821515815260200191505060405180910390f35b61039960048080359060200190919080359060200190919050506112ea565b005b6103ba600480803590602001909190803590602001909190505061139e565b005b6103db6004808035906020019091908035906020019091905050611442565b6040518082815260200191505060405180910390f35b61040760048080359060200190919050506114ab565b005b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a3600190506104d7565b92915050565b600060026000505490506104ec565b90565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101561052d57610002565b81600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101561059357610002565b6105cc600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054836115c9565b15156105d757610002565b81600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050610723565b9392505050565b6000600160066000508054806001018281815481835581811511610804576005028160050283600052602060002091820191016108039190610767565b808211156107ff5760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549062ffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600050600090556003820160005060009055600482016000506000905550600501610767565b5090565b5b5050509190906000526020600020906005020160005b60c0604051908101604052808a8152602001888152602001898152602001878152602001600081526020016000815260200150909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060208201518160000160146101000a81548162ffffff0219169083021790555060408201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550606082015181600201600050556080820151816003016000505560a082015181600401600050555050039050610905565b949350505050565b6000600460005054905061091c565b90565b60003414156109cf57600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156109c55780600860005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908302179055506109ca565b610002565b6109d4565b610002565b5b5050565b60006000600033600860005060008273ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615610d1b576000341415610d1157600760009054906101000a900460ff1615610a4257610002565b6001600760006101000a81548160ff02191690830217905550600660005086815481101561000257906000526020600020906005020160005b509250600073ffffffffffffffffffffffffffffffffffffffff168360000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610adc57610002565b8260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd338560010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1688604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f11561000257505050604051805190602001501515610bde57610002565b610bfa8360000160149054906101000a900462ffffff166115de565b915082600201600050548204820185670de0b6b3a7640000020493508350610c51600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054856115c9565b1515610c5c57610002565b610c6b600260005054856115c9565b1515610c7657610002565b83600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508360026000828282505401925050819055508383600301600082828250540192505081905550826004016000505483600301600050541115610cf357610002565b6000600760006101000a81548160ff02191690830217905550610d16565b610002565b610d20565b610002565b505b505092915050565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610d63565b919050565b60006000600033600860005060008273ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161561106d57600034141561106357600760009054906101000a900460ff1615610dd157610002565b6001600760006101000a81548160ff02191690830217905550600660005086815481101561000257906000526020600020906005020160005b509250600073ffffffffffffffffffffffffffffffffffffffff168360000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610e6b57610002565b610e878360000160149054906101000a900462ffffff166115de565b915084600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015610ec557610002565b84600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055508460026000828282505403925050819055508483600301600082828250540392505081905550670de0b6b3a7640000836002016000505483048303860204935083508260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd8460010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff163387604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150151561104557610002565b6000600760006101000a81548160ff02191690830217905550611068565b610002565b611072565b610002565b505b505092915050565b600034141561111557600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561110b5780600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550611110565b610002565b61111a565b610002565b5b50565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905061114a565b90565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050611179565b90565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410156111ba57610002565b6111f3600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054836115c9565b15156111fe57610002565b81600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190506112e4565b92915050565b600034141561139457600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561138a5780600660005083815481101561000257906000526020600020906005020160005b5060000160146101000a81548162ffffff0219169083021790555061138f565b610002565b611399565b610002565b5b5050565b600034141561143857600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561142e5780600660005083815481101561000257906000526020600020906005020160005b5060040160005081905550611433565b610002565b61143d565b610002565b5b5050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506114a5565b92915050565b60003414156115c057600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156115b657600660005081815481101561000257906000526020600020906005020160005b6000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549062ffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600050600090556003820160005060009055600482016000506000905550506115bb565b610002565b6115c5565b610002565b5b50565b600082828401101590506115d8565b92915050565b600060006000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e1ac1a1185604051827c0100000000000000000000000000000000000000000000000000000000028152600401808262ffffff1681526020019150506040604051808303816000876161da5a03f11561000257505050604051805190602001805190602001509150915080151561169457610002565b816001900492506116a0565b505091905056'
      },
      'TestableSimpleStablecoin': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'spender',
                'type': 'address'
              },
              {
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'totalSupply',
            'outputs': [
              {
                'name': 'supply',
                'type': 'uint256'
              }
            ],
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
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'transferFrom',
            'outputs': [
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'token',
                'type': 'address'
              },
              {
                'name': 'vault',
                'type': 'address'
              },
              {
                'name': 'feedID',
                'type': 'uint24'
              },
              {
                'name': 'spread',
                'type': 'uint256'
              }
            ],
            'name': 'registerCollateralType',
            'outputs': [
              {
                'name': 'id',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'time',
                'type': 'uint256'
              }
            ],
            'name': 'setTime',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'rules',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              },
              {
                'name': 'what',
                'type': 'bool'
              }
            ],
            'name': 'setWhitelist',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'collateral_type',
                'type': 'uint256'
              },
              {
                'name': 'pay_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'purchase',
            'outputs': [
              {
                'name': 'purchased_quantity',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'balanceOf',
            'outputs': [
              {
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'collateral_type',
                'type': 'uint256'
              },
              {
                'name': 'stablecoin_quantity',
                'type': 'uint256'
              }
            ],
            'name': 'redeem',
            'outputs': [
              {
                'name': 'returned_amount',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'new_owner',
                'type': 'address'
              }
            ],
            'name': 'updateOwner',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'getOwner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'owner',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'to',
                'type': 'address'
              },
              {
                'name': 'value',
                'type': 'uint256'
              }
            ],
            'name': 'transfer',
            'outputs': [
              {
                'name': 'ok',
                'type': 'bool'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'col_type',
                'type': 'uint256'
              },
              {
                'name': 'feed_id',
                'type': 'uint24'
              }
            ],
            'name': 'setFeed',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'collateral_type',
                'type': 'uint256'
              },
              {
                'name': 'max_debt',
                'type': 'uint256'
              }
            ],
            'name': 'setMaxDebt',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'owner',
                'type': 'address'
              },
              {
                'name': 'spender',
                'type': 'address'
              }
            ],
            'name': 'allowance',
            'outputs': [
              {
                'name': '_allowance',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'collateral_type',
                'type': 'uint256'
              }
            ],
            'name': 'cancelCollateralType',
            'outputs': [],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': 'fb',
                'type': 'address'
              },
              {
                'name': 'rules',
                'type': 'bytes32'
              }
            ],
            'type': 'constructor'
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
        'bytecode': '60606040526040516040806117bc833981016040528080519060200190919080519060200190919050505b81815b60005b80600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550806002600050819055505b5033600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555081600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550806004600050819055505b50505b50506116d8806100e46000396000f3606060405236156100f8576000357c010000000000000000000000000000000000000000000000000000000090048063095ea7b31461010557806318160ddd1461013c57806323b872dd1461015f57806335c72a4d1461019f5780633beb26c4146101e657806352f6747a146101fe57806353d6fd591461022557806370876c981461024657806370a082311461027b5780637cbc2373146102a7578063880cdc31146102dc578063893d20e8146102f45780638da5cb5b1461032d578063a9059cbb14610366578063cb73fbb51461039d578063d214ed27146103be578063dd62ed3e146103df578063fc56110614610414576100f8565b6101035b610002565b565b005b610124600480803590602001909190803590602001909190505061042c565b60405180821515815260200191505060405180910390f35b6101496004805050610500565b6040518082815260200191505060405180910390f35b6101876004808035906020019091908035906020019091908035906020019091905050610512565b60405180821515815260200191505060405180910390f35b6101d0600480803590602001909190803590602001909190803590602001909190803590602001909190505061074d565b6040518082815260200191505060405180910390f35b6101fc6004808035906020019091905050610930565b005b61020b600480505061093e565b604051808260001916815260200191505060405180910390f35b6102446004808035906020019091908035906020019091905050610950565b005b6102656004808035906020019091908035906020019091905050610a0a565b6040518082815260200191505060405180910390f35b6102916004808035906020019091905050610d5b565b6040518082815260200191505060405180910390f35b6102c66004808035906020019091908035906020019091905050610d99565b6040518082815260200191505060405180910390f35b6102f260048080359060200190919050506110ad565b005b610301600480505061114f565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61033a600480505061117e565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61038560048080359060200190919080359060200190919050506111ad565b60405180821515815260200191505060405180910390f35b6103bc600480803590602001909190803590602001909190505061131b565b005b6103dd60048080359060200190919080359060200190919050506113cf565b005b6103fe6004808035906020019091908035906020019091905050611473565b6040518082815260200191505060405180910390f35b61042a60048080359060200190919050506114dc565b005b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a3600190506104fa565b92915050565b6000600260005054905061050f565b90565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054101561055057610002565b81600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410156105b657610002565b6105ef600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054836115fa565b15156105fa57610002565b81600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050610746565b9392505050565b600060016006600050805480600101828181548183558181151161082757600502816005028360005260206000209182019101610826919061078a565b808211156108225760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549062ffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556002820160005060009055600382016000506000905560048201600050600090555060050161078a565b5090565b5b5050509190906000526020600020906005020160005b60c0604051908101604052808a8152602001888152602001898152602001878152602001600081526020016000815260200150909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060208201518160000160146101000a81548162ffffff0219169083021790555060408201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550606082015181600201600050556080820151816003016000505560a082015181600401600050555050039050610928565b949350505050565b806009600050819055505b50565b6000600460005054905061094d565b90565b6000341415610a0057600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156109f65780600860005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff021916908302179055506109fb565b610002565b610a05565b610002565b5b5050565b60006000600033600860005060008273ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615610d4c576000341415610d4257600760009054906101000a900460ff1615610a7357610002565b6001600760006101000a81548160ff02191690830217905550600660005086815481101561000257906000526020600020906005020160005b509250600073ffffffffffffffffffffffffffffffffffffffff168360000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610b0d57610002565b8260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd338560010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1688604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f11561000257505050604051805190602001501515610c0f57610002565b610c2b8360000160149054906101000a900462ffffff1661160f565b915082600201600050548204820185670de0b6b3a7640000020493508350610c82600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054856115fa565b1515610c8d57610002565b610c9c600260005054856115fa565b1515610ca757610002565b83600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508360026000828282505401925050819055508383600301600082828250540192505081905550826004016000505483600301600050541115610d2457610002565b6000600760006101000a81548160ff02191690830217905550610d47565b610002565b610d51565b610002565b505b505092915050565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610d94565b919050565b60006000600033600860005060008273ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161561109e57600034141561109457600760009054906101000a900460ff1615610e0257610002565b6001600760006101000a81548160ff02191690830217905550600660005086815481101561000257906000526020600020906005020160005b509250600073ffffffffffffffffffffffffffffffffffffffff168360000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610e9c57610002565b610eb88360000160149054906101000a900462ffffff1661160f565b915084600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015610ef657610002565b84600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505403925050819055508460026000828282505403925050819055508483600301600082828250540392505081905550670de0b6b3a7640000836002016000505483048303860204935083508260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd8460010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff163387604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150151561107657610002565b6000600760006101000a81548160ff02191690830217905550611099565b610002565b6110a3565b610002565b505b505092915050565b600034141561114657600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561113c5780600360006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550611141565b610002565b61114b565b610002565b5b50565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905061117b565b90565b6000600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506111aa565b90565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410156111eb57610002565b611224600060005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054836115fa565b151561122f57610002565b81600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050611315565b92915050565b60003414156113c557600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156113bb5780600660005083815481101561000257906000526020600020906005020160005b5060000160146101000a81548162ffffff021916908302179055506113c0565b610002565b6113ca565b610002565b5b5050565b600034141561146957600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561145f5780600660005083815481101561000257906000526020600020906005020160005b5060040160005081905550611464565b610002565b61146e565b610002565b5b5050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506114d6565b92915050565b60003414156115f157600360009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156115e757600660005081815481101561000257906000526020600020906005020160005b6000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549062ffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600050600090556003820160005060009055600482016000506000905550506115ec565b610002565b6115f6565b610002565b5b50565b60008282840110159050611609565b92915050565b600060006000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e1ac1a1185604051827c0100000000000000000000000000000000000000000000000000000000028152600401808262ffffff1681526020019150506040604051808303816000876161da5a03f1156100025750505060405180519060200180519060200150915091508015156116c557610002565b816001900492506116d1565b505091905056'
      }
    };

    this.classes = {};
    for (var key in this.headers) {
      this.classes[key] = new ContractWrapper(this.headers[key], _web3);
    }

    this.objects = {};
    for (var i in env.objects) {
      var obj = env.objects[i];
      this.objects[i] = this.classes[obj['class']].at(obj.address);
    }
  }

  return {
    class: constructor,
    environments: environments
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dapple['simple-stablecoin'];
}

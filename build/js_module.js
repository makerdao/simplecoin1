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
            'class': 'SimplecoinFactory',
            'address': '0x9e21fb8014e240560258f5ac5fbc4f6185e2ed7c'
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
          'class': 'SimplecoinFactory',
          'address': '0x9e21fb8014e240560258f5ac5fbc4f6185e2ed7c'
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
      'Sensible': {
        'interface': [],
        'bytecode': '606060405260188060106000396000f360606040523615600d57600d565b60165b6002565b565b00'
      },
      'Simplecoin': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'type_id',
                'type': 'uint48'
              }
            ],
            'name': 'feed',
            'outputs': [
              {
                'name': '',
                'type': 'uint24'
              }
            ],
            'type': 'function'
          },
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
            'constant': false,
            'inputs': [
              {
                'name': 'type_id',
                'type': 'uint48'
              },
              {
                'name': 'vault',
                'type': 'address'
              }
            ],
            'name': 'setVault',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'issuers',
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
                'name': 'new_owner',
                'type': 'address'
              }
            ],
            'name': 'setOwner',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'type_id',
                'type': 'uint48'
              },
              {
                'name': 'spread',
                'type': 'uint256'
              }
            ],
            'name': 'setSpread',
            'outputs': [],
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
            'name': 'register',
            'outputs': [
              {
                'name': 'id',
                'type': 'uint48'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'collateral_type',
                'type': 'uint48'
              },
              {
                'name': 'stablecoin_quantity',
                'type': 'uint256'
              }
            ],
            'name': 'cover',
            'outputs': [
              {
                'name': 'returned_amount',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'type_id',
                'type': 'uint48'
              }
            ],
            'name': 'ceiling',
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
                'name': 'collateral_type',
                'type': 'uint48'
              }
            ],
            'name': 'unregister',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'type_id',
                'type': 'uint48'
              }
            ],
            'name': 'token',
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
            'name': 'nextType',
            'outputs': [
              {
                'name': '',
                'type': 'uint48'
              }
            ],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'collateral_type',
                'type': 'uint48'
              },
              {
                'name': 'pay_how_much',
                'type': 'uint256'
              }
            ],
            'name': 'issue',
            'outputs': [
              {
                'name': 'issued_quantity',
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
                'name': 'new_authority',
                'type': 'address'
              },
              {
                'name': 'mode',
                'type': 'uint8'
              }
            ],
            'name': 'updateAuthority',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'holders',
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
                'name': 'amount',
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
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'type_id',
                'type': 'uint48'
              }
            ],
            'name': 'spread',
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
            'inputs': [],
            'name': '_authority',
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
            'name': 'feedbase',
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
                'name': 'type_id',
                'type': 'uint48'
              },
              {
                'name': 'ceiling',
                'type': 'uint256'
              }
            ],
            'name': 'setCeiling',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'type_id',
                'type': 'uint48'
              },
              {
                'name': 'feed',
                'type': 'uint24'
              }
            ],
            'name': 'setFeed',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'type_id',
                'type': 'uint48'
              }
            ],
            'name': 'vault',
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
            'name': '_auth_mode',
            'outputs': [
              {
                'name': '',
                'type': 'uint8'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'type_id',
                'type': 'uint48'
              }
            ],
            'name': 'debt',
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
            'constant': true,
            'inputs': [],
            'name': 'PRICE_UNIT',
            'outputs': [
              {
                'name': '',
                'type': 'uint256'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': '_feedbase',
                'type': 'address'
              },
              {
                'name': '_rules',
                'type': 'bytes32'
              },
              {
                'name': '_issuers',
                'type': 'address'
              },
              {
                'name': '_holders',
                'type': 'address'
              }
            ],
            'type': 'constructor'
          },
          {
            'anonymous': false,
            'inputs': [
              {
                'indexed': true,
                'name': 'auth',
                'type': 'address'
              },
              {
                'indexed': true,
                'name': 'mode',
                'type': 'DSAuthModesEnum.DSAuthModes'
              }
            ],
            'name': 'DSAuthUpdate',
            'type': 'event'
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
        'bytecode': '60606040526040516080806125e5833981016040528080519060200190919080519060200190919080519060200190919080519060200190919050505b5b60005b80600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550806002600050819055505b5033600360016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506000600360006101000a81548160ff0219169083021790555060003373ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a35b33600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555083600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508260066000508190555081600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5050505061240f806101d66000396000f360606040523615610187576000357c010000000000000000000000000000000000000000000000000000000090048063048cfe3214610194578063095ea7b3146101c55780630a17d71d146101fc5780630e40f5db1461021d57806313af40351461025657806315aa15be1461026e57806318160ddd1461028f57806323b872dd146102b25780634420e486146102f257806344654c2e1461032657806351be13b51461035b57806352f6747a146103875780636000ee1d146103ae5780636a1ae03d146103c65780636a3ed2f3146104085780636bb52a8e1461043357806370a08231146104685780637e1db2a1146104945780638188f71c146104b55780638da5cb5b146104ee578063a9059cbb14610527578063ba80794e1461055e578063c2205ee11461058a578063c26a5166146105c3578063cb38727f146105fc578063cb9760661461061d578063d36f84691461063e578063d551f60114610680578063d5c4b87a146106a3578063dd62ed3e146106cf578063ed435e581461070457610187565b6101925b610002565b565b005b6101aa6004808035906020019091905050610727565b604051808262ffffff16815260200191505060405180910390f35b6101e46004808035906020019091908035906020019091905050610771565b60405180821515815260200191505060405180910390f35b61021b6004808035906020019091908035906020019091905050610845565b005b61022a60048050506108c2565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61026c60048080359060200190919050506108e8565b005b61028d600480803590602001909190803590602001909190505061093a565b005b61029c6004805050610996565b6040518082815260200191505060405180910390f35b6102da60048080359060200190919080359060200190919080359060200190919050506109a8565b60405180821515815260200191505060405180910390f35b6103086004808035906020019091905050610b2f565b604051808265ffffffffffff16815260200191505060405180910390f35b6103456004808035906020019091908035906020019091905050610d35565b6040518082815260200191505060405180910390f35b6103716004808035906020019091905050611206565b6040518082815260200191505060405180910390f35b6103946004805050611244565b604051808260001916815260200191505060405180910390f35b6103c4600480803590602001909190505061124d565b005b6103dc6004808035906020019091905050611323565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610415600480505061137e565b604051808265ffffffffffff16815260200191505060405180910390f35b6104526004808035906020019091908035906020019091905050611393565b6040518082815260200191505060405180910390f35b61047e600480803590602001909190505061186c565b6040518082815260200191505060405180910390f35b6104b360048080359060200190919080359060200190919050506118aa565b005b6104c26004805050611950565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6104fb6004805050611976565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610546600480803590602001909190803590602001909190505061199c565b60405180821515815260200191505060405180910390f35b6105746004808035906020019091905050611b21565b6040518082815260200191505060405180910390f35b6105976004805050611b5f565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6105d06004805050611b85565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61061b6004808035906020019091908035906020019091905050611bab565b005b61063c6004808035906020019091908035906020019091905050611c07565b005b6106546004808035906020019091905050611c73565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61068d6004805050611cce565b6040518082815260200191505060405180910390f35b6106b96004808035906020019091905050611ce1565b6040518082815260200191505060405180910390f35b6106ee6004808035906020019091908035906020019091905050611d1f565b6040518082815260200191505060405180910390f35b6107116004805050611d88565b6040518082815260200191505060405180910390f35b600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5060000160149054906101000a900462ffffff16905061076c565b919050565b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905061083f565b92915050565b61085160003414611d94565b610859611da4565b156108b8578060096000508365ffffffffffff16815481101561000257906000526020600020906005020160005b5060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506108bd565b610002565b5b5050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6108f460003414611d94565b6108fc611da4565b156109315780600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550610936565b610002565b5b50565b61094660003414611d94565b61094e611da4565b1561098c578060096000508365ffffffffffff16815481101561000257906000526020600020906005020160005b5060020160005081905550610991565b610002565b5b5050565b600060026000505490506109a5565b90565b600083610a5e600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633af32abf83604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b83610b12600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633af32abf83604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b610b1d868686611f51565b92505050610b285650505b9392505050565b6000610b3d60003414611d94565b610b45611da4565b15610d2a57600160096000508054806001018281815481835581811511610c2257600502816005028360005260206000209182019101610c219190610b85565b80821115610c1d5760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549062ffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600050600090556003820160005060009055600482016000506000905550600501610b85565b5090565b5b5050509190906000526020600020906005020160005b60c060405190810160405280878152602001600081526020016000815260200160008152602001600081526020016000815260200150909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060208201518160000160146101000a81548162ffffff0219169083021790555060408201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550606082015181600201600050556080820151816003016000505560a082015181600401600050555050039050610d3056610d2f565b610002565b5b919050565b6000600060006000610df0600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633af32abf33604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b85600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b509050610e7b600073ffffffffffffffffffffffffffffffffffffffff168260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611d94565b610ed8600073ffffffffffffffffffffffffffffffffffffffff168260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611d94565b610efd60008260000160149054906101000a900462ffffff1662ffffff161415611d94565b610f0960003414611d94565b610f22600360159054906101000a900460ff1615611d94565b6001600360156101000a81548160ff0219169083021790555060096000508865ffffffffffff16815481101561000257906000526020600020906005020160005b509450610fa7610fa2600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548961218c565b611d94565b86600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082828250540392505081905550610ffa610ff56002600050548961218c565b611d94565b86600260008282825054039250508190555061102561102086600301600050548961218c565b611d94565b86856003016000828282505403925050819055506110558560000160149054906101000a900462ffffff1661219f565b935084600201600050548404840392506110776110728885612265565b611d94565b670de0b6b3a764000083880204955085506111878560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd8760010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16338a604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b6111a1856004016000505486600301600050541115611d94565b6111e1600260005054600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541115611d94565b6000600360156101000a81548160ff0219169083021790555050505b50505092915050565b600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5060040160005054905061123f565b919050565b60066000505481565b61125960003414611d94565b611261611da4565b1561131a5760096000508165ffffffffffff16815481101561000257906000526020600020906005020160005b6000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549062ffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600282016000506000905560038201600050600090556004820160005060009055505061131f565b610002565b5b50565b600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050611379565b919050565b60006009600050805490509050611390565b90565b600060006000600061144e600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633af32abf33604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b85600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5090506114d9600073ffffffffffffffffffffffffffffffffffffffff168260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611d94565b611536600073ffffffffffffffffffffffffffffffffffffffff168260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611d94565b61155b60008260000160149054906101000a900462ffffff1662ffffff161415611d94565b61156760003414611d94565b611580600360159054906101000a900460ff1615611d94565b6001600360156101000a81548160ff0219169083021790555060096000508865ffffffffffff16815481101561000257906000526020600020906005020160005b5094506116c38560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd338860010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168b604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b6116df8560000160149054906101000a900462ffffff1661219f565b93508460020160005054840484019250611709611704670de0b6b3a764000089612265565b611d94565b8287670de0b6b3a764000002049550855061175b611756600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548861228c565b611d94565b85600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055506117ae6117a96002600050548861228c565b611d94565b8560026000828282505401925050819055506117d96117d486600301600050548861228c565b611d94565b8585600301600082828250540192505081905550611807856004016000505486600301600050541115611d94565b611847600260005054600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541115611d94565b6000600360156101000a81548160ff0219169083021790555050505b50505092915050565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506118a5565b919050565b6118b2611da4565b156119465781600360016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600360006101000a81548160ff02191690830217905550808273ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a361194b565b610002565b5b5050565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600033611a52600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633af32abf83604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b83611b06600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633af32abf83604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b611b1085856122a1565b92505050611b1b5650505b92915050565b600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b50600201600050549050611b5a565b919050565b600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b611bb760003414611d94565b611bbf611da4565b15611bfd578060096000508365ffffffffffff16815481101561000257906000526020600020906005020160005b5060040160005081905550611c02565b610002565b5b5050565b611c1360003414611d94565b611c1b611da4565b15611c69578060096000508365ffffffffffff16815481101561000257906000526020600020906005020160005b5060000160146101000a81548162ffffff02191690830217905550611c6e565b610002565b5b5050565b600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050611cc9565b919050565b600360009054906101000a900460ff1681565b600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b50600301600050549050611d1a565b919050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050611d82565b92915050565b670de0b6b3a764000081565b801515611da057610002565b5b50565b60006000600360009054906101000a900460ff161415611e1657600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16149050611f4e565b6001600360009054906101000a900460ff161415611f4957600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b700961333306000357fffffffff0000000000000000000000000000000000000000000000000000000016604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200193505050506020604051808303816000876161da5a03f11561000257505050604051805190602001509050611f4e565b610002565b90565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015611f8f57610002565b81600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015611ff557610002565b61202e600060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548361228c565b151561203957610002565b81600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050612185565b9392505050565b6000818310159050612199565b92915050565b600060006000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e1ac1a1185604051827c0100000000000000000000000000000000000000000000000000000000028152600401808262ffffff1681526020019150506040604051808303816000876161da5a03f11561000257505050604051805190602001805190602001509150915061225281611d94565b8160019004925061225e565b5050919050565b600060008284029050600084148061227e575082848204145b9150612285565b5092915050565b6000828284011015905061229b565b92915050565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410156122df57610002565b612318600060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548361228c565b151561232357610002565b81600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050612409565b9291505056'
      },
      'SimplecoinFactory': {
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
            'constant': false,
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
            'name': 'create',
            'outputs': [
              {
                'name': 'result',
                'type': 'address'
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
            'name': 'coins',
            'outputs': [
              {
                'name': '',
                'type': 'address'
              }
            ],
            'type': 'function'
          }
        ],
        'bytecode': '606060405261359f806100126000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806306661abd1461004f578063a3def92314610072578063c6610657146100bd5761004d565b005b61005c60048050506100ff565b6040518082815260200191505060405180910390f35b6100916004808035906020019091908035906020019091905050610108565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100d360048080359060200190919050506102b7565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60016000505481565b60006000600060405161061f8061037c833901809050604051809103906000f0915060405161061f8061099b833901809050604051809103906000f0905061015082336102ef565b61015a81336102ef565b848483836040516125e580610fba833901808573ffffffffffffffffffffffffffffffffffffffff168152602001846000191681526020018373ffffffffffffffffffffffffffffffffffffffff1681526020018273ffffffffffffffffffffffffffffffffffffffff168152602001945050505050604051809103906000f0925082508273ffffffffffffffffffffffffffffffffffffffff166313af403533604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506000604051808303816000876161da5a03f11561000257505050826000600050600060016000818150548092919060010191905055815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b505092915050565b600060005060205280600052604060002060009150909054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b8173ffffffffffffffffffffffffffffffffffffffff16637e1db2a1826000604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506000604051808303816000876161da5a03f115610002575050505b50505660606040525b33600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506000600060006101000a81548160ff0219169083021790555060003373ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a35b61057f806100a06000396000f36060604052361561008a576000357c010000000000000000000000000000000000000000000000000000000090048063328d8f721461008c5780633af32abf146100a45780636aa633b6146100d25780637e1db2a1146100f75780639281aa0b14610118578063b700961314610139578063c2205ee114610179578063d551f601146101b25761008a565b005b6100a260048080359060200190919050506101d5565b005b6100ba6004808035906020019091905050610208565b60405180821515815260200191505060405180910390f35b6100df6004805050610260565b60405180821515815260200191505060405180910390f35b610116600480803590602001909190803590602001909190505061027c565b005b6101376004808035906020019091908035906020019091905050610322565b005b6101616004808035906020019091908035906020019091908035906020019091905050610380565b60405180821515815260200191505060405180910390f35b6101866004805050610399565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101bf60048050506103bf565b6040518082815260200191505060405180910390f35b6101dd6103d2565b156101ff5780600060156101000a81548160ff02191690830217905550610204565b610002565b5b50565b6000610212610260565b80156102545750600160005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff165b905061025b565b919050565b6000600060159054906101000a900460ff169050610279565b90565b6102846103d2565b156103185781600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600060006101000a81548160ff02191690830217905550808273ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a361031d565b610002565b5b5050565b61032a6103d2565b156103765780600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083021790555061037b565b610002565b5b5050565b600061038b84610208565b9050610392565b9392505050565b600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060009054906101000a900460ff1681565b60006000600060009054906101000a900460ff16141561044457600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905061057c565b6001600060009054906101000a900460ff16141561057757600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b700961333306000357fffffffff0000000000000000000000000000000000000000000000000000000016604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150905061057c565b610002565b905660606040525b33600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506000600060006101000a81548160ff0219169083021790555060003373ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a35b61057f806100a06000396000f36060604052361561008a576000357c010000000000000000000000000000000000000000000000000000000090048063328d8f721461008c5780633af32abf146100a45780636aa633b6146100d25780637e1db2a1146100f75780639281aa0b14610118578063b700961314610139578063c2205ee114610179578063d551f601146101b25761008a565b005b6100a260048080359060200190919050506101d5565b005b6100ba6004808035906020019091905050610208565b60405180821515815260200191505060405180910390f35b6100df6004805050610260565b60405180821515815260200191505060405180910390f35b610116600480803590602001909190803590602001909190505061027c565b005b6101376004808035906020019091908035906020019091905050610322565b005b6101616004808035906020019091908035906020019091908035906020019091905050610380565b60405180821515815260200191505060405180910390f35b6101866004805050610399565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101bf60048050506103bf565b6040518082815260200191505060405180910390f35b6101dd6103d2565b156101ff5780600060156101000a81548160ff02191690830217905550610204565b610002565b5b50565b6000610212610260565b80156102545750600160005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff165b905061025b565b919050565b6000600060159054906101000a900460ff169050610279565b90565b6102846103d2565b156103185781600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600060006101000a81548160ff02191690830217905550808273ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a361031d565b610002565b5b5050565b61032a6103d2565b156103765780600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083021790555061037b565b610002565b5b5050565b600061038b84610208565b9050610392565b9392505050565b600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060009054906101000a900460ff1681565b60006000600060009054906101000a900460ff16141561044457600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614905061057c565b6001600060009054906101000a900460ff16141561057757600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b700961333306000357fffffffff0000000000000000000000000000000000000000000000000000000016604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150905061057c565b610002565b905660606040526040516080806125e5833981016040528080519060200190919080519060200190919080519060200190919080519060200190919050505b5b60005b80600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550806002600050819055505b5033600360016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506000600360006101000a81548160ff0219169083021790555060003373ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a35b33600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555083600560006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055508260066000508190555081600760006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600860006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5050505061240f806101d66000396000f360606040523615610187576000357c010000000000000000000000000000000000000000000000000000000090048063048cfe3214610194578063095ea7b3146101c55780630a17d71d146101fc5780630e40f5db1461021d57806313af40351461025657806315aa15be1461026e57806318160ddd1461028f57806323b872dd146102b25780634420e486146102f257806344654c2e1461032657806351be13b51461035b57806352f6747a146103875780636000ee1d146103ae5780636a1ae03d146103c65780636a3ed2f3146104085780636bb52a8e1461043357806370a08231146104685780637e1db2a1146104945780638188f71c146104b55780638da5cb5b146104ee578063a9059cbb14610527578063ba80794e1461055e578063c2205ee11461058a578063c26a5166146105c3578063cb38727f146105fc578063cb9760661461061d578063d36f84691461063e578063d551f60114610680578063d5c4b87a146106a3578063dd62ed3e146106cf578063ed435e581461070457610187565b6101925b610002565b565b005b6101aa6004808035906020019091905050610727565b604051808262ffffff16815260200191505060405180910390f35b6101e46004808035906020019091908035906020019091905050610771565b60405180821515815260200191505060405180910390f35b61021b6004808035906020019091908035906020019091905050610845565b005b61022a60048050506108c2565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61026c60048080359060200190919050506108e8565b005b61028d600480803590602001909190803590602001909190505061093a565b005b61029c6004805050610996565b6040518082815260200191505060405180910390f35b6102da60048080359060200190919080359060200190919080359060200190919050506109a8565b60405180821515815260200191505060405180910390f35b6103086004808035906020019091905050610b2f565b604051808265ffffffffffff16815260200191505060405180910390f35b6103456004808035906020019091908035906020019091905050610d35565b6040518082815260200191505060405180910390f35b6103716004808035906020019091905050611206565b6040518082815260200191505060405180910390f35b6103946004805050611244565b604051808260001916815260200191505060405180910390f35b6103c4600480803590602001909190505061124d565b005b6103dc6004808035906020019091905050611323565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610415600480505061137e565b604051808265ffffffffffff16815260200191505060405180910390f35b6104526004808035906020019091908035906020019091905050611393565b6040518082815260200191505060405180910390f35b61047e600480803590602001909190505061186c565b6040518082815260200191505060405180910390f35b6104b360048080359060200190919080359060200190919050506118aa565b005b6104c26004805050611950565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6104fb6004805050611976565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610546600480803590602001909190803590602001909190505061199c565b60405180821515815260200191505060405180910390f35b6105746004808035906020019091905050611b21565b6040518082815260200191505060405180910390f35b6105976004805050611b5f565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6105d06004805050611b85565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61061b6004808035906020019091908035906020019091905050611bab565b005b61063c6004808035906020019091908035906020019091905050611c07565b005b6106546004808035906020019091905050611c73565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61068d6004805050611cce565b6040518082815260200191505060405180910390f35b6106b96004808035906020019091905050611ce1565b6040518082815260200191505060405180910390f35b6106ee6004808035906020019091908035906020019091905050611d1f565b6040518082815260200191505060405180910390f35b6107116004805050611d88565b6040518082815260200191505060405180910390f35b600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5060000160149054906101000a900462ffffff16905061076c565b919050565b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905061083f565b92915050565b61085160003414611d94565b610859611da4565b156108b8578060096000508365ffffffffffff16815481101561000257906000526020600020906005020160005b5060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506108bd565b610002565b5b5050565b600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6108f460003414611d94565b6108fc611da4565b156109315780600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550610936565b610002565b5b50565b61094660003414611d94565b61094e611da4565b1561098c578060096000508365ffffffffffff16815481101561000257906000526020600020906005020160005b5060020160005081905550610991565b610002565b5b5050565b600060026000505490506109a5565b90565b600083610a5e600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633af32abf83604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b83610b12600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633af32abf83604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b610b1d868686611f51565b92505050610b285650505b9392505050565b6000610b3d60003414611d94565b610b45611da4565b15610d2a57600160096000508054806001018281815481835581811511610c2257600502816005028360005260206000209182019101610c219190610b85565b80821115610c1d5760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549062ffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600050600090556003820160005060009055600482016000506000905550600501610b85565b5090565b5b5050509190906000526020600020906005020160005b60c060405190810160405280878152602001600081526020016000815260200160008152602001600081526020016000815260200150909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060208201518160000160146101000a81548162ffffff0219169083021790555060408201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550606082015181600201600050556080820151816003016000505560a082015181600401600050555050039050610d3056610d2f565b610002565b5b919050565b6000600060006000610df0600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633af32abf33604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b85600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b509050610e7b600073ffffffffffffffffffffffffffffffffffffffff168260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611d94565b610ed8600073ffffffffffffffffffffffffffffffffffffffff168260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611d94565b610efd60008260000160149054906101000a900462ffffff1662ffffff161415611d94565b610f0960003414611d94565b610f22600360159054906101000a900460ff1615611d94565b6001600360156101000a81548160ff0219169083021790555060096000508865ffffffffffff16815481101561000257906000526020600020906005020160005b509450610fa7610fa2600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548961218c565b611d94565b86600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082828250540392505081905550610ffa610ff56002600050548961218c565b611d94565b86600260008282825054039250508190555061102561102086600301600050548961218c565b611d94565b86856003016000828282505403925050819055506110558560000160149054906101000a900462ffffff1661219f565b935084600201600050548404840392506110776110728885612265565b611d94565b670de0b6b3a764000083880204955085506111878560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd8760010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16338a604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b6111a1856004016000505486600301600050541115611d94565b6111e1600260005054600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541115611d94565b6000600360156101000a81548160ff0219169083021790555050505b50505092915050565b600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5060040160005054905061123f565b919050565b60066000505481565b61125960003414611d94565b611261611da4565b1561131a5760096000508165ffffffffffff16815481101561000257906000526020600020906005020160005b6000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549062ffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff0219169055600282016000506000905560038201600050600090556004820160005060009055505061131f565b610002565b5b50565b600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050611379565b919050565b60006009600050805490509050611390565b90565b600060006000600061144e600760009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633af32abf33604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b85600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5090506114d9600073ffffffffffffffffffffffffffffffffffffffff168260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611d94565b611536600073ffffffffffffffffffffffffffffffffffffffff168260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611d94565b61155b60008260000160149054906101000a900462ffffff1662ffffff161415611d94565b61156760003414611d94565b611580600360159054906101000a900460ff1615611d94565b6001600360156101000a81548160ff0219169083021790555060096000508865ffffffffffff16815481101561000257906000526020600020906005020160005b5094506116c38560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd338860010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168b604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b6116df8560000160149054906101000a900462ffffff1661219f565b93508460020160005054840484019250611709611704670de0b6b3a764000089612265565b611d94565b8287670de0b6b3a764000002049550855061175b611756600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548861228c565b611d94565b85600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055506117ae6117a96002600050548861228c565b611d94565b8560026000828282505401925050819055506117d96117d486600301600050548861228c565b611d94565b8585600301600082828250540192505081905550611807856004016000505486600301600050541115611d94565b611847600260005054600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541115611d94565b6000600360156101000a81548160ff0219169083021790555050505b50505092915050565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505490506118a5565b919050565b6118b2611da4565b156119465781600360016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600360006101000a81548160ff02191690830217905550808273ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a361194b565b610002565b5b5050565b600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600033611a52600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633af32abf83604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b83611b06600860009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16633af32abf83604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f1156100025750505060405180519060200150611d94565b611b1085856122a1565b92505050611b1b5650505b92915050565b600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b50600201600050549050611b5a565b919050565b600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b611bb760003414611d94565b611bbf611da4565b15611bfd578060096000508365ffffffffffff16815481101561000257906000526020600020906005020160005b5060040160005081905550611c02565b610002565b5b5050565b611c1360003414611d94565b611c1b611da4565b15611c69578060096000508365ffffffffffff16815481101561000257906000526020600020906005020160005b5060000160146101000a81548162ffffff02191690830217905550611c6e565b610002565b5b5050565b600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050611cc9565b919050565b600360009054906101000a900460ff1681565b600060096000508265ffffffffffff16815481101561000257906000526020600020906005020160005b50600301600050549050611d1a565b919050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050611d82565b92915050565b670de0b6b3a764000081565b801515611da057610002565b5b50565b60006000600360009054906101000a900460ff161415611e1657600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16149050611f4e565b6001600360009054906101000a900460ff161415611f4957600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b700961333306000357fffffffff0000000000000000000000000000000000000000000000000000000016604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200193505050506020604051808303816000876161da5a03f11561000257505050604051805190602001509050611f4e565b610002565b90565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015611f8f57610002565b81600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015611ff557610002565b61202e600060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548361228c565b151561203957610002565b81600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050612185565b9392505050565b6000818310159050612199565b92915050565b600060006000600560009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e1ac1a1185604051827c0100000000000000000000000000000000000000000000000000000000028152600401808262ffffff1681526020019150506040604051808303816000876161da5a03f11561000257505050604051805190602001805190602001509150915061225281611d94565b8160019004925061225e565b5050919050565b600060008284029050600084148061227e575082848204145b9150612285565b5092915050565b6000828284011015905061229b565b92915050565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410156122df57610002565b612318600060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050548361228c565b151561232357610002565b81600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050612409565b9291505056'
      },
      'Vault': {
        'interface': [
          {
            'constant': false,
            'inputs': [
              {
                'name': 'token',
                'type': 'address'
              },
              {
                'name': 'who',
                'type': 'address'
              },
              {
                'name': 'how_much',
                'type': 'uint256'
              }
            ],
            'name': 'approve',
            'outputs': [],
            'type': 'function'
          }
        ],
        'bytecode': '606060405260f6806100116000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063e1f21c67146037576035565b005b605d6004808035906020019091908035906020019091908035906020019091905050605f565b005b8273ffffffffffffffffffffffffffffffffffffffff1663095ea7b38383604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506020604051808303816000876161da5a03f11560025750505060405180519060200150505b50505056'
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

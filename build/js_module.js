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
            'address': '0xbdc18ba86c21a34a17f63313aade7ffcf5ec9c5e'
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
          'address': '0xbdc18ba86c21a34a17f63313aade7ffcf5ec9c5e'
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
      'SimpleRoleAuth': {
        'interface': [
          {
            'constant': true,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'getUserRoles',
            'outputs': [
              {
                'name': '',
                'type': 'bytes32'
              }
            ],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [],
            'name': 'issuer',
            'outputs': [
              {
                'name': '',
                'type': 'uint8'
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
              }
            ],
            'name': 'addIssuer',
            'outputs': [],
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
            'name': 'isAdmin',
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
                'name': 'code',
                'type': 'address'
              },
              {
                'name': 'sig',
                'type': 'bytes4'
              }
            ],
            'name': 'getCapabilityRoles',
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
              }
            ],
            'name': 'delIssuer',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'name',
                'type': 'string'
              }
            ],
            'name': 'sig',
            'outputs': [
              {
                'name': '',
                'type': 'bytes4'
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
              }
            ],
            'name': 'delAdmin',
            'outputs': [],
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
                'name': 'role',
                'type': 'uint8'
              },
              {
                'name': 'enabled',
                'type': 'bool'
              }
            ],
            'name': 'setUserRole',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'addAdmin',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': false,
            'inputs': [
              {
                'name': 'role',
                'type': 'uint8'
              },
              {
                'name': 'code',
                'type': 'address'
              },
              {
                'name': 'sig',
                'type': 'bytes4'
              },
              {
                'name': 'enabled',
                'type': 'bool'
              }
            ],
            'name': 'setRoleCapability',
            'outputs': [],
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
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'isIssuer',
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
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'delHolder',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'input',
                'type': 'bytes32'
              }
            ],
            'name': 'BITNOT',
            'outputs': [
              {
                'name': 'output',
                'type': 'bytes32'
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
              },
              {
                'name': 'role',
                'type': 'uint8'
              }
            ],
            'name': 'hasUserRole',
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
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'addHolder',
            'outputs': [],
            'type': 'function'
          },
          {
            'constant': true,
            'inputs': [
              {
                'name': 'caller',
                'type': 'address'
              },
              {
                'name': 'code',
                'type': 'address'
              },
              {
                'name': 'sig',
                'type': 'bytes4'
              }
            ],
            'name': 'canCall',
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
            'inputs': [
              {
                'name': 'who',
                'type': 'address'
              }
            ],
            'name': 'isHolder',
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
            'inputs': [],
            'name': 'holder',
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
            'inputs': [],
            'name': 'admin',
            'outputs': [
              {
                'name': '',
                'type': 'uint8'
              }
            ],
            'type': 'function'
          },
          {
            'inputs': [
              {
                'name': 'target',
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
          }
        ],
        'bytecode': '60606040526000600360006101000a81548160ff021916908302179055506001600360016101000a81548160ff021916908302179055506002600360026101000a81548160ff021916908302179055506040516020806116e0833981016040528080519060200190919050505b5b33600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506000600060006101000a81548160ff0219169083021790555060003373ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a35b610157600360009054906101000a900460ff1682610150604060405190810160405280601181526020017f72656769737465722861646472657373290000000000000000000000000000008152602001506104d2565b6001610513565b6101b4600360009054906101000a900460ff16826101ad604060405190810160405280601881526020017f7365745661756c742875696e7434382c616464726573732900000000000000008152602001506104d2565b6001610513565b610211600360009054906101000a900460ff168261020a604060405190810160405280601681526020017f736574466565642875696e7434382c75696e74323429000000000000000000008152602001506104d2565b6001610513565b61026e600360009054906101000a900460ff1682610267604060405190810160405280601981526020017f7365745370726561642875696e7434382c75696e7432353629000000000000008152602001506104d2565b6001610513565b6102cb600360009054906101000a900460ff16826102c4604060405190810160405280601a81526020017f7365744365696c696e672875696e7434382c75696e74323536290000000000008152602001506104d2565b6001610513565b610328600360009054906101000a900460ff1682610321604060405190810160405280601281526020017f756e72656769737465722875696e7434382900000000000000000000000000008152602001506104d2565b6001610513565b610385600360019054906101000a900460ff168261037e604060405190810160405280601581526020017f69737375652875696e7434382c75696e743235362900000000000000000000008152602001506104d2565b6001610513565b6103e2600360019054906101000a900460ff16826103db604060405190810160405280601581526020017f636f7665722875696e7434382c75696e743235362900000000000000000000008152602001506104d2565b6001610513565b61043f600360029054906101000a900460ff1682610438604060405190810160405280601981526020017f7472616e7366657228616464726573732c75696e7432353629000000000000008152602001506104d2565b6001610513565b6104c2600360029054906101000a900460ff16826104bb606060405190810160405280602581526020017f7472616e7366657246726f6d28616464726573732c616464726573732c75696e81526020017f74323536290000000000000000000000000000000000000000000000000000008152602001506104d2565b6001610513565b5b50610e718061086f6000396000f35b600081604051808280519060200190808383829060006004602084601f0104600302600f01f1509050019150506040518091039020905061050e565b919050565b6000600061051f61068e565b1561068057600260005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000857bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000505491508560ff1660020a6001029050821561060957808217600260005060008773ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000508190555061067b565b6106128161083b565b8216600260005060008773ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600050819055505b610685565b610002565b5b505050505050565b60006000600060009054906101000a900460ff16141561070057600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16149050610838565b6001600060009054906101000a900460ff16141561083357600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b700961333306000357fffffffff0000000000000000000000000000000000000000000000000000000016604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200193505050506020604051808303816000876161da5a03f11561000257505050604051805190602001509050610838565b610002565b90565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6001028218905061086a565b919050566060604052361561012f576000357c01000000000000000000000000000000000000000000000000000000009004806306a36aee146101315780631d1438481461016157806320694db01461018757806324d7806c1461019f57806327538e90146101cd57806334becfb4146102065780634b8082151461021e57806362d91855146102a757806367aff484146102bf57806370480275146102e95780637d40583d146103015780637e1db2a114610334578063877b9a6714610355578063891ba7021461038357806393aa5ca81461039b578063a078f737146103cb578063ac1e17df14610402578063b70096131461041a578063c2205ee11461045a578063d4d7b19a14610493578063d551f601146104c1578063e534155d146104e4578063f851a4401461050a5761012f565b005b6101476004808035906020019091905050610530565b604051808260001916815260200191505060405180910390f35b61016e600480505061056e565b604051808260ff16815260200191505060405180910390f35b61019d6004808035906020019091905050610581565b005b6101b560048080359060200190919050506105d2565b60405180821515815260200191505060405180910390f35b6101ec60048080359060200190919080359060200190919050506105f9565b604051808260001916815260200191505060405180910390f35b61021c600480803590602001909190505061066b565b005b6102726004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506106a1565b60405180827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b6102bd60048080359060200190919050506106e2565b005b6102e76004808035906020019091908035906020019091908035906020019091905050610718565b005b6102ff60048080359060200190919050506107f9565b005b6103326004808035906020019091908035906020019091908035906020019091908035906020019091905050610865565b005b61035360048080359060200190919080359060200190919050506109e0565b005b61036b6004808035906020019091905050610a86565b60405180821515815260200191505060405180910390f35b6103996004808035906020019091905050610aad565b005b6103b16004808035906020019091905050610ae3565b604051808260001916815260200191505060405180910390f35b6103ea6004808035906020019091908035906020019091905050610b17565b60405180821515815260200191505060405180910390f35b6104186004808035906020019091905050610b55565b005b6104426004808035906020019091908035906020019091908035906020019091905050610b8b565b60405180821515815260200191505060405180910390f35b6104676004805050610c3e565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6104a96004808035906020019091905050610c64565b60405180821515815260200191505060405180910390f35b6104ce6004805050610c8b565b6040518082815260200191505060405180910390f35b6104f16004805050610c9e565b604051808260ff16815260200191505060405180910390f35b6105176004805050610cb1565b604051808260ff16815260200191505060405180910390f35b6000600160005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610569565b919050565b600360019054906101000a900460ff1681565b610589610cc4565b156105c9576105a981600360019054906101000a900460ff166001610718565b6105c481600360029054906101000a900460ff166001610718565b6105ce565b610002565b5b50565b60006105ed82600360009054906101000a900460ff16610b17565b90506105f4565b919050565b6000600260005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600050549050610665565b92915050565b610673610cc4565b156106985761069381600360019054906101000a900460ff166000610718565b61069d565b610002565b5b50565b600081604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050604051809103902090506106dd565b919050565b6106ea610cc4565b1561070f5761070a81600360009054906101000a900460ff166000610718565b610714565b610002565b5b50565b60006000610724610cc4565b156107ec57600160005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505491508360ff1660020a600102905082156107a857808217600160005060008773ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055506107e7565b6107b181610ae3565b8216600160005060008773ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055505b6107f1565b610002565b5b5050505050565b610801610cc4565b1561085c5761082181600360009054906101000a900460ff166001610718565b61083c81600360019054906101000a900460ff166001610718565b61085781600360029054906101000a900460ff166001610718565b610861565b610002565b5b50565b60006000610871610cc4565b156109d257600260005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000857bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000505491508560ff1660020a6001029050821561095b57808217600260005060008773ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600050819055506109cd565b61096481610ae3565b8216600260005060008773ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600050819055505b6109d7565b610002565b5b505050505050565b6109e8610cc4565b15610a7c5781600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600060006101000a81548160ff02191690830217905550808273ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a3610a81565b610002565b5b5050565b6000610aa182600360019054906101000a900460ff16610b17565b9050610aa8565b919050565b610ab5610cc4565b15610ada57610ad581600360029054906101000a900460ff166000610718565b610adf565b610002565b5b50565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60010282189050610b12565b919050565b600060006000610b2685610530565b91508360ff1660020a60010290508082166000191660006001026000191614159250610b4d565b505092915050565b610b5d610cc4565b15610b8257610b7d81600360029054906101000a900460ff166001610718565b610b87565b610002565b5b50565b6000600260005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060005054600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054166000191660006001026000191614159050610c37565b9392505050565b600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000610c7f82600360029054906101000a900460ff16610b17565b9050610c86565b919050565b600060009054906101000a900460ff1681565b600360029054906101000a900460ff1681565b600360009054906101000a900460ff1681565b60006000600060009054906101000a900460ff161415610d3657600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16149050610e6e565b6001600060009054906101000a900460ff161415610e6957600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b700961333306000357fffffffff0000000000000000000000000000000000000000000000000000000016604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200193505050506020604051808303816000876161da5a03f11561000257505050604051805190602001509050610e6e565b610002565b9056'
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
            'name': 'authority',
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
        'bytecode': '606060405260405180807f7472616e7366657228616464726573732c75696e74323536290000000000000081526020015060190190506040518091039020600760006101000a81548163ffffffff02191690837c0100000000000000000000000000000000000000000000000000000000900402179055506040516040806123d0833981016040528080519060200190919080519060200190919050505b5b60005b80600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550806002600050819055505b5033600360016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506000600360006101000a81548160ff0219169083021790555060003373ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a35b81600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550806005600050819055505b505061221c806101b46000396000f360606040523615610171576000357c010000000000000000000000000000000000000000000000000000000090048063048cfe321461017e578063095ea7b3146101af5780630a17d71d146101e657806315aa15be1461020757806318160ddd1461022857806323b872dd1461024b5780634420e4861461028b57806344654c2e146102bf57806351be13b5146102f457806352f6747a146103205780636000ee1d146103475780636a1ae03d1461035f5780636a3ed2f3146103a15780636bb52a8e146103cc57806370a08231146104015780637e1db2a11461042d5780638da5cb5b1461044e578063a9059cbb14610487578063ba80794e146104be578063bf7e214f146104ea578063c2205ee114610523578063c26a51661461055c578063cb38727f14610595578063cb976066146105b6578063d36f8469146105d7578063d551f60114610619578063d5c4b87a1461063c578063dd62ed3e14610668578063ed435e581461069d57610171565b61017c5b610002565b565b005b61019460048080359060200190919050506106c0565b604051808262ffffff16815260200191505060405180910390f35b6101ce600480803590602001909190803590602001909190505061070a565b60405180821515815260200191505060405180910390f35b61020560048080359060200190919080359060200190919050506107de565b005b610226600480803590602001909190803590602001909190505061085b565b005b61023560048050506108b7565b6040518082815260200191505060405180910390f35b61027360048080359060200190919080359060200190919080359060200190919050506108c9565b60405180821515815260200191505060405180910390f35b6102a16004808035906020019091905050610a24565b604051808265ffffffffffff16815260200191505060405180910390f35b6102de6004808035906020019091908035906020019091905050610c2a565b6040518082815260200191505060405180910390f35b61030a600480803590602001909190505061105f565b6040518082815260200191505060405180910390f35b61032d600480505061109d565b604051808260001916815260200191505060405180910390f35b61035d60048080359060200190919050506110a6565b005b610375600480803590602001909190505061117c565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103ae60048050506111d7565b604051808265ffffffffffff16815260200191505060405180910390f35b6103eb60048080359060200190919080359060200190919050506111ec565b6040518082815260200191505060405180910390f35b6104176004808035906020019091905050611629565b6040518082815260200191505060405180910390f35b61044c6004808035906020019091908035906020019091905050611667565b005b61045b600480505061170d565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6104a660048080359060200190919080359060200190919050506117a6565b60405180821515815260200191505060405180910390f35b6104d460048080359060200190919050506118ff565b6040518082815260200191505060405180910390f35b6104f7600480505061193d565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610530600480505061196c565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6105696004805050611992565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6105b460048080359060200190919080359060200190919050506119b8565b005b6105d56004808035906020019091908035906020019091905050611a14565b005b6105ed6004808035906020019091905050611a80565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6106266004805050611adb565b6040518082815260200191505060405180910390f35b6106526004808035906020019091905050611aee565b6040518082815260200191505060405180910390f35b6106876004808035906020019091908035906020019091905050611b2c565b6040518082815260200191505060405180910390f35b6106aa6004805050611b95565b6040518082815260200191505060405180910390f35b600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5060000160149054906101000a900462ffffff169050610705565b919050565b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a3600190506107d8565b92915050565b6107ea60003414611ba1565b6107f2611bb1565b15610851578060066000508365ffffffffffff16815481101561000257906000526020600020906005020160005b5060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550610856565b610002565b5b5050565b61086760003414611ba1565b61086f611bb1565b156108ad578060066000508365ffffffffffff16815481101561000257906000526020600020906005020160005b50600201600050819055506108b2565b610002565b5b5050565b600060026000505490506108c6565b90565b60006108d3611bb1565b15610a175782826109fd600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b70096138430600760009054906101000a90047c010000000000000000000000000000000000000000000000000000000002604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150611ba1565b610a08868686611d5e565b92505050610a1d565050610a1c565b610002565b5b9392505050565b6000610a3260003414611ba1565b610a3a611bb1565b15610c1f57600160066000508054806001018281815481835581811511610b1757600502816005028360005260206000209182019101610b169190610a7a565b80821115610b125760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549062ffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600050600090556003820160005060009055600482016000506000905550600501610a7a565b5090565b5b5050509190906000526020600020906005020160005b60c060405190810160405280878152602001600081526020016000815260200160008152602001600081526020016000815260200150909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060208201518160000160146101000a81548162ffffff0219169083021790555060408201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550606082015181600201600050556080820151816003016000505560a082015181600401600050555050039050610c2556610c24565b610002565b5b919050565b6000600060006000610c3a611bb1565b156110505785600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b509050610cca600073ffffffffffffffffffffffffffffffffffffffff168260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611ba1565b610d27600073ffffffffffffffffffffffffffffffffffffffff168260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611ba1565b610d4c60008260000160149054906101000a900462ffffff1662ffffff161415611ba1565b610d5860003414611ba1565b610d71600360159054906101000a900460ff1615611ba1565b6001600360156101000a81548160ff0219169083021790555060066000508865ffffffffffff16815481101561000257906000526020600020906005020160005b509450610df6610df1600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505489611f99565b611ba1565b86600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082828250540392505081905550610e49610e4460026000505489611f99565b611ba1565b866002600082828250540392505081905550610e74610e6f866003016000505489611f99565b611ba1565b8685600301600082828250540392505081905550610ea48560000160149054906101000a900462ffffff16611fac565b93508460020160005054840484039250610ec6610ec18885612072565b611ba1565b670de0b6b3a76400008388020495508550610fd68560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd8760010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16338a604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150611ba1565b610ff0856004016000505486600301600050541115611ba1565b611030600260005054600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541115611ba1565b6000600360156101000a81548160ff021916908302179055505050611055565b610002565b5b50505092915050565b600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b50600401600050549050611098565b919050565b60056000505481565b6110b260003414611ba1565b6110ba611bb1565b156111735760066000508165ffffffffffff16815481101561000257906000526020600020906005020160005b6000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549062ffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556002820160005060009055600382016000506000905560048201600050600090555050611178565b610002565b5b50565b600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506111d2565b919050565b600060066000508054905090506111e9565b90565b60006000600060006111fc611bb1565b1561161a5785600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b50905061128c600073ffffffffffffffffffffffffffffffffffffffff168260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611ba1565b6112e9600073ffffffffffffffffffffffffffffffffffffffff168260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611ba1565b61130e60008260000160149054906101000a900462ffffff1662ffffff161415611ba1565b61131a60003414611ba1565b611333600360159054906101000a900460ff1615611ba1565b6001600360156101000a81548160ff0219169083021790555060066000508865ffffffffffff16815481101561000257906000526020600020906005020160005b5094506114768560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd338860010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168b604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150611ba1565b6114928560000160149054906101000a900462ffffff16611fac565b935084600201600050548404840192506114bc6114b7670de0b6b3a764000089612072565b611ba1565b8287670de0b6b3a764000002049550855061150e611509600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505488612099565b611ba1565b85600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054019250508190555061156161155c60026000505488612099565b611ba1565b85600260008282825054019250508190555061158c611587866003016000505488612099565b611ba1565b85856003016000828282505401925050819055506115ba856004016000505486600301600050541115611ba1565b6115fa600260005054600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541115611ba1565b6000600360156101000a81548160ff02191690830217905550505061161f565b610002565b5b50505092915050565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050611662565b919050565b61166f611bb1565b156117035781600360016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600360006101000a81548160ff02191690830217905550808273ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a3611708565b610002565b5b5050565b6000600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663c2205ee1604051817c01000000000000000000000000000000000000000000000000000000000281526004018090506020604051808303816000876161da5a03f115610002575050506040518051906020015090506117a3565b90565b60006117b0611bb1565b156118f35782826118da600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b70096138430600760009054906101000a90047c010000000000000000000000000000000000000000000000000000000002604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150611ba1565b6118e485856120ae565b925050506118f95650506118f8565b610002565b5b92915050565b600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b50600201600050549050611938565b919050565b6000600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050611969565b90565b600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6119c460003414611ba1565b6119cc611bb1565b15611a0a578060066000508365ffffffffffff16815481101561000257906000526020600020906005020160005b5060040160005081905550611a0f565b610002565b5b5050565b611a2060003414611ba1565b611a28611bb1565b15611a76578060066000508365ffffffffffff16815481101561000257906000526020600020906005020160005b5060000160146101000a81548162ffffff02191690830217905550611a7b565b610002565b5b5050565b600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050611ad6565b919050565b600360009054906101000a900460ff1681565b600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b50600301600050549050611b27565b919050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050611b8f565b92915050565b670de0b6b3a764000081565b801515611bad57610002565b5b50565b60006000600360009054906101000a900460ff161415611c2357600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16149050611d5b565b6001600360009054906101000a900460ff161415611d5657600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b700961333306000357fffffffff0000000000000000000000000000000000000000000000000000000016604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200193505050506020604051808303816000876161da5a03f11561000257505050604051805190602001509050611d5b565b610002565b90565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015611d9c57610002565b81600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015611e0257610002565b611e3b600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505483612099565b1515611e4657610002565b81600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050611f92565b9392505050565b6000818310159050611fa6565b92915050565b600060006000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e1ac1a1185604051827c0100000000000000000000000000000000000000000000000000000000028152600401808262ffffff1681526020019150506040604051808303816000876161da5a03f11561000257505050604051805190602001805190602001509150915061205f81611ba1565b8160019004925061206b565b5050919050565b600060008284029050600084148061208b575082848204145b9150612092565b5092915050565b600082828401101590506120a8565b92915050565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410156120ec57610002565b612125600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505483612099565b151561213057610002565b81600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050612216565b9291505056'
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
                'name': 'coin',
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
        'bytecode': '6060604052613f7a806100126000396000f360606040526000357c01000000000000000000000000000000000000000000000000000000009004806306661abd1461004f578063a3def92314610072578063c6610657146100bd5761004d565b005b61005c60048050506100ff565b6040518082815260200191505060405180910390f35b6100916004808035906020019091908035906020019091905050610108565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6100d36004808035906020019091905050610378565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b60016000505481565b6000600083836040516123d0806104ca833901808373ffffffffffffffffffffffffffffffffffffffff1681526020018260001916815260200192505050604051809103906000f091508150816040516116e08061289a833901808273ffffffffffffffffffffffffffffffffffffffff168152602001915050604051809103906000f090508073ffffffffffffffffffffffffffffffffffffffff16637048027533604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506000604051808303816000876161da5a03f115610002575050508073ffffffffffffffffffffffffffffffffffffffff166320694db033604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506000604051808303816000876161da5a03f115610002575050508073ffffffffffffffffffffffffffffffffffffffff1663ac1e17df33604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506000604051808303816000876161da5a03f1156100025750505061031581336103b0565b61031f828261043d565b816000600050600060016000818150548092919060010191905055815260200190815260200160002060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b5092915050565b600060005060205280600052604060002060009150909054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b8173ffffffffffffffffffffffffffffffffffffffff16637e1db2a1826000604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506000604051808303816000876161da5a03f115610002575050505b5050565b8173ffffffffffffffffffffffffffffffffffffffff16637e1db2a1826001604051837c0100000000000000000000000000000000000000000000000000000000028152600401808373ffffffffffffffffffffffffffffffffffffffff168152602001828152602001925050506000604051808303816000876161da5a03f115610002575050505b505056606060405260405180807f7472616e7366657228616464726573732c75696e74323536290000000000000081526020015060190190506040518091039020600760006101000a81548163ffffffff02191690837c0100000000000000000000000000000000000000000000000000000000900402179055506040516040806123d0833981016040528080519060200190919080519060200190919050505b5b60005b80600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005081905550806002600050819055505b5033600360016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506000600360006101000a81548160ff0219169083021790555060003373ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a35b81600460006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550806005600050819055505b505061221c806101b46000396000f360606040523615610171576000357c010000000000000000000000000000000000000000000000000000000090048063048cfe321461017e578063095ea7b3146101af5780630a17d71d146101e657806315aa15be1461020757806318160ddd1461022857806323b872dd1461024b5780634420e4861461028b57806344654c2e146102bf57806351be13b5146102f457806352f6747a146103205780636000ee1d146103475780636a1ae03d1461035f5780636a3ed2f3146103a15780636bb52a8e146103cc57806370a08231146104015780637e1db2a11461042d5780638da5cb5b1461044e578063a9059cbb14610487578063ba80794e146104be578063bf7e214f146104ea578063c2205ee114610523578063c26a51661461055c578063cb38727f14610595578063cb976066146105b6578063d36f8469146105d7578063d551f60114610619578063d5c4b87a1461063c578063dd62ed3e14610668578063ed435e581461069d57610171565b61017c5b610002565b565b005b61019460048080359060200190919050506106c0565b604051808262ffffff16815260200191505060405180910390f35b6101ce600480803590602001909190803590602001909190505061070a565b60405180821515815260200191505060405180910390f35b61020560048080359060200190919080359060200190919050506107de565b005b610226600480803590602001909190803590602001909190505061085b565b005b61023560048050506108b7565b6040518082815260200191505060405180910390f35b61027360048080359060200190919080359060200190919080359060200190919050506108c9565b60405180821515815260200191505060405180910390f35b6102a16004808035906020019091905050610a24565b604051808265ffffffffffff16815260200191505060405180910390f35b6102de6004808035906020019091908035906020019091905050610c2a565b6040518082815260200191505060405180910390f35b61030a600480803590602001909190505061105f565b6040518082815260200191505060405180910390f35b61032d600480505061109d565b604051808260001916815260200191505060405180910390f35b61035d60048080359060200190919050506110a6565b005b610375600480803590602001909190505061117c565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6103ae60048050506111d7565b604051808265ffffffffffff16815260200191505060405180910390f35b6103eb60048080359060200190919080359060200190919050506111ec565b6040518082815260200191505060405180910390f35b6104176004808035906020019091905050611629565b6040518082815260200191505060405180910390f35b61044c6004808035906020019091908035906020019091905050611667565b005b61045b600480505061170d565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6104a660048080359060200190919080359060200190919050506117a6565b60405180821515815260200191505060405180910390f35b6104d460048080359060200190919050506118ff565b6040518082815260200191505060405180910390f35b6104f7600480505061193d565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610530600480505061196c565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6105696004805050611992565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6105b460048080359060200190919080359060200190919050506119b8565b005b6105d56004808035906020019091908035906020019091905050611a14565b005b6105ed6004808035906020019091905050611a80565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6106266004805050611adb565b6040518082815260200191505060405180910390f35b6106526004808035906020019091905050611aee565b6040518082815260200191505060405180910390f35b6106876004808035906020019091908035906020019091905050611b2c565b6040518082815260200191505060405180910390f35b6106aa6004805050611b95565b6040518082815260200191505060405180910390f35b600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5060000160149054906101000a900462ffffff169050610705565b919050565b600081600160005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a3600190506107d8565b92915050565b6107ea60003414611ba1565b6107f2611bb1565b15610851578060066000508365ffffffffffff16815481101561000257906000526020600020906005020160005b5060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550610856565b610002565b5b5050565b61086760003414611ba1565b61086f611bb1565b156108ad578060066000508365ffffffffffff16815481101561000257906000526020600020906005020160005b50600201600050819055506108b2565b610002565b5b5050565b600060026000505490506108c6565b90565b60006108d3611bb1565b15610a175782826109fd600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b70096138430600760009054906101000a90047c010000000000000000000000000000000000000000000000000000000002604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150611ba1565b610a08868686611d5e565b92505050610a1d565050610a1c565b610002565b5b9392505050565b6000610a3260003414611ba1565b610a3a611bb1565b15610c1f57600160066000508054806001018281815481835581811511610b1757600502816005028360005260206000209182019101610b169190610a7a565b80821115610b125760006000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549062ffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff021916905560028201600050600090556003820160005060009055600482016000506000905550600501610a7a565b5090565b5b5050509190906000526020600020906005020160005b60c060405190810160405280878152602001600081526020016000815260200160008152602001600081526020016000815260200150909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060208201518160000160146101000a81548162ffffff0219169083021790555060408201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550606082015181600201600050556080820151816003016000505560a082015181600401600050555050039050610c2556610c24565b610002565b5b919050565b6000600060006000610c3a611bb1565b156110505785600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b509050610cca600073ffffffffffffffffffffffffffffffffffffffff168260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611ba1565b610d27600073ffffffffffffffffffffffffffffffffffffffff168260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611ba1565b610d4c60008260000160149054906101000a900462ffffff1662ffffff161415611ba1565b610d5860003414611ba1565b610d71600360159054906101000a900460ff1615611ba1565b6001600360156101000a81548160ff0219169083021790555060066000508865ffffffffffff16815481101561000257906000526020600020906005020160005b509450610df6610df1600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505489611f99565b611ba1565b86600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082828250540392505081905550610e49610e4460026000505489611f99565b611ba1565b866002600082828250540392505081905550610e74610e6f866003016000505489611f99565b611ba1565b8685600301600082828250540392505081905550610ea48560000160149054906101000a900462ffffff16611fac565b93508460020160005054840484039250610ec6610ec18885612072565b611ba1565b670de0b6b3a76400008388020495508550610fd68560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd8760010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16338a604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150611ba1565b610ff0856004016000505486600301600050541115611ba1565b611030600260005054600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541115611ba1565b6000600360156101000a81548160ff021916908302179055505050611055565b610002565b5b50505092915050565b600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b50600401600050549050611098565b919050565b60056000505481565b6110b260003414611ba1565b6110ba611bb1565b156111735760066000508165ffffffffffff16815481101561000257906000526020600020906005020160005b6000820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556000820160146101000a81549062ffffff02191690556001820160006101000a81549073ffffffffffffffffffffffffffffffffffffffff02191690556002820160005060009055600382016000506000905560048201600050600090555050611178565b610002565b5b50565b600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506111d2565b919050565b600060066000508054905090506111e9565b90565b60006000600060006111fc611bb1565b1561161a5785600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b50905061128c600073ffffffffffffffffffffffffffffffffffffffff168260000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611ba1565b6112e9600073ffffffffffffffffffffffffffffffffffffffff168260010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415611ba1565b61130e60008260000160149054906101000a900462ffffff1662ffffff161415611ba1565b61131a60003414611ba1565b611333600360159054906101000a900460ff1615611ba1565b6001600360156101000a81548160ff0219169083021790555060066000508865ffffffffffff16815481101561000257906000526020600020906005020160005b5094506114768560000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166323b872dd338860010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff168b604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff16815260200182815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150611ba1565b6114928560000160149054906101000a900462ffffff16611fac565b935084600201600050548404840192506114bc6114b7670de0b6b3a764000089612072565b611ba1565b8287670de0b6b3a764000002049550855061150e611509600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505488612099565b611ba1565b85600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054019250508190555061156161155c60026000505488612099565b611ba1565b85600260008282825054019250508190555061158c611587866003016000505488612099565b611ba1565b85856003016000828282505401925050819055506115ba856004016000505486600301600050541115611ba1565b6115fa600260005054600060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541115611ba1565b6000600360156101000a81548160ff02191690830217905550505061161f565b610002565b5b50505092915050565b6000600060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050611662565b919050565b61166f611bb1565b156117035781600360016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600360006101000a81548160ff02191690830217905550808273ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a3611708565b610002565b5b5050565b6000600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663c2205ee1604051817c01000000000000000000000000000000000000000000000000000000000281526004018090506020604051808303816000876161da5a03f115610002575050506040518051906020015090506117a3565b90565b60006117b0611bb1565b156118f35782826118da600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b70096138430600760009054906101000a90047c010000000000000000000000000000000000000000000000000000000002604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200193505050506020604051808303816000876161da5a03f1156100025750505060405180519060200150611ba1565b6118e485856120ae565b925050506118f95650506118f8565b610002565b5b92915050565b600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b50600201600050549050611938565b919050565b6000600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050611969565b90565b600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6119c460003414611ba1565b6119cc611bb1565b15611a0a578060066000508365ffffffffffff16815481101561000257906000526020600020906005020160005b5060040160005081905550611a0f565b610002565b5b5050565b611a2060003414611ba1565b611a28611bb1565b15611a76578060066000508365ffffffffffff16815481101561000257906000526020600020906005020160005b5060000160146101000a81548162ffffff02191690830217905550611a7b565b610002565b5b5050565b600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b5060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050611ad6565b919050565b600360009054906101000a900460ff1681565b600060066000508265ffffffffffff16815481101561000257906000526020600020906005020160005b50600301600050549050611b27565b919050565b6000600160005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050611b8f565b92915050565b670de0b6b3a764000081565b801515611bad57610002565b5b50565b60006000600360009054906101000a900460ff161415611c2357600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16149050611d5b565b6001600360009054906101000a900460ff161415611d5657600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b700961333306000357fffffffff0000000000000000000000000000000000000000000000000000000016604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200193505050506020604051808303816000876161da5a03f11561000257505050604051805190602001509050611d5b565b610002565b90565b600081600060005060008673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015611d9c57610002565b81600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050541015611e0257610002565b611e3b600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505483612099565b1515611e4657610002565b81600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050611f92565b9392505050565b6000818310159050611fa6565b92915050565b600060006000600460009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663e1ac1a1185604051827c0100000000000000000000000000000000000000000000000000000000028152600401808262ffffff1681526020019150506040604051808303816000876161da5a03f11561000257505050604051805190602001805190602001509150915061205f81611ba1565b8160019004925061206b565b5050919050565b600060008284029050600084148061208b575082848204145b9150612092565b5092915050565b600082828401101590506120a8565b92915050565b600081600060005060003373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505410156120ec57610002565b612125600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505483612099565b151561213057610002565b81600060005060003373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282825054039250508190555081600060005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828282505401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050612216565b929150505660606040526000600360006101000a81548160ff021916908302179055506001600360016101000a81548160ff021916908302179055506002600360026101000a81548160ff021916908302179055506040516020806116e0833981016040528080519060200190919050505b5b33600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506000600060006101000a81548160ff0219169083021790555060003373ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a35b610157600360009054906101000a900460ff1682610150604060405190810160405280601181526020017f72656769737465722861646472657373290000000000000000000000000000008152602001506104d2565b6001610513565b6101b4600360009054906101000a900460ff16826101ad604060405190810160405280601881526020017f7365745661756c742875696e7434382c616464726573732900000000000000008152602001506104d2565b6001610513565b610211600360009054906101000a900460ff168261020a604060405190810160405280601681526020017f736574466565642875696e7434382c75696e74323429000000000000000000008152602001506104d2565b6001610513565b61026e600360009054906101000a900460ff1682610267604060405190810160405280601981526020017f7365745370726561642875696e7434382c75696e7432353629000000000000008152602001506104d2565b6001610513565b6102cb600360009054906101000a900460ff16826102c4604060405190810160405280601a81526020017f7365744365696c696e672875696e7434382c75696e74323536290000000000008152602001506104d2565b6001610513565b610328600360009054906101000a900460ff1682610321604060405190810160405280601281526020017f756e72656769737465722875696e7434382900000000000000000000000000008152602001506104d2565b6001610513565b610385600360019054906101000a900460ff168261037e604060405190810160405280601581526020017f69737375652875696e7434382c75696e743235362900000000000000000000008152602001506104d2565b6001610513565b6103e2600360019054906101000a900460ff16826103db604060405190810160405280601581526020017f636f7665722875696e7434382c75696e743235362900000000000000000000008152602001506104d2565b6001610513565b61043f600360029054906101000a900460ff1682610438604060405190810160405280601981526020017f7472616e7366657228616464726573732c75696e7432353629000000000000008152602001506104d2565b6001610513565b6104c2600360029054906101000a900460ff16826104bb606060405190810160405280602581526020017f7472616e7366657246726f6d28616464726573732c616464726573732c75696e81526020017f74323536290000000000000000000000000000000000000000000000000000008152602001506104d2565b6001610513565b5b50610e718061086f6000396000f35b600081604051808280519060200190808383829060006004602084601f0104600302600f01f1509050019150506040518091039020905061050e565b919050565b6000600061051f61068e565b1561068057600260005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000857bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000505491508560ff1660020a6001029050821561060957808217600260005060008773ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000508190555061067b565b6106128161083b565b8216600260005060008773ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600050819055505b610685565b610002565b5b505050505050565b60006000600060009054906101000a900460ff16141561070057600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16149050610838565b6001600060009054906101000a900460ff16141561083357600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b700961333306000357fffffffff0000000000000000000000000000000000000000000000000000000016604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200193505050506020604051808303816000876161da5a03f11561000257505050604051805190602001509050610838565b610002565b90565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6001028218905061086a565b919050566060604052361561012f576000357c01000000000000000000000000000000000000000000000000000000009004806306a36aee146101315780631d1438481461016157806320694db01461018757806324d7806c1461019f57806327538e90146101cd57806334becfb4146102065780634b8082151461021e57806362d91855146102a757806367aff484146102bf57806370480275146102e95780637d40583d146103015780637e1db2a114610334578063877b9a6714610355578063891ba7021461038357806393aa5ca81461039b578063a078f737146103cb578063ac1e17df14610402578063b70096131461041a578063c2205ee11461045a578063d4d7b19a14610493578063d551f601146104c1578063e534155d146104e4578063f851a4401461050a5761012f565b005b6101476004808035906020019091905050610530565b604051808260001916815260200191505060405180910390f35b61016e600480505061056e565b604051808260ff16815260200191505060405180910390f35b61019d6004808035906020019091905050610581565b005b6101b560048080359060200190919050506105d2565b60405180821515815260200191505060405180910390f35b6101ec60048080359060200190919080359060200190919050506105f9565b604051808260001916815260200191505060405180910390f35b61021c600480803590602001909190505061066b565b005b6102726004808035906020019082018035906020019191908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509090919050506106a1565b60405180827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200191505060405180910390f35b6102bd60048080359060200190919050506106e2565b005b6102e76004808035906020019091908035906020019091908035906020019091905050610718565b005b6102ff60048080359060200190919050506107f9565b005b6103326004808035906020019091908035906020019091908035906020019091908035906020019091905050610865565b005b61035360048080359060200190919080359060200190919050506109e0565b005b61036b6004808035906020019091905050610a86565b60405180821515815260200191505060405180910390f35b6103996004808035906020019091905050610aad565b005b6103b16004808035906020019091905050610ae3565b604051808260001916815260200191505060405180910390f35b6103ea6004808035906020019091908035906020019091905050610b17565b60405180821515815260200191505060405180910390f35b6104186004808035906020019091905050610b55565b005b6104426004808035906020019091908035906020019091908035906020019091905050610b8b565b60405180821515815260200191505060405180910390f35b6104676004805050610c3e565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6104a96004808035906020019091905050610c64565b60405180821515815260200191505060405180910390f35b6104ce6004805050610c8b565b6040518082815260200191505060405180910390f35b6104f16004805050610c9e565b604051808260ff16815260200191505060405180910390f35b6105176004805050610cb1565b604051808260ff16815260200191505060405180910390f35b6000600160005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050549050610569565b919050565b600360019054906101000a900460ff1681565b610589610cc4565b156105c9576105a981600360019054906101000a900460ff166001610718565b6105c481600360029054906101000a900460ff166001610718565b6105ce565b610002565b5b50565b60006105ed82600360009054906101000a900460ff16610b17565b90506105f4565b919050565b6000600260005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600050549050610665565b92915050565b610673610cc4565b156106985761069381600360019054906101000a900460ff166000610718565b61069d565b610002565b5b50565b600081604051808280519060200190808383829060006004602084601f0104600302600f01f150905001915050604051809103902090506106dd565b919050565b6106ea610cc4565b1561070f5761070a81600360009054906101000a900460ff166000610718565b610714565b610002565b5b50565b60006000610724610cc4565b156107ec57600160005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000505491508360ff1660020a600102905082156107a857808217600160005060008773ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055506107e7565b6107b181610ae3565b8216600160005060008773ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050819055505b6107f1565b610002565b5b5050505050565b610801610cc4565b1561085c5761082181600360009054906101000a900460ff166001610718565b61083c81600360019054906101000a900460ff166001610718565b61085781600360029054906101000a900460ff166001610718565b610861565b610002565b5b50565b60006000610871610cc4565b156109d257600260005060008673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000857bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020019081526020016000206000505491508560ff1660020a6001029050821561095b57808217600260005060008773ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600050819055506109cd565b61096481610ae3565b8216600260005060008773ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000867bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001908152602001600020600050819055505b6109d7565b610002565b5b505050505050565b6109e8610cc4565b15610a7c5781600060016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555080600060006101000a81548160ff02191690830217905550808273ffffffffffffffffffffffffffffffffffffffff167fb96a5204da93e5d7ddd5b0c2616fd5f76322b9c383c5010b94fdc3df11b7be5260405180905060405180910390a3610a81565b610002565b5b5050565b6000610aa182600360019054906101000a900460ff16610b17565b9050610aa8565b919050565b610ab5610cc4565b15610ada57610ad581600360029054906101000a900460ff166000610718565b610adf565b610002565b5b50565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60010282189050610b12565b919050565b600060006000610b2685610530565b91508360ff1660020a60010290508082166000191660006001026000191614159250610b4d565b505092915050565b610b5d610cc4565b15610b8257610b7d81600360029054906101000a900460ff166001610718565b610b87565b610002565b5b50565b6000600260005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506000837bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200190815260200160002060005054600160005060008673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005054166000191660006001026000191614159050610c37565b9392505050565b600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6000610c7f82600360029054906101000a900460ff16610b17565b9050610c86565b919050565b600060009054906101000a900460ff1681565b600360029054906101000a900460ff1681565b600360009054906101000a900460ff1681565b60006000600060009054906101000a900460ff161415610d3657600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16149050610e6e565b6001600060009054906101000a900460ff161415610e6957600060019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b700961333306000357fffffffff0000000000000000000000000000000000000000000000000000000016604051847c0100000000000000000000000000000000000000000000000000000000028152600401808473ffffffffffffffffffffffffffffffffffffffff1681526020018373ffffffffffffffffffffffffffffffffffffffff168152602001827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916815260200193505050506020604051808303816000876161da5a03f11561000257505050604051805190602001509050610e6e565b610002565b9056'
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

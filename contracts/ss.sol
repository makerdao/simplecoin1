contract SimpleStablecoin {
    bool _mutex; // manual, use caution
    address _owner;

    uint _exchange_price; // Number of wei for each 10**18 of your token
    uint _exchange_spread; // +- on price
    uint64 _exchange_expires; // don't trade when price info is stale
    uint _max_supply; // don't create more than this many stablecoins

    function SimpleStablecoin() {
        _owner = msg.sender;
    }
    function() {
        throw;
    }

    modifier noEther() {
        if(msg.value > 0) throw;
        _
    }
    modifier ownerOnly() {
        if(msg.sender != _owner) throw;
        _
    }
    function safeToAdd(uint a, uint b) internal returns (bool) {
        return (a + b >= a);
    }
    // For testing
    function getTime() internal returns (uint) {
        return block.timestamp;
    }

    /* == Owner Functions == */
    function updateOwner(address new_owner)
        noEther
        ownerOnly
    {
        _owner = new_owner;
    }
    function setPrice(uint price, uint spread, uint64 expires)
        noEther
        ownerOnly
    {
        _exchange_price = price;
        _exchange_spread = spread;
        _exchange_expires = expires;
    }
    function setMaxSupply(uint max_supply)
        noEther
        ownerOnly
    {
        _max_supply = max_supply;
    }
    function deposit()
        ownerOnly
    { /* Accept ether from owner */ }

    function withdraw(uint quantity)
        noEther
        ownerOnly
    {
        if( _mutex ) { throw; }
        _mutex = true;
        _owner.call.value(quantity)();
        _mutex = false;
    }

    //== User functions: purchase/redeem stablecoin
    function purchase() returns (uint purchased_quantity)
    {
        purchased_quantity = 10**18 * msg.value / (_exchange_price+_exchange_spread);
        if(!safeToAdd(_balances[msg.sender], purchased_quantity))
            throw;
        if(!safeToAdd(_supply, purchased_quantity))
            throw;
        _balances[msg.sender] += purchased_quantity;
        _supply += purchased_quantity;
        if( _supply > _max_supply ) throw;
        return purchased_quantity;
    }
    function redeem(uint stablecoin_quantity)
        noEther
        returns (uint returned_ether)
    {
        if( _balances[msg.sender] < stablecoin_quantity )
            throw;
        _balances[msg.sender] -= stablecoin_quantity;
        _supply -= stablecoin_quantity;
        returned_ether = (stablecoin_quantity * (_exchange_price-_exchange_spread)) / (10**18);
        if( !msg.sender.call.value(returned_ether)() ) {
            throw;
        }
        return returned_ether;
    }


    //== Getters
    function getOwner() constant returns (address) { return _owner; }


    // ERC20 token implementation.
    // Cross-reference other token implementations:
    //   https://github.com/nexusdev/erc20/blob/master/contracts/base.sol
    //   https://github.com/ConsenSys/Tokens/blob/master/Token_Contracts/contracts/StandardToken.sol
    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
    mapping( address => uint ) _balances;
    mapping( address => mapping( address => uint ) ) _approvals;
    uint _supply;
    function totalSupply() constant returns (uint supply) {
        return _supply;
    }
    function balanceOf( address who ) constant returns (uint value) {
        return _balances[who];
    }
    function transfer( address to, uint value) returns (bool ok) {
        if( _balances[msg.sender] < value ) {
            throw;
        }
        if( !safeToAdd(_balances[to], value) ) {
            throw;
        }
        _balances[msg.sender] -= value;
        _balances[to] += value;
        Transfer( msg.sender, to, value );
        return true;
    }
    function transferFrom( address from, address to, uint value) returns (bool ok) {
        // if you don't have enough balance, throw
        if( _balances[from] < value ) {
            throw;
        }
        // if you don't have approval, throw
        if( _approvals[from][msg.sender] < value ) {
            throw;
        }
        if( !safeToAdd(_balances[to], value) ) {
            throw;
        }
        // transfer and return true
        _approvals[from][msg.sender] -= value;
        _balances[from] -= value;
        _balances[to] += value;
        Transfer( from, to, value );
        return true;
    }
    function approve(address spender, uint value) returns (bool ok) {
        _approvals[msg.sender][spender] = value;
        Approval( msg.sender, spender, value );
        return true;
    }
    function allowance(address owner, address spender) constant returns (uint _allowance) {
        return _approvals[owner][spender];
    }
}

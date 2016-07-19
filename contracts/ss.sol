import 'erc20/erc20.sol';

contract SimpleStablecoin {
    address _owner;
    bytes32 _rules; // owner promises to follow these rules, or else suffer reddit flaming

    CollateralType[] _types;
    TradeWindow[] _orders;

    mapping(address => bool) _whitelist; // owner should know issuers/redeemers
    modifier whitelisted(address who) {
        if( _whitelist[who] ) { _ } else { throw; }
    }

    struct CollateralType {
        ERC20 token;
        address vault; // where locked tokens are held
        uint current_debt;
        uint max_debt;
    }

    struct TradeWindow {
        uint col_type;
        uint price; // Number of wei for each 10**18 of your token
        uint spread; // +- on price
        uint64 expiration; // don't trade when price info is stale
    }


    function SimpleStablecoin(bytes32 rules) {
        _owner = msg.sender;
        _rules = rules;
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

    // WARNING: Must manually confirm that no function with a `mutex` modifier
    //          has a `return` statement, or else mutex gets stuck !!
    bool _mutex;
    modifier mutex() {
         if( _mutex ) { throw; }
        _mutex = true;
        _
        _mutex = false;
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
    function setMaxDebt(uint collateral_type, uint max_debt)
        noEther
        ownerOnly
    {
        _types[collateral_type].max_debt = max_debt;
    }
    function startTradeWindow(uint col_type, uint price, uint spread, uint64 expiration)
        noEther
        ownerOnly
        returns (uint window_id)
    {
        return _orders.push(TradeWindow({
            col_type: col_type,
            price: price,
            spread: spread,
            expiration: expiration
        }));
    }
    function cancelTradeWindow(uint window_id)
        noEther
        ownerOnly
    {
        _orders[window_id].expiration = 0;
    }


    function registerCollateralType(ERC20 token, address vault) returns (uint id) {
        return _types.push(CollateralType({
            token: token,
            vault: vault,
            current_debt: 0,
            max_debt: 0
        }));
    }

    function withdraw(uint collateral, uint quantity)
        noEther
        ownerOnly
        mutex
    {
        var token = _types[collateral].token;
        var vault = _types[collateral].vault;
        token.transferFrom(vault, msg.sender, quantity);
    }

    //== User functions: purchase/redeem stablecoin
    function purchase(uint collateral_window, uint pay_how_much)
        whitelisted(msg.sender)
        noEther
        mutex
        returns (uint purchased_quantity)
    {
        var window = _orders[collateral_window];
        var t = _types[window.col_type];
        if( !t.token.transferFrom(msg.sender, t.vault, pay_how_much) ) {
            throw;
        }
        purchased_quantity = 10**18 * pay_how_much / (window.price+window.spread);
        if(!safeToAdd(_balances[msg.sender], purchased_quantity))
            throw;
        if(!safeToAdd(_supply, purchased_quantity))
            throw;
        _balances[msg.sender] += purchased_quantity;
        _supply += purchased_quantity;
        t.current_debt += purchased_quantity;
        if( t.current_debt > t.max_debt ) throw;
    }
    function redeem(uint collateral_window, uint stablecoin_quantity)
        whitelisted(msg.sender)
        noEther
        mutex
        returns (uint returned_amount)
    {
        var window = _orders[collateral_window];
        var t = _types[window.col_type];

        if( _balances[msg.sender] < stablecoin_quantity )
            throw;
        _balances[msg.sender] -= stablecoin_quantity;
        _supply -= stablecoin_quantity;
        t.current_debt -= stablecoin_quantity;
        returned_amount = (stablecoin_quantity * (window.price-window.spread)) / (10**18);
        if( !t.token.transferFrom(t.vault, msg.sender, returned_amount) ) {
            throw;
        }
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

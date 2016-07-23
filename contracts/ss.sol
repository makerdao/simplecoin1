import 'erc20/erc20.sol';
import 'erc20/base.sol';
import 'feedbase/feedbase.sol';

contract SimpleStablecoin is ERC20Base(0) {
    address _owner;
    bytes32 _rules; // owner promises to follow these rules, or else suffer reddit flaming
    Feedbase _feedbase;

    CollateralType[] _types;
    struct CollateralType {
        ERC20 token;
        uint24 pricefeed; // Number of wei for each 10**18 of your token
        address vault; // where locked tokens are held
        uint spread;
        uint current_debt;
        uint max_debt;
    }

    function SimpleStablecoin(Feedbase fb, bytes32 rules) {
        _owner = msg.sender;
        _rules = rules;
        _feedbase = fb;
    }
    function() {
        throw;
    }

    modifier noEther() {
        if(msg.value == 0) { _ } else { throw; }
    }
    modifier ownerOnly() {
        if(msg.sender == _owner) { _ } else { throw; }
    }

    mapping(address => bool) _whitelist; // owner should know issuers/redeemers
    modifier whitelisted(address who) {
        if( _whitelist[who] ) { _ } else { throw; }
    }

    function setWhitelist(address who, bool what)
        noEther
        ownerOnly
    {
        _whitelist[who] = what;
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
    function setFeed(uint col_type, uint24 feed_id)
        noEther
        ownerOnly
    {
        _types[col_type].pricefeed = feed_id;
    }

    function registerCollateralType(ERC20 token, address vault, uint24 pricefeed, uint spread)
        returns (uint id)
    {
        return _types.push(CollateralType({
            token: token,
            vault: vault,
            pricefeed: pricefeed,
            spread: spread,
            current_debt: 0,
            max_debt: 0
        })) - 1;
    }
    function cancelCollateralType(uint collateral_type)
        noEther
        ownerOnly
    {
        delete _types[collateral_type];
    }

    //== User functions: purchase/redeem stablecoin
    function purchase(uint collateral_type, uint pay_how_much)
        whitelisted(msg.sender)
        noEther
        mutex
        returns (uint purchased_quantity)
    {
        var t = _types[collateral_type];
        if( t.token == address(0) ) { // deleted
            throw;
        }
        if( !t.token.transferFrom(msg.sender, t.vault, pay_how_much) ) {
            throw;
        }
        var (price, ok) = _feedbase.get(t.pricefeed);
        if( !ok ) { throw; }
        purchased_quantity = 10**18 * pay_how_much / (uint(price)+(uint(price)/t.spread));
        if(!safeToAdd(_balances[msg.sender], purchased_quantity))
            throw;
        if(!safeToAdd(_supply, purchased_quantity))
            throw;
        _balances[msg.sender] += purchased_quantity;
        _supply += purchased_quantity;
        t.current_debt += purchased_quantity;
        if( t.current_debt > t.max_debt ) { throw; }
    }
    function redeem(uint collateral_type, uint stablecoin_quantity)
        whitelisted(msg.sender)
        noEther
        mutex
        returns (uint returned_amount)
    {
        var t = _types[collateral_type];
        if( t.token == address(0) ) { // deleted
            throw;
        }
        var (price, ok) = _feedbase.get(t.pricefeed);
        if( !ok ) { throw; }
        if( _balances[msg.sender] < stablecoin_quantity )
            throw;
        _balances[msg.sender] -= stablecoin_quantity;
        _supply -= stablecoin_quantity;
        t.current_debt -= stablecoin_quantity;
        returned_amount = (stablecoin_quantity * (uint(price)-(uint(price)/t.spread))) / (10**18);
        if( !t.token.transferFrom(t.vault, msg.sender, returned_amount) ) {
            throw;
        }
    }


    //== Getters
    function getOwner() constant returns (address) { return _owner; }


}

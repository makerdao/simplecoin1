import 'erc20/erc20.sol';
import 'erc20/base.sol';
import 'feedbase/feedbase.sol';
import 'ds-whitelist/whitelist.sol';

contract Sensible {
    function() {
        throw;
    }

    function assert(bool condition) internal {
        if (!condition) throw;
    }

    modifier noEther() {
        assert(msg.value == 0);
        _
    }

    // WARNING: Must manually confirm that no function with a `mutex` modifier
    //          has a `return` statement, or else mutex gets stuck !!
    bool _mutex;
    modifier mutex() {
        assert(!_mutex);
        _mutex = true;
        _
        _mutex = false;
    }

    function safeToAdd(uint a, uint b) internal returns (bool) {
        return (a + b >= a);
    }

    function safeToSub(uint a, uint b) internal returns (bool) {
        return (a >= b);
    }

    function safeToMul(uint a, uint b) internal returns (bool) {
        var c = a * b;
        return (a == 0 || c / a == b);
    }
}

contract SimpleStablecoin is ERC20Base(0)
                           , DSAuth
                           , Sensible
{
    address _owner;
    bytes32 _rules;
    Feedbase _feedbase;
    mapping (address => bool) public whitelist;

    // uses two whitelists instead of a GroupAuthority... for now
    Whitelist _issuer_whitelist;
    Whitelist _transfer_whitelist;

    uint public constant UNIT = 10 ** 18;

    CollateralType[] _types;
    struct CollateralType {
        ERC20 token;
        uint24 feedID; // Number of tokens for each UNIT of stablecoin
        address vault; // where locked tokens are held
        uint spread;
        uint current_debt;
        uint max_debt;
    }

    function SimpleStablecoin( Feedbase fb, bytes32 rules
                             , Whitelist issuer_whitelist
                             , Whitelist transfer_whitelist )
    {
        _owner = msg.sender;
        _feedbase = fb;
        _rules = rules;
        _issuer_whitelist = issuer_whitelist;
        _transfer_whitelist = transfer_whitelist;
    }
    function owner() constant returns (address) { return _owner; }
    function rules() constant returns (bytes32) { return _rules; }
    function feedbase() constant returns (address) { return _feedbase; }
    function type_count() constant returns (uint) { return _types.length; }


    function token(uint type_id) constant returns (ERC20) {
       return _types[type_id].token;
    }

    function feed(uint type_id) constant returns (uint24) {
       return _types[type_id].feedID;
    }

    function vault(uint type_id) constant returns (address) {
       return _types[type_id].vault;
    }

    function spread(uint type_id) constant returns (uint) {
       return _types[type_id].spread;
    }

    function current_debt(uint type_id) constant returns (uint) {
       return _types[type_id].current_debt;
    }

    function max_debt(uint type_id) constant returns (uint) {
       return _types[type_id].max_debt;
    }

    function getPrice(uint24 feedID) internal returns (uint) {
        var (price, ok) = _feedbase.get(feedID);
        assert(ok);
        return uint(price);
    }

    function() {
        throw;
    }

    // For testing
    function getTime() internal returns (uint) {
        return block.timestamp;
    }

    /* == Owner Functions == */
    function setWhitelist(address who, bool what)
        noEther
        auth
    {
        whitelist[who] = what;
    }
    function updateOwner(address new_owner)
        noEther
        auth
    {
        _owner = new_owner;
    }
    function setMaxDebt(uint collateral_type, uint max_debt)
        noEther
        auth
    {
        _types[collateral_type].max_debt = max_debt;
    }
    function setFeed(uint col_type, uint24 feed_id)
        noEther
        auth
    {
        _types[col_type].feedID = feed_id;
    }
    function setSpread(uint col_type, uint spread)
        noEther
        auth
    {
        _types[col_type].spread = spread;
    }

    function registerCollateralType(ERC20 token, address vault, uint24 feedID, uint spread)
        noEther
        auth
        returns (uint id)
    {
        return _types.push(CollateralType({
            token: token,
            vault: vault,
            feedID: feedID,
            spread: spread,
            current_debt: 0,
            max_debt: 0
        })) - 1;
    }
    function cancelCollateralType(uint collateral_type)
        noEther
        auth
    {
        delete _types[collateral_type];
    }

    modifier issuers_only() {
        if( _issuer_whitelist.isWhitelisted(msg.sender) ) {
            _
        } else {
            throw;
        }
    }

    modifier transfer_whitelist(address who) {
        if( _transfer_whitelist.isWhitelisted(who) ) {
            _
        } else {
            throw;
        }
    }

    function transfer(address to, uint amount)
        transfer_whitelist(msg.sender)
        transfer_whitelist(to)
        returns (bool)
    {
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint amount)
        transfer_whitelist(from)
        transfer_whitelist(to)
        returns (bool)
    {
        return super.transferFrom(from, to, amount);
    }

    //== User functions: purchase/redeem stablecoin
    function purchase(uint collateral_type, uint pay_how_much)
        issuers_only
        noEther
        mutex
        returns (uint purchased_quantity)
    {
        var t = _types[collateral_type];
        assert(t.token != address(0));  // deleted

        assert(t.token.transferFrom(msg.sender, t.vault, pay_how_much));

        var price = getPrice(t.feedID);
        var mark_price = price + price / t.spread;
        assert(safeToMul(UNIT, pay_how_much));
        purchased_quantity = (UNIT * pay_how_much) / mark_price;

        assert(safeToAdd(_balances[msg.sender], purchased_quantity));
        _balances[msg.sender] += purchased_quantity;

        assert(safeToAdd(_supply, purchased_quantity));
        _supply += purchased_quantity;

        assert(safeToAdd(t.current_debt, purchased_quantity));
        t.current_debt += purchased_quantity;

        assert(t.current_debt <= t.max_debt);
        assert(_balances[msg.sender] <= _supply);
    }
    function redeem(uint collateral_type, uint stablecoin_quantity)
        issuers_only
        noEther
        mutex
        returns (uint returned_amount)
    {
        var t = _types[collateral_type];
        assert(t.token != address(0));  // deleted

        assert(safeToSub(_balances[msg.sender], stablecoin_quantity));
        _balances[msg.sender] -= stablecoin_quantity;

        assert(safeToSub(_supply, stablecoin_quantity));
        _supply -= stablecoin_quantity;

        assert(safeToSub(t.current_debt, stablecoin_quantity));
        t.current_debt -= stablecoin_quantity;

        var price = getPrice(t.feedID);
        var mark_price = price - price / t.spread;
        assert(safeToMul(stablecoin_quantity, mark_price));
        returned_amount = (stablecoin_quantity * mark_price) / UNIT;

        assert(t.token.transferFrom(t.vault, msg.sender, returned_amount));

        assert(t.current_debt <= t.max_debt);
        assert(_balances[msg.sender] <= _supply);
    }
}

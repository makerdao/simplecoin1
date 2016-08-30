import "ds-whitelist/whitelist.sol";
import "erc20/base.sol";
import "erc20/erc20.sol";
import "feedbase/feedbase.sol";
import "sensible.sol";

contract SimpleStablecoin is ERC20Base(0), DSAuth, Sensible {
    address    public  owner;
    bytes32    public  rules;
    Feedbase   public  feedbase;

    // Uses two whitelists instead of a GroupAuthority... for now
    Whitelist  public  issuers;
    Whitelist  public  holders;

    uint public constant UNIT = 10**18;

    CollateralType[] types;

    struct CollateralType {
        ERC20    token;
        uint24   feed;           // Tokens for each UNIT of stablecoin
        address  vault;
        uint     spread;
        uint     debt;
        uint     ceiling;
    }

    function SimpleStablecoin(
        Feedbase   _feedbase,
        bytes32    _rules,
        Whitelist  _issuers,
        Whitelist  _holders
    ) {
        owner    = msg.sender;
        feedbase = _feedbase;
        rules    = _rules;
        issuers  = _issuers;
        holders  = _holders;
    }

    function nextType() constant returns (uint48) {
        return uint48(types.length);
    }

    function token(uint48 type_id) constant returns (ERC20) {
       return types[type_id].token;
    }

    function feed(uint48 type_id) constant returns (uint24) {
       return types[type_id].feed;
    }

    function vault(uint48 type_id) constant returns (address) {
       return types[type_id].vault;
    }

    function spread(uint48 type_id) constant returns (uint) {
       return types[type_id].spread;
    }

    function debt(uint48 type_id) constant returns (uint) {
       return types[type_id].debt;
    }

    function ceiling(uint48 type_id) constant returns (uint) {
       return types[type_id].ceiling;
    }

    function getPrice(uint24 feed) internal returns (uint) {
        var (price, ok) = feedbase.get(feed);
        assert(ok);
        return uint(price);
    }

    function getTime() internal returns (uint) {
        return block.timestamp;
    }

    function setOwner(address new_owner) noEther auth {
        owner = new_owner;
    }

    function setCeiling(uint48 type_id, uint ceiling) noEther auth {
        types[type_id].ceiling = ceiling;
    }

    function setFeed(uint48 type_id, uint24 feed) noEther auth {
        types[type_id].feed = feed;
    }

    function setSpread(uint48 type_id, uint spread) noEther auth {
        types[type_id].spread = spread;
    }

    function register(ERC20 token, address vault, uint24 feed, uint spread)
        noEther auth returns (uint48 id)
    {
        return uint48(types.push(CollateralType({
            token:    token,
            vault:    vault,
            feed:     feed,
            spread:   spread,
            debt:     0,
            ceiling:  0
        })) - 1);
    }

    function unregister(uint48 collateral_type) noEther auth {
        delete types[collateral_type];
    }

    modifier auth_issuer() {
        assert(issuers.isWhitelisted(msg.sender));
        _
    }

    modifier auth_holder(address who) {
        assert(holders.isWhitelisted(who));
        _
    }

    function transfer(address to, uint amount)
        auth_holder(msg.sender) auth_holder(to) returns (bool)
    {
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint amount)
        auth_holder(from) auth_holder(to) returns (bool)
    {
        return super.transferFrom(from, to, amount);
    }

    function issue(uint48 collateral_type, uint pay_how_much)
        auth_issuer noEther mutex returns (uint issued_quantity)
    {
        var t = types[collateral_type];
        assert(t.token != address(0));  // deleted

        assert(t.token.transferFrom(msg.sender, t.vault, pay_how_much));

        var price = getPrice(t.feed);
        var mark_price = price + price / t.spread;
        assert(safeToMul(UNIT, pay_how_much));
        issued_quantity = (UNIT * pay_how_much) / mark_price;

        assert(safeToAdd(_balances[msg.sender], issued_quantity));
        _balances[msg.sender] += issued_quantity;

        assert(safeToAdd(_supply, issued_quantity));
        _supply += issued_quantity;

        assert(safeToAdd(t.debt, issued_quantity));
        t.debt += issued_quantity;

        assert(t.debt <= t.ceiling);
        assert(_balances[msg.sender] <= _supply);
    }

    function cover(uint48 collateral_type, uint stablecoin_quantity)
        auth_issuer noEther mutex returns (uint returned_amount)
    {
        var t = types[collateral_type];
        assert(t.token != address(0));  // deleted

        assert(safeToSub(_balances[msg.sender], stablecoin_quantity));
        _balances[msg.sender] -= stablecoin_quantity;

        assert(safeToSub(_supply, stablecoin_quantity));
        _supply -= stablecoin_quantity;

        assert(safeToSub(t.debt, stablecoin_quantity));
        t.debt -= stablecoin_quantity;

        var price = getPrice(t.feed);
        var mark_price = price - price / t.spread;
        assert(safeToMul(stablecoin_quantity, mark_price));
        returned_amount = (stablecoin_quantity * mark_price) / UNIT;

        assert(t.token.transferFrom(t.vault, msg.sender, returned_amount));

        assert(t.debt <= t.ceiling);
        assert(_balances[msg.sender] <= _supply);
    }
}

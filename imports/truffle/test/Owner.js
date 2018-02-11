var RBAC = artifacts.require('./RBAC.sol')

contract('RBAC-Owner', accounts => {
    let instance;
    let creator = accounts[0];
    let owner = accounts[1];
    let nonOnwer = accounts[2];

    it('contract creater should be the only owner', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.totalOwners())
        .then(length => assert.equal(length, 1, 'should be only one owner'))
        .then(() => instance.owners(0))
        .then(address => assert.equal(address, creator, 'owner should be the contract creator'))
    )

    it('owner should be able to add and delete owner', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.addOwner(owner, { from: creator }))
        .then(() => instance.totalOwners())
        .then(c => assert.equal(c, 2, 'should be 2 owners'))
        .then(() => instance.owners(1))
        .then(address => assert.equal(address, owner, '2nd owner should be owner'))
        .then(() => instance.deleteOwner(0, { from: owner }))
        .then(() => instance.totalOwners())
        .then(c => assert.equal(c, 1, 'should be 1 owner now'))
        .then(() => instance.owners(0))
        .then(address => assert.equal(address, owner, 'should be owner left'))
    )

    it('non-owner shold not be able to add owner', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.addOwner(owner, { from: nonOnwer }))
        .then(assert.fail)
        .catch(reason => assert(reason.message.indexOf('revert') >= 0, 'error message must contain revert'))
    )
})
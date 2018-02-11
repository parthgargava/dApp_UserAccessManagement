const RBAC = artifacts.require('./RBAC.sol')

const assertRevert = reason => assert(reason.message.indexOf('revert') >= 0, 'error message must contain revert')

contract('RBAC-Access', accounts => {
    let instance;
    const creator = accounts[0];
    const nonOwner = accounts[1];
    const access1 = ['ALL', '*', 'can access everyting']
    const access2 = ['ALL2', '**', 'can access everything 2']
    const menu1 = [1, 2, 3, 4, 5, 6, 7, 8]
    const menu2 = [8, 7, 6, 5, 4, 3, 2, 1]

    it('accesses should be empty at first', () => RBAC.deployed()
        .then(i => i.accessCounter())
        .then(c => assert.equal(c, 0, 'should be no accesses'))
    )

    it('should be able to add access', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.addAccess(...access1.concat([menu1])))
        .then(() => instance.accessCounter())
        .then(c => assert.equal(c, 1, 'should be 1 access'))
        .then(() => instance.accesses(1))
        .then(result => assert.deepEqual(result, access1.concat(false)))
        .then(() => instance.accessMenuIDs(1))
        .then(result => menu1.map((i, index) => assert.equal(i, result[index].toNumber())))
    )

    it('non-owner should not be able to add access', () => RBAC.deployed()
        .then(i => i.addAccess(...access1.concat([menu1]), { from: nonOwner }))
        .then(assert.fail)
        .catch(assertRevert)
    )

    it('should be able to modify access', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.modifyAccess(...[1].concat(access2.concat([menu2]))))
        .then(() => instance.accessCounter())
        .then(c => assert.equal(c, 1, 'should still be 1 access'))
        .then(() => instance.accesses(1))
        .then(result => assert.deepEqual(result, access2.concat(false)))
        .then(() => instance.accessMenuIDs(1))
        .then(result => menu2.map((i, index) => assert.equal(i, result[index].toNumber())))
    )

    it('non-owner should not be able to modify access', () => RBAC.deployed()
        .then(i => i.modifyAccess(...[1].concat(access2.concat([menu2])), { from: nonOwner }))
        .then(assert.fail)
        .catch(assertRevert)
    )

    it('should be able to delete access', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.deleteAccess(1))
        .then(() => instance.accesses(1))
        .then(result => assert.isTrue(result.slice(-1)[0]), 'should be deleted')
    )

    it('non-owner should not be able to modify access', () => RBAC.deployed()
        .then(i => i.deleteAccess(1, { from: nonOwner }))
        .then(assert.fail)
        .catch(assertRevert)
    )
})
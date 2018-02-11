const RBAC = artifacts.require('./RBAC.sol')

const assertRevert = reason => assert(reason.message.indexOf('revert') >= 0, 'error message must contain revert')

contract('RBAC-Role', accounts => {
    let instance;
    const nonOwner = accounts[1];
    const access1 = ['ALL', '*', 'can access everyting']
    const access2 = ['RBAC', '/rbac/*', 'can access rbac']
    const menu1 = [1, 2, 3, 4, 5, 6, 7, 8]
    const menu2 = [2, 3, 4, 5]

    before(() => RBAC.deployed()
        .then(i => instance = i)
        .then(() => {
            instance.addAccess(...access1.concat([menu1]))
            instance.addAccess(...access2.concat([menu2]))
        })
    )

    it('should have no role at first', () => RBAC.deployed()
        .then(i => i.roleCounter())
        .then(c => assert.equal(c, 0, 'should be 0'))
    )

    it('should be able to add role', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.addRole('Super Admin', [1]))
        .then(() => instance.roleCounter())
        .then(c => assert.equal(c, 1, 'should be 1'))
        .then(() => instance.roles(1))
        .then(result => assert.deepEqual(result, ['Super Admin', false]))
        .then(() => instance.roleAccessIDs(1))
        .then(result => assert.deepEqual(result.map(id => id.toNumber()), [1]))
    )

    it('non-owner should not be able to add role', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.addRole('Role', [1], { from: nonOwner }))
        .then(assert.fail)
        .catch(assertRevert)
    )

    it('should be able to modify role', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.modifyRole(1, 'Super Admin 2', [1, 2]))
        .then(() => instance.roleCounter())
        .then(c => assert.equal(c, 1, 'should still be 1'))
        .then(() => instance.roles(1))
        .then(result => assert.deepEqual(result, ['Super Admin 2', false]))
        .then(() => instance.roleAccessIDs(1))
        .then(result => assert.deepEqual(result.map(id => id.toNumber()), [1, 2]))
    )

    it('non-owner should not be able to add role', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.modifyRole(1, 'Foo', [], { from: nonOwner }))
        .then(assert.fail)
        .catch(assertRevert)
    )

    it('should be able to delete role', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.deleteRole(1))
        .then(() => instance.roleCounter())
        .then(c => assert.equal(c, 1, 'should still be 1'))
        .then(() => instance.roles(1))
        .then(result => assert.deepEqual(result, ['Super Admin 2', true]))
    )

    it('non-owner should not be able to delete role', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.deleteRole(1, { from: nonOwner }))
        .then(assert.fail)
        .catch(assertRevert)
    )
})

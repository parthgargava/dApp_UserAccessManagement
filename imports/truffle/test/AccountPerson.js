const RBAC = artifacts.require('./RBAC.sol')

const assertRevert = reason => assert(reason.message.indexOf('revert') >= 0, 'error message must contain revert')
const mapAccountResult = result => result.map((item, index) => (index >= 1 && index <= 2) ? item.toNumber() : item)

contract('RBAC-Account-Person', accounts => {
    let instance;
    const admin = accounts[1]
    const nonOwner = accounts[2]
    const access1 = ['ALL', '*', 'can access everyting']
    const access2 = ['RBAC', '/rbac/*', 'can access rbac']
    const menu1 = [1, 2, 3, 4, 5, 6, 7, 8]
    const menu2 = [2, 3, 4, 5]

    before(() => RBAC.deployed()
        .then(i => instance = i)
        .then(() => {
            instance.addAccess(...access1.concat([menu1]))
            instance.addAccess(...access2.concat([menu2]))
            instance.addRole('Super Admin', [1])
            instance.addRole('Admin', [2])
        })
    )

    it('should have no account at first', () => RBAC.deployed()
        .then(i => i.accountCounter())
        .then(c => assert.equal(c, 0, 'should be 0'))
    )

    it('should be able to add account with person', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.addAccountWithPerson(admin, 0, 'Zhongjie', 'He', [2])) // no manager
        .then(() => instance.accountCounter())
        .then(c => assert.equal(c, 1, 'should be 1'))
        .then(() => instance.personCounter())
        .then(c => assert.equal(c, 1, 'should be 1'))
        .then(() => instance.accounts(1))
        .then(mapAccountResult)
        .then(result => assert.deepEqual(result, [admin, 1, 0, false]))
        .then(() => instance.people(1))
        .then(result => assert.deepEqual(result, ['Zhongjie', 'He', false]))
        .then(() => instance.accountRoleIDs(1))
        .then(result => assert.deepEqual(result.map(i => i.toNumber()), [2]))
    )

    it('non-owner should not be able to add', () => RBAC.deployed()
        .then(i => i.addAccountWithPerson(admin, 0, 'Zhongjie', 'He', [2], { from: nonOwner })) // no manager
        .then(assert.fail)
        .catch(assertRevert)
    )

    it('should be able to modify account', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.modifyAccount(1, 1, [1]))
        .then(() => instance.accountCounter())
        .then(c => assert.equal(c, 1, 'should still be 1'))
        .then(() => instance.accounts(1))
        .then(mapAccountResult)
        .then(result => assert.deepEqual(result, [admin, 1, 1, false]))
        .then(() => instance.personCounter())
        .then(c => assert.equal(c, 1, 'should still be 1'))
        .then(() => instance.people(1))
        .then(result => assert.deepEqual(result, ['Zhongjie', 'He', false]))
        .then(() => instance.accountRoleIDs(1))
        .then(result => assert.deepEqual(result.map(i => i.toNumber()), [1]))
    )

    it('non-owner should not be able to modify account', () => RBAC.deployed()
        .then(i => i.modifyAccount(1, 1, [1], { from: nonOwner }))
        .then(assert.fail)
        .catch(assertRevert)
    )

    it('should be able to modify person', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.modifyPerson(1, 'Eric', 'Du'))
        .then(() => instance.personCounter())
        .then(c => assert.equal(c, 1, 'should still be 1'))
        .then(() => instance.people(1))
        .then(result => assert.deepEqual(result, ['Eric', 'Du', false]))
    )

    it('non-owner should not be able to modify person', () => RBAC.deployed()
        .then(i => i.modifyPerson(1, 'Zhongjie', 'He', { from: nonOwner }))
        .then(assert.fail)
        .catch(assertRevert)
    )

    it('should be able to delete account', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.deleteAccount(1))
        .then(() => instance.accountCounter())
        .then(c => assert.equal(c, 1, 'should still be 1'))
        .then(() => instance.accounts(1))
        .then(result => assert.isTrue(result.slice(-1)[0], 'account isDeleted should be true'))
        .then(() => instance.personCounter())
        .then(c => assert.equal(c, 1, 'should still be 1'))
        .then(() => instance.people(1))
        .then(result => assert.isTrue(result.slice(-1)[0], 'person isDeleted should also be true'))
    )

    it('non-owner should not be able to delete account', () => RBAC.deployed()
        .then(i => i.deleteAccount(1, { from: nonOwner }))
        .then(assert.fail)
        .catch(assertRevert)
    )

    it('should be able to register', () => RBAC.deployed()
        .then(i => instance = i)
        .then(() => instance.register({from: nonOwner}))
        .then(() => instance.accountCounter())
        .then(c => assert.equal(c, 2, 'should be 2'))
        .then(() => instance.accounts(2))
        .then(mapAccountResult)
        .then(result => assert.deepEqual(result, [nonOwner, 2, 0, false]))
        .then(() => instance.personCounter())
        .then(c => assert.equal(c, 2, 'should be 2'))
        .then(() => instance.people(2))
        .then(result => assert.deepEqual(result, ['', '', false]))
    )
})

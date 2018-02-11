const Web3 = require('web3')
const JSONData = require('./build/contracts/RBAC.json')
const truffleConfig = require('./truffle')
const TruffleContract = require('truffle-contract')

const args = process.argv.slice(2)
const networkName = args.length ? args[0] : 'development'
const network = truffleConfig.networks[networkName]
if (network === undefined) {
  throw new Error(`unknown networkName: ${networkName}`)
}

const web3 = new Web3(`http://${network.host}:${network.port}`)
const RBACContract = TruffleContract(JSONData)
RBACContract.setProvider(web3.currentProvider)
// FIXME: https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
if (typeof RBACContract.currentProvider.sendAsync !== 'function') {
  RBACContract.currentProvider.sendAsync = function () {
    return RBACContract.currentProvider.send.apply(
      RBACContract.currentProvider, arguments
    )
  }
}

const adminAddress = '0x824fcdc476f1c85f9fa5f27f8f0c6ce630b7ee74'

const allMenus = [
  'All',
  'Home',
  'Access',
  'Role',
  'Account',
  'TempAccess',
  'Wiki',
  'Jira',
  'SharePoint'
]

const menusToIDs = menus => menus.map(menu => allMenus.indexOf(menu))

const allAccesses = [
  ['HOME', '/', 'can access home', menusToIDs(['Home'])],
  ['ALL', '*', 'all accesses', menusToIDs(['All'])],
  ['AC', '/rbac/*', 'can access AC system', menusToIDs(['Access', 'Role', 'Account', 'TempAccess'])],
  ['JIRA', '/jira/*', 'can access Jira', menusToIDs(['Jira'])],
  ['WIKI', '/wiki/*', 'can access Wiki', menusToIDs(['Wiki'])],
  ['SHAREPOINT', '/sharepoint/*', 'can access SharePoint', menusToIDs(['SharePoint'])]
]

const keysToIDs = (keys, allItems) => keys.map(key => {
  let id
  allItems.forEach((one, i) => {
    if (one[0] === key) {
      id = i + 1
    }
  })
  return id
})

const accessesToIDs = keys => keysToIDs(keys, allAccesses)

const allRoles = [
  ['Super Admin', accessesToIDs(['ALL'])],
  ['Admin', accessesToIDs(['HOME', 'AC'])],
  ['Doc Writer', accessesToIDs(['HOME', 'WIKI'])],
  ['Developer', accessesToIDs(['HOME', 'WIKI', 'JIRA'])],
  ['Sales', accessesToIDs(['HOME', 'SHAREPOINT'])]
]

const rolsToIDs = keys => keysToIDs(keys, allRoles)

let instance
let txObj
RBACContract.deployed()
  .then(i => {
    instance = i
  })
  .then(() => web3.eth.getCoinbase())
  .then(c => {
    console.log(`coinbase: ${c}`)
    txObj = {from: c, gas: 500000}
  })
  .then(() => instance.accessCounter())
  .then(c => {
    console.log(`accessCounter: ${c}`)
    if (c.toNumber() === 0) {
      return Promise.all(
        allAccesses.map(data => instance.addAccess(...data, txObj).then(res => console.log(`[Access: ${data[0]}] added: ${res.tx}`)))
      )
    }
  })
  .then(() => instance.roleCounter())
  .then(c => {
    console.log(`roleCounter: ${c}`)
    if (c.toNumber() === 0) {
      return Promise.all(
        allRoles.map(
          data => instance.addRole(...data, txObj)
            .then(res => console.log(`[Role: ${data[0]}] added: ${res.tx}`))
        )
      )
    }
  })
  .then(() => instance.totalOwners())
  .then(c => {
    console.log(`totalOwners: ${c}`)
    if (c.toNumber() === 1) {
      return Promise.all([
        instance.addOwner(adminAddress, txObj)
          .then(res => console.log(`[Owner] added: ${res.tx}`)),
        instance.addAccountWithPerson(adminAddress, 0, 'Zhongjie', 'He', rolsToIDs(['Super Admin', 'Admin']), txObj)
          .then(res => console.log(`[Account: Zhongjie] added: ${res.tx}`))
      ])
    }
  })

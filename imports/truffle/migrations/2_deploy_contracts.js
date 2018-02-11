var RBAC = artifacts.require('./RBAC.sol')

module.exports = function (deployer) {
  deployer.deploy(RBAC)
}

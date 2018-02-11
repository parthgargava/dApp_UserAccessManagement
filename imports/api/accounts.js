import contract from './contract'
import { _ } from 'meteor/underscore'

let instance
export const getAccount = address => {
  let account
  return contract.RBACContract.deployed()
    .then(i => {
      instance = i
    })
    .then(() => instance.accountCounter())
    .then(c => _.range(1, c.toNumber() + 1))
    .then(ids => Promise.all(
      ids.map(
        id => instance.accounts(id)
          .then(result => {
            if (result[0] === address) {
              account = result
            }
          })
      )
    ))
    .then(() => account)
}

export const register = address => {
  return contract.RBACContract.deployed()
    .then(i => i.register({ from: address }))
}

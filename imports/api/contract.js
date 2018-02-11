import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { Connect, SimpleSigner } from 'uport-connect'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'

import JSONData from '../truffle/build/contracts/RBAC.json'
import uPortConfig from './uportConfig.json'

const exp = {}

if (Meteor.isClient) {
  Session.set('uportLoaded', false)
  uPortConfig.signer = SimpleSigner(uPortConfig.signer)
  exp.uport = new Connect('INFO7510', uPortConfig)
  // exp.web3 = exp.uport.getWeb3()
  exp.web3 = new Web3(exp.uport.getWeb3().currentProvider)  // using web3 1.0
  exp.RBACContract = TruffleContract(JSONData)
  exp.RBACContract.setProvider(exp.web3.currentProvider)
  Session.set('uportLoaded', true)
}

export default exp

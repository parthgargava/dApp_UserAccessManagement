import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Meteor } from 'meteor/meteor'

import TempAccess from './TempAccess.jsx'
import * as c from '../../models/collections'

const TempAccessContainer = withTracker(props => {
  Meteor.subscribe('account.all')
  Meteor.subscribe('access.all')
  const accountID = FlowRouter.getQueryParam('accountID')
  const accountToAdd = accountID && c.Account.findOne(accountID)
  const accesses = c.Access.find().fetch()
  return {
    accountToAdd,
    allAccounts: c.Account.find().fetch(),
    accountsWithTempAccess: c.Account.find({
      'profile.tempAccesses.0': { $exists: true }
    }).fetch(),
    accesses
  }
})(props => <TempAccess {...props} />)

export default TempAccessContainer

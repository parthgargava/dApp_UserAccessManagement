import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

import '../imports/api'
import { initFixture } from '../imports/models/fixtures'
import * as c from '../imports/models/collections'

Meteor.startup(() => {
  // code to run on server at startup
  initFixture()
  Meteor.publish('account.all', () => c.Account.find())
  // Meteor.publish('account.hasTempAccess', () =>
  //     c.Account.find({ 'profile.tempAccesses.0': { $exists: true } })
  // );
  Meteor.publish('role.all', () => c.Role.find())
  Meteor.publish('access.all', () => c.Access.find())
  Meteor.publish('contact.all', () => c.Contact.find())
  Meteor.publish('jobProfile.all', () => c.JobProfile.find())
  Meteor.publish('uportConfig.all', () => c.UPortConfig.find())
})

Accounts.registerLoginHandler('uport', function (request) {
  if (!request.uportCredentials) {
    return
  }
  const credentials = request.uportCredentials

  let account = c.Account.findOne({
    'profile.uportCredentials.address': credentials.address
  })
  if (!account) {
    account = new c.Account()
    account.profile.uportCredentials = credentials
    account.username = credentials.address
    account.save()
  }
  return { userId: account._id }
})

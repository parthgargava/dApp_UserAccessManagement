import { Accounts } from 'meteor/accounts-base'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Session } from 'meteor/session'
import { Meteor } from 'meteor/meteor'

Accounts.onLogin(() => {
  const roleID = Accounts.user().profile.roleIDs[0]
  Session.setDefaultAuth('currentRoleID', roleID)

  Meteor.call('account.tempMenus', { _id: Accounts.user()._id }, (err, res) => {
    if (err) {
      console.error(err)
    } else {
      Session.setAuth('tempMenus', res)
    }
  })

  const next = FlowRouter.current().queryParams.next || '/'
  FlowRouter.go(next)
})

import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import wildcard from 'wildcard'

import * as c from '../models/collections'
import { ensureMongo } from './utils'

Meteor.methods({
  'account.remove' (accountID) {
    const account = c.Account.findOne(accountID)
    account && account.remove()
  },
  'account.create' ({ username, password, profile }) {
        // TODO: figure the best practice
    if (Meteor.isServer) {
      profile.roleIDs = ensureMongo(profile.roleIDs)
      return Accounts.createUser({ username, password, profile })
    }
  },
  'account.modify' ({ _id, params }) {
    if (Meteor.isServer) {
      const account = c.Account.findOne(_id)
      if (!account) {
        throw new Meteor.Error(404)
      }
      const { username, password, profile } = params
      if (password) {
        Accounts.setPassword(account._id, password)
      }
      profile.roleIDs = ensureMongo(profile.roleIDs)
      account.set({ username, profile })
      return account.save()
    }
  },
  'account.profile' ({ _id, params }) {
    if (Meteor.isServer) {
      const account = c.Account.findOne(_id)
      if (!account) {
        throw new Meteor.Error(404)
      }
      const { firstName, lastName, email, address, phone, jobTitle } = params
      account.profile.person.firstName = firstName
      account.profile.person.lastName = lastName

      const jobProfile = account.getJobProfile() || new c.JobProfile()
      jobProfile.title = jobTitle
      jobProfile.save()
      if (!account.profile.person.jobProfileID) {
        account.profile.person.jobProfileID = jobProfile._id
      }

      let contact = account.getContact() || new c.Contact()
      contact.address = address
      contact.phone = phone
      contact.email = email
      contact.save()
      if (!account.profile.person.contactID) {
        account.profile.person.contactID = contact._id
      }

      account.save()

      return account
    }
  },
  'account.grantTempAccess' ({ _id, params }) {
    if (Meteor.isServer) {
      const account = c.Account.findOne(_id)
      if (!account) {
        throw new Meteor.Error(404)
      }
      const ta = {
        grantedAt: new Date(),
        accessID: ensureMongo(params.accessID),
        expireAt: params.expireAt
      }
      account.profile.tempAccesses.push(ta)
      return account.save()
    }
  },
  'account.revokeTempAccess' ({ _id, i }) {
    if (Meteor.isServer) {
      const account = c.Account.findOne(_id)
      if (!account) {
        throw new Meteor.Error(404)
      }
      account.profile.tempAccesses[i].expireAt = new Date()
      return account.save()
    }
  },
  'account.canTempAccess' ({ _id, path }) {
    if (Meteor.isServer) {
      const account = c.Account.findOne(_id)
      if (!account) {
        throw new Meteor.Error(404)
      }

      let canAccess = false
      account.profile.tempAccesses.filter(one => !one.isExpired()).forEach(tempAccess => {
        const access = c.Access.findOne(tempAccess.accessID)
        canAccess = canAccess || !!wildcard(access.endpoint, path)
      })
      return canAccess
    }
  },
  'account.tempMenus' ({ _id }) {
    if (Meteor.isServer) {
      const account = c.Account.findOne(_id)
      if (!account) {
        throw new Meteor.Error(404)
      }

      let menus = {}

      account.profile.tempAccesses.filter(one => !one.isExpired()).forEach(tempAccess => {
        const access = c.Access.findOne(tempAccess.accessID)
        access.menus.forEach(menu => (menus[menu] = true))
      })
      return menus['All'] ? c.AllMenus : Object.keys(menus)
    }
  }
})

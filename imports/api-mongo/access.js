import { Meteor } from 'meteor/meteor'

import * as c from '../models/collections'

Meteor.methods({
  'access.create' ({ code, endpoint, description }) {
    if (Meteor.isServer) {
      if (c.Access.findOne({ code })) {
        throw new Meteor.Error(403, 'Access code exists.')
      }

      const access = new c.Access()
      access.set({ code, endpoint, description })
      return access.save()
    }
  },
  'access.modify' ({ _id, params }) {
    if (Meteor.isServer) {
      const access = c.Access.findOne(_id)
      if (!access) {
        throw Meteor.Error(404)
      }

      const { code, endpoint, description, menus } = params
            // TODO :validate code uniqueness
      access.set({ code, endpoint, description, menus })
      return access.save()
    }
  }
})

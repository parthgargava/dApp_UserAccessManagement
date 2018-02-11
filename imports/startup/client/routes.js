import React from 'react'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { mount } from 'react-mounter'
import { Session } from 'meteor/session'

import LayoutContainer from '../../ui/Layout'
import Home from '../../ui/Home'
import Portal from '../../ui/Portal'
import Access from '../../ui/Access'
import Role from '../../ui/Role'
import Account from '../../ui/Account'
import Profile from '../../ui/Profile'
import TempAccess from '../../ui/TempAccess'
import UPort from '../../ui/UPort'

function makePrivateRouter (path, name, container) {
  FlowRouter.route(path, {
    name,
    triggersEnter: function (context, redirect) {
      if (Meteor.user()) {
        const currentRoleID = Session.get('currentRoleID')
        Meteor.call('role.canAccess', { _id: currentRoleID, path }, (err, res) => {
          if (err) {
            console.error(err)
            return
          }
          if (res) {
            mount(LayoutContainer, { main: container })
          } else {
            Meteor.call('account.canTempAccess', { _id: Meteor.userId(), path }, (err, res) => {
              if (err) {
                console.error(err)
                return
              }
              if (res) {
                mount(LayoutContainer, { main: container })
              } else {
                FlowRouter.go('/404')
              }
            }
          )
          }
        })
      } else {
        redirect(`/uport/?next=${encodeURIComponent(path)}`)
      }
    }
  })
}

makePrivateRouter('/', 'Home', <Home />)
makePrivateRouter('/rbac/access', 'Access', <Access />)
makePrivateRouter('/rbac/role', 'Role', <Role />)
makePrivateRouter('/rbac/account', 'Account', <Account />)
makePrivateRouter('/rbac/account/:_id', 'Profile', <Profile />)
makePrivateRouter('/rbac/tempAccess', 'Temp Access', <TempAccess />)
makePrivateRouter('/wiki', 'Wiki', <h1>Wiki</h1>)
makePrivateRouter('/jira', 'Jira', <h1>Jira</h1>)
makePrivateRouter('/sharepoint', 'SharePoint', <h1>SharePoint</h1>)

FlowRouter.route('/portal', {
  name: 'Portal',
  action: () => mount(Portal)
})

FlowRouter.route('/uport', {
  name: 'UPort',
  action: () => mount(UPort)
})

FlowRouter.route('/logout', {
  name: 'Logout',
  action: () => {
    Meteor.logout(() => FlowRouter.go('/uport'))
  }
})

FlowRouter.notfound = {
  action: () => mount(LayoutContainer, { main: <h1>Not Found</h1> })
}

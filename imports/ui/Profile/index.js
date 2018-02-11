import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Spin } from 'antd'
import { FlowRouter } from 'meteor/kadira:flow-router'

import Profile from './Profile.jsx'
import * as c from '../../models/collections'

const ProfileContainer = withTracker(props => {
  const accountHandle = Meteor.subscribe('account.all')
  const contactHandle = Meteor.subscribe('contact.all')
  const jobProfileHandle = Meteor.subscribe('jobProfile.all')
  const loading = !accountHandle.ready() || !contactHandle.ready() || !jobProfileHandle.ready()
  const id = FlowRouter.getParam('_id')
  const account = c.Account.findOne(id)
  const contact = account && account.getContact()
  return {
    account,
    loading,
    contact,
    jobProfile: account && account.getJobProfile()
  }
})(props =>
  <Spin spinning={props.loading}>
    <Profile {...props} />
  </Spin>
)

export default ProfileContainer

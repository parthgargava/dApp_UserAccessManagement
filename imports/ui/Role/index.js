import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Spin } from 'antd'

import Role from './Role.jsx'
import * as c from '../../models/collections'

const RoleContainer = withTracker(props => {
  const accessHandle = Meteor.subscribe('access.all')
  const roleHandle = Meteor.subscribe('role.all')
  const loading = !roleHandle.ready() && !accessHandle.ready()
  return {
    loading,
    roles: !loading ? c.Role.find().fetch() : [],
    accesses: !loading ? c.Access.find().fetch() : []
  }
})(props => (
  <Spin spinning={props.loading}>
    <Role {...props} />
  </Spin>
))

export default RoleContainer

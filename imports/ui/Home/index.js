import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Spin } from 'antd'

import Home from './Home.jsx'
import * as c from '../../models/collections'

const HomeContainer = withTracker(props => {
  const roleHandle = Meteor.subscribe('role.all')
  const accessHandle = Meteor.subscribe('access.all')
  const loading = !roleHandle.ready() && !accessHandle.ready()
  return {
    loading,
    roles: !loading ? c.Role.find().fetch() : [],
    accesses: !loading ? c.Access.find().fetch() : []
  }
})(props => (
  <Spin spinning={props.loading}>
    <Home {...props} />
  </Spin>
))

export default HomeContainer

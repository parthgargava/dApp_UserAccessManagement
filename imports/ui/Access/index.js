import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'
import { Spin } from 'antd'

import Access from './Access.jsx'
import * as c from '../../models/collections'

const AccessContainer = withTracker(props => {
  const handle = Meteor.subscribe('access.all')
  const loading = !handle.ready()
  return {
    loading,
    accesses: !loading ? c.Access.find().fetch() : []
  }
})(props => (
  <Spin spinning={props.loading}>
    <Access {...props} />
  </Spin>
))

export default AccessContainer

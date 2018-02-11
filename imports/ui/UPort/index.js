import React from 'react'
import { Meteor } from 'meteor/meteor'
import { Session } from 'meteor/session'
import { withTracker } from 'meteor/react-meteor-data'
import { Spin } from 'antd'
// import { uport } from '../../api'

import UPort from './UPort'

const UPortContainer = withTracker(props => {
  const loading = !Session.get('uportLoaded')
  return {
    loading
    // uport
  }
})(props => (
  <Spin spinning={props.loading}>
    <div style={{ width: '100vw', height: '100vh' }}>
      {Meteor.user() === null && <UPort {...props} />}
    </div>
  </Spin>
))

export default UPortContainer

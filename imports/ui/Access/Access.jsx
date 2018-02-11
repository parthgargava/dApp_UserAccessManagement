import React from 'react'
import { Row, Col } from 'antd'

import AccessTable from './AccessTable'
import AccessModal from './AccessModal'

const Access = props => {
  return (
    <div>
      <Row type='flex' justify='space-between' align='buttom'>
        <Col>
          <h1>Manage Access</h1>
        </Col>
        <Col>
          <AccessModal />
        </Col>
      </Row>

      <AccessTable {...props} />
    </div>
  )
}

export default Access

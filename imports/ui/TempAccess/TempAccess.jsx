import React from 'react'
import { Row, Col } from 'antd'

import TempAccessModal from './TempAccessModal'
import TempAccessTable from './TempAccessTable'

const TempAccess = props => (
  <div>
    <Row type='flex' justify='space-between' aligh='buttom'>
      <Col>
        <h1>Temp Access</h1>
      </Col>
      <Col>
        <TempAccessModal {...props} />
      </Col>
    </Row>
    <TempAccessTable {...props} />
  </div>
)

export default TempAccess

import React from 'react'
import { Row, Col } from 'antd'

import AccountTable from './AccountTable'
import AccountModal from './AccountModal'

const Account = props => {
  return (
    <div>
      <Row type='flex' justify='space-between' align='buttom'>
        <Col>
          <h1>Manage Account</h1>
        </Col>
        <Col>
          <AccountModal {...props} />
        </Col>
      </Row>

      <AccountTable {...props} />
    </div>
  )
}

export default Account

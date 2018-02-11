import React from 'react'
import { Row, Col } from 'antd'

import RoleTable from './RoleTable'
import RoleModal from './RoleModal'

const Role = props => {
  return (
    <div>
      <Row type='flex' justify='space-between' align='buttom'>
        <Col>
          <h1>Manage Role</h1>
        </Col>
        <Col>
          <RoleModal {...props} />
        </Col>
      </Row>

      <RoleTable {...props} />
    </div>
  )
}

export default Role

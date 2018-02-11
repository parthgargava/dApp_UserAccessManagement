import { Meteor } from 'meteor/meteor'
import React from 'react'
import { message } from 'antd'

import { ensureString } from '../../api/utils'
import { EditableTable, EditableMultipleOptionCell } from '../EditableTable'

class EditableRoleTable extends EditableTable {
  renderColumns (text, record, column) {
    if (column === 'accessIDs') {
      return (
        <EditableMultipleOptionCell
          editable={record.editable}
          value={text}
          onChange={value => this.handleChange(value, record.key, 'accessIDs')}
          options={this.props.accesses}
          displayKey='code'
                />
      )
    } else {
      return super.renderColumns(text, record, column)
    }
  }
}

const RoleTable = props => (
  <EditableRoleTable
    accesses={props.accesses}
    items={props.roles.map(role => ({ ...role, accessIDs: ensureString(role.accessIDs) }))}
    columns={[
            { title: 'Role Name', dataIndex: 'name' },
            { title: 'Access', dataIndex: 'accessIDs' }
    ]}
    onSave={(role, cb) =>
            Meteor.call('role.modify', { _id: role._id, params: role }, err => {
              if (!err) {
                message.success('Role saved!')
              } else {
                message.error(err.reason)
              }
              cb(err)
            })
        }
    />
)

export default RoleTable

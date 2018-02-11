import React, { Component } from 'react'
import { Menu, Dropdown, Icon, message } from 'antd'
import { Session } from 'meteor/session'

export default class RoleSwitcher extends Component {
  handleClick ({ key }) {
    const role = this.props.roles[key]
    Session.setAuth('currentRoleID', role._id)
    message.info(`Switched to role ${role.name}`)
  }
  render () {
    const { currentRoleID, roles } = this.props
    const currentRole = roles.filter(role => {
      return role._id.equals(currentRoleID)
    })[0]
    return (
      <Dropdown
        overlay={
          <Menu onClick={e => this.handleClick(e)}>
            {this.props.roles.map((role, i) => (
              <Menu.Item key={i}>{role.name}</Menu.Item>
            ))}
          </Menu>
        }
      >
        <a>
          {currentRole && currentRole.name}
          <Icon type='down' />
        </a>
      </Dropdown>
    )
  }
}

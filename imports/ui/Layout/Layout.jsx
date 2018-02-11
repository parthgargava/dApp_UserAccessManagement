import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { Layout as AntdLayout, Menu, Button } from 'antd'

import RoleSwitcher from '../RoleSwitcher'

const { Content, Sider, Header } = AntdLayout

const Layout = ({ main, menus, user }) => (
  <AntdLayout>
    <Sider style={{ minHeight: '100vh', paddingTop: '26px' }} width={130}>
      <Menu
        theme='dark'
        defaultSelectedKeys={['Home']}
        onClick={({ key }) => FlowRouter.go(key)}
            >
        {menus && menus.map(one => <Menu.Item key={one}>{one}</Menu.Item>)}
      </Menu>
    </Sider>
    <AntdLayout>
      {user && (
        <Header
          style={{
            backgroundColor: 'white',
            height: '30px',
            lineHeight: '30px',
            textAlign: 'right',
            paddingRight: '20px'
          }}
                >
          <span style={{ marginRight: '5px' }}>
                        Hi, {user.username}! Your current role:
                    </span>
          <RoleSwitcher />
          <Button
            size='small'
            style={{ marginLeft: '15px' }}
            onClick={() => FlowRouter.go('/logout')}
                    >
                        Logout
                    </Button>
        </Header>
            )}
      <Content style={{ margin: '20px' }}>{main}</Content>
    </AntdLayout>
  </AntdLayout>
)
export default Layout

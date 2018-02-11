import React from 'react'
import { Table, Icon, Tag } from 'antd'

const Home = ({ roles, accesses }) => {
  const render = hasAccess => (
    <Tag color={hasAccess ? 'green' : 'red'}>
      <Icon type={hasAccess ? 'check' : 'close'} />
    </Tag>
    )

  const accessMap = {}
  accesses.forEach(access => {
    accessMap[access._id._str] = access.code
  })

  const columns = [{ title: 'Role', dataIndex: 'key', key: 'role' }].concat(
        accesses.filter(access => access.code !== 'ALL').map(access => ({
          title: access.code,
          dataIndex: access.code,
          key: access.code,
          render
        }))
    )

  const dataSource = roles.map(role => {
    const data = { key: role.name }
    role.accessIDs.forEach(id => {
      const code = accessMap[id._str]
      if (code === 'ALL') {
        Object.keys(accessMap).map(one => {
          data[accessMap[one]] = true
        })
      } else {
        data[code] = true
      }
    })
    return data
  })

  return (
    <div>
      <h1>Home</h1>

      <h2>Access Table</h2>
      <Table dataSource={dataSource} columns={columns} />

      <h2>Hacky links</h2>
      <a href='/wiki'>/wiki</a>
      <br />
      <a href='/jira'>/jira</a>
      <br />
      <a href='/sharepoint'>/sharepoint</a>
      <br />
      <a href='/rbac/access'>/rbac/access</a>
      <br />
      <a href='/rbac/role'>/rbac/role</a>
      <br />
      <a href='/rbac/account'>/rbac/account</a>
      <br />
      <a href='/rbac/tempAccess'>/rbac/tempAccess</a>
    </div>
  )
}

export default Home

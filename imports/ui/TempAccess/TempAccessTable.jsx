import React, { Component } from 'react'
import { Tag, Table, Popconfirm, message } from 'antd'
import { Meteor } from 'meteor/meteor'
import moment from 'moment'

export default class TempAccessTable extends Component {
  render () {
    const { accountsWithTempAccess, accesses } = this.props
    const accessMap = {}
    accesses.map(access => {
      accessMap[access._id._str] = access
    })
    const mapper = account => {
      return account.profile.tempAccesses.map((one, i) => ({
        ...one,
        indexOfAccess: i,
        username: account.username,
        accountID: account._id,
        key: `${account._id}.${i}`
      }))
    }
    const dataSource =
      accountsWithTempAccess && accountsWithTempAccess.length
        ? accountsWithTempAccess.reduce((pre, cur) => mapper(cur).concat(pre), [])
        : []
    const columns = [
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username'
      },
      {
        title: 'Access',
        key: 'access',
        dataIndex: 'accessID',
        render: accessID => {
          const access = accessMap[accessID._str]
          return <Tag>{access && access.code}</Tag>
        }
      },
      {
        title: 'Expire At',
        key: 'expireAt',
        dataIndex: 'expireAt',
        render: expireAt => moment(expireAt).format('lll')
      },
      {
        title: 'Status',
        key: 'status',
        dataIndex: 'expireAt',
        render: expireAt =>
          (expireAt > new Date() ? 'Will expire ' : 'Expired ') +
          moment(expireAt).fromNow()
      },
      {
        title: '',
        key: 'revoke',
        render: (text, record) =>
          record.expireAt > new Date() && (
            <Popconfirm
              title='Sure to revoke this access immediately?'
              onConfirm={() =>
                Meteor.call(
                  'account.revokeTempAccess',
                  {
                    _id: record.accountID,
                    i: record.indexOfAccess
                  },
                  err => {
                    if (err) {
                      message.error(err.reason)
                    } else {
                      message.success('Access revoked.')
                    }
                  }
                )
              }
              okText='Yes'
              cancelText='No'
            >
              <a>Revoke</a>
            </Popconfirm>
          )
      }
    ]
    return <Table dataSource={dataSource} columns={columns} />
  }
}

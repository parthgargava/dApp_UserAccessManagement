import React, { Component } from 'react'
import { Modal, Spin } from 'antd'

import { Accounts } from 'meteor/accounts-base'
import MNID from 'mnid'

import { contract, accounts } from '../../api'

export default class UPort extends Component {
  constructor (props) {
    super(props)
    this.state = { loading: false }
  }

  render () {
    const self = this
    !this.props.loading && !this.state.loading && contract.uport
      .requestCredentials({
        requested: ['name', 'phone', 'country', 'email'],
        notifications: true
      })
      .then(credentials => {
        const address = MNID.decode(credentials.address).address
        console.log(address)
        accounts.getAccount(address)
          .then(result => {
            if (result) {
              login(credentials)
            } else {
              Modal.info({
                title: 'Register Confirm',
                content: <p>No account found. Do you want to call the contract to register?</p>,
                onOk () {
                  self.setState({ loading: true })
                  //accounts.register(address).then(() => l
                  login(credentials)
                }
              })
            }
          })
      })
      .catch(err => {
        throw err
      })
    return (
      <Spin spinning={this.state.loading}>
        <div style={{ height: '100vh', width: '100vw' }} />
      </Spin>
    )
  }
}

const login = credentials => Accounts.callLoginMethod({
  methodArguments: [{ uportCredentials: credentials }],
  userCallback: err => err && console.error(err)
})

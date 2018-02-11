import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import { Button, Modal, Form, Icon, Select, DatePicker, message } from 'antd'
const FormItem = Form.Item
const Option = Select.Option

export default class TempAccessModal extends Component {
  constructor (props) {
    super(props)
    this.state = { visible: !!props.accountToAdd }
  }

  render () {
    return (
      <div>
        <Button type='primary' onClick={() => this.setState({ visible: true })}>
          <Icon type='plus' />
          Grant Access
                </Button>
        <Modal
          title='Grant Temp Access'
          width={600}
          visible={this.state.visible}
          onCancel={() => this.setState({ visible: false })}
          footer={null}
        >
          <TempAccessForm {...this.props} />
        </Modal>
      </div>
    )
  }
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 }
  }
}

class TempAccessFormComponent extends Component {
  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (err) {
        return
      }
      Meteor.call(
        'account.grantTempAccess',
        {
          _id: values.accountID,
          params: { accessID: values.accessID, expireAt: values.expireAt.toDate() }
        },
        err => {
          if (!err) {
            this.props.form.setFields({
              accountID: null,
              accessID: null,
              expireAt: null
            })
            message.success('Access granted.')
          } else {
            message.error(err.reason)
          }
        }
      )
    })
    return false
  }

  render () {
    const { allAccounts, accountToAdd, accesses } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form onSubmit={e => this.handleSubmit(e)} autoComplete='nope'>
        <FormItem {...formItemLayout} label='Account'>
          {getFieldDecorator('accountID', {
            rules: [{ required: true, message: 'Please select account.' }],
            initialValue: accountToAdd && accountToAdd._id
          })(
            <Select placeholder='Please select account'>
              {allAccounts.map(account => (
                <Option key={account._id}>{account.username}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label='Access'>
          {getFieldDecorator('accessID', {
            rules: [{ required: true, message: 'Please select access.' }]
          })(
            <Select placeholder='Please select access'>
              {accesses.map(access => (
                <Option key={access._id._str}>{access.code}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem {...formItemLayout} label='Expire At'>
          {getFieldDecorator('expireAt', {
            rules: [{ required: true, message: 'Please select expiration time.' }]
          })(<DatePicker showTime format='YYYY-MM-DD HH:mm:ss' />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>
            Grant
                    </Button>
        </FormItem>
      </Form>
    )
  }
}

const TempAccessForm = Form.create()(TempAccessFormComponent)

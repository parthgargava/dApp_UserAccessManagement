import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd'
const FormItem = Form.Item
const { TextArea } = Input

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

class ProfileFormComponent extends Component {
  constructor (props) {
    super(props)
    this.state = { editing: false }
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Meteor.call('account.profile', { _id: this.props.account._id, params: values }, err => {
          if (!err) {
            this.setState({ editing: false })
            message.success('Profile saved.')
          } else {
            message.error(err.reason)
          }
        })
      }
    })
    return false
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const { account, contact, jobProfile } = this.props
    return (
      <Form onSubmit={e => this.handleSubmit(e)} autoComplete='nope'>
        <FormItem {...formItemLayout} label='First Name'>
          {getFieldDecorator('firstName', {
            initialValue: account && account.profile.person.firstName,
            rules: [
              {
                required: true,
                message: 'Please input first name'
              }
            ]
          })(<Input readOnly={!this.state.editing} />)}
        </FormItem>
        <FormItem {...formItemLayout} label='Last Name'>
          {getFieldDecorator('lastName', {
            initialValue: account && account.profile.person.lastName,
            rules: [
              {
                required: true,
                message: 'Please input last name'
              }
            ]
          })(<Input readOnly={!this.state.editing} />)}
        </FormItem>
        <FormItem {...formItemLayout} label='E-mail'>
          {getFieldDecorator('email', {
            initialValue: contact && contact.email,
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!'
              },
              {
                required: true,
                message: 'Please input your E-mail!'
              }
            ]
          })(<Input readOnly={!this.state.editing} />)}
        </FormItem>
        <FormItem {...formItemLayout} label='Address'>
          {getFieldDecorator('address', {
            initialValue: contact && contact.address
          })(<Input readOnly={!this.state.editing} />)}
        </FormItem>
        <FormItem {...formItemLayout} label='Phone'>
          {getFieldDecorator('phone', {
            initialValue: contact && contact.phone
          })(<Input readOnly={!this.state.editing} type='tel' />)}
        </FormItem>
        <FormItem {...formItemLayout} label='Job Title'>
          {getFieldDecorator('jobTitle', {
            initialValue: jobProfile && jobProfile.title,
            rules: [
              {
                required: true,
                message: 'Please input job title!'
              }
            ]
          })(<Input readOnly={!this.state.editing} />)}
        </FormItem>
        {/* TODO: manager */}
        <FormItem {...formItemLayout} label='uPort Credentials'>
          {getFieldDecorator('uportCredentials', {
            initialValue:
                            account &&
                            JSON.stringify(account.profile.uportCredentials, null, '    ')
          })(<TextArea readOnly autosize />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          {this.state.editing ? (
            <Button type='primary' htmlType='submit'>
                Save
            </Button>
          ) : (
            <Button
              type='primary'
              htmlType='button'
              onClick={e => {
                e.preventDefault()
                this.setState({ editing: true })
                return false
              }}
              >
                  Modify
              </Button>
          )}
        </FormItem>
      </Form>
    )
  }
}

const ProfileForm = Form.create()(ProfileFormComponent)

export default class Profile extends Component {
  render () {
    return (
      <div>
        <h1>Profile</h1>
        <ProfileForm {...this.props} />
      </div>
    )
  }
}

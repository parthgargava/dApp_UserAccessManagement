import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import { Modal, Button, Icon, Form, Input, message, Select } from 'antd'
import { getStringID } from '../../api/utils'
const Option = Select.Option
const FormItem = Form.Item

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

class RoleFormComponent extends Component {
  constructor (props) {
    super(props)
    this.state = { isSubmitting: false }
  }

  handleSubmit (e) {
    this.setState({ isSubmitting: true })
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Meteor.call('role.create', { ...values }, err => {
          this.setState({ isSubmitting: false })
          if (!err) {
            this.props.form.setFields({
              name: { value: '' },
              accessIDs: { value: [] }
            })
            message.success('Role created!')
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
    return (
      <Form onSubmit={e => this.handleSubmit(e)} autoComplete='nope'>
        <FormItem {...formItemLayout} label='Role Name'>
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Please input role name.',
                whitespace: true
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label='Accesses'>
          {getFieldDecorator('accessIDs', {
            rules: [
              {
                required: true,
                message: 'Please select Access.',
                type: 'array'
              }
            ]
          })(
            <Select mode='multiple' placeholder='Please select accesses'>
              {this.props.accesses.map(access => (
                <Option key={getStringID(access)}>{access.code}</Option>
                            ))}
            </Select>
                    )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit'>
                        Create
                    </Button>
        </FormItem>
      </Form>
    )
  }
}

const RoleForm = Form.create()(RoleFormComponent)

export default class RoleModal extends Component {
  constructor (props) {
    super(props)
    this.state = { visible: false }
  }

  render () {
    return (
      <div>
        <Button type='primary' onClick={() => this.setState({ visible: true })}>
          <Icon type='plus' />
                    New Role
                </Button>
        <Modal
          title='New Role'
          width={600}
          visible={this.state.visible}
          onCancel={() => this.setState({ visible: false })}
          footer={null}
                >
          <RoleForm accesses={this.props.accesses} />
        </Modal>
      </div>
    )
  }
}

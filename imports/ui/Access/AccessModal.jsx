import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import { Modal, Button, Icon, Form, Input, message, Select } from 'antd'
import * as c from '../../models/collections'
const Option = Select.Option

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

class AccessFormComponent extends Component {
  constructor (props) {
    super(props)
    this.state = { isSubmitting: false }
  }
  handleSubmit (e) {
    this.setState({ isSubmitting: true })
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        Meteor.call('access.create', { ...values }, err => {
          this.setState({ isSubmitting: false })
          if (!err) {
            this.props.form.setFields({
              code: { value: '' },
              endpoint: { value: '' },
              description: { value: '' }
            })
            message.success('Access created.')
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
        <FormItem {...formItemLayout} label='Code'>
          {getFieldDecorator('code', {
            rules: [
              {
                required: true,
                message: 'Please input access code.',
                whitespace: true
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label='Endpoint'>
          {getFieldDecorator('endpoint', {
            rules: [
              {
                required: true,
                message: 'Please input endpoint.',
                whitespace: true
              }
            ]
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label='Menus'>
          {getFieldDecorator('menus', {
            rules: [{ required: true, message: 'Please select menu(s).' }]
          })(
            <Select mode='multiple'>
              {c.AllMenus.concat(['All']).map(menu => (
                <Option key={menu}>{menu}</Option>
                            ))}
            </Select>
                    )}
        </FormItem>
        <FormItem {...formItemLayout} label='Description'>
          {getFieldDecorator('description')(<TextArea autosize />)}
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

const AccessForm = Form.create()(AccessFormComponent)

export default class AccessModal extends Component {
  constructor (props) {
    super(props)
    this.state = { visible: false }
  }

  render () {
    return (
      <div>
        <Button type='primary' onClick={() => this.setState({ visible: true })}>
          <Icon type='plus' />
                    New Access
                </Button>
        <Modal
          title='New Access'
          width={600}
          visible={this.state.visible}
          onCancel={() => this.setState({ visible: false })}
          footer={null}
                >
          <AccessForm />
        </Modal>
      </div>
    )
  }
}

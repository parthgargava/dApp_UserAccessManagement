import React from 'react'
import { Table, Input, Popconfirm, Select } from 'antd'
import { getStringID } from '../api/utils'
const Option = Select.Option

export const EditableCell = ({ editable, value, onChange }) => (
  <div>
    {editable ? (
      <Input
        style={{ margin: '-5px 0' }}
        value={value}
        onChange={e => onChange(e.target.value)}
            />
        ) : (
            value
        )}
  </div>
)

export const EditableMultipleOptionCell = ({ editable, value, onChange, options, displayKey }) => (
  <Select
    mode='multiple'
    style={{ width: '100%' }}
    disabled={!editable}
    value={value}
    onChange={newValue => onChange(newValue)}
    >
    {options.map(option => (
      <Option key={displayKey ? getStringID(option) : option}>
        {displayKey ? option[displayKey] : option}
      </Option>
        ))}
  </Select>
)

export const EditableTagOptionCell = ({ editable, value, onChange }) => (
  <Select
    mode='tags'
    style={{ width: '100%' }}
    value={value}
    disabled={!editable}
    onChange={newValue => onChange(newValue)}
    tokenSeparators={[',']}
    />
)

export class EditableTable extends React.Component {
  constructor (props) {
    super(props)
    this.columns = props.columns.map(column => ({
      render: (text, record) => this.renderColumns(text, record, column.dataIndex),
      ...column,
      dataIndex: `item.${column.dataIndex}`
    }))
    this.columns.push({
      title: 'Operation',
      dataIndex: 'operation',
      render: (text, record) => this.renderOperationColumn(text, record)
    })

    this.state = { data: this.getDataFromItems(props.items) }
  }

  componentDidUpdate (prevProps, prevState) {
    if (JSON.stringify(prevProps.items) !== JSON.stringify(this.props.items)) {
      this.setState({ data: this.getDataFromItems(this.props.items) })
    }
  }

  getDataFromItems (items) {
    return items.map(item => ({
      key: getStringID(item),
      editable: false,
      item,
      copy: { ...item }
    }))
  }

  renderColumns (text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
            />
    )
  }

  renderOperationColumn (text, record) {
    return (
      <div>
        {record.editable ? (
          <span>
            <a onClick={() => this.save(record.key)}>Save</a>
            <Popconfirm
              title='Sure to cancel?'
              onConfirm={() => this.cancel(record.key)}
              okText='Yes'
              cancelText='No'
                        >
              <a style={{ marginLeft: '5px' }}>Cancel</a>
            </Popconfirm>
          </span>
                ) : (
                  <a onClick={() => this.edit(record.key)}>Edit</a>
                )}
      </div>
    )
  }

  handleChange (value, key, column) {
    const newData = JSON.parse(JSON.stringify(this.state.data)) // [...this.state.data];
    const target = newData.filter(one => one.key === key)[0]
    if (target) {
      let item = target.item
      const keys = column.split('.')
      keys.slice(0, -1).map(key => {
        item = item[key]
      })
      item[keys.slice(-1)[0]] = value
      this.setState({ data: newData })
    }
  }

  edit (key) {
    const newData = JSON.parse(JSON.stringify(this.state.data)) // [...this.state.data];
    const target = newData.filter(one => one.key === key)[0]
    if (target) {
      target.editable = true
      this.setState({ data: newData })
    }
  }

  save (key) {
    const newData = JSON.parse(JSON.stringify(this.state.data)) // [...this.state.data];
    const target = newData.filter(one => one.key === key)[0]
    if (target) {
      this.props.onSave(target.item, err => {
        if (!err) {
          target.editable = false
          Object.assign(target.copy, target.item)
          this.setState({ data: newData })
        }
      })
    }
  }

  cancel (key) {
    const newData = [...this.state.data]
    const target = newData.filter(one => one.key === key)[0]
    if (target) {
      target.editable = false
      Object.assign(target.item, target.copy)
      this.setState({ data: newData })
    }
  }

  render () {
    return <Table bordered dataSource={this.state.data} columns={this.columns} />
  }
}

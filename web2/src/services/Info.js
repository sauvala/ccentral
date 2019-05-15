import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Table from 'react-bootstrap/Table'

export default class Info extends Component {
  static propTypes = {
    prop: PropTypes
  }

  constructor(props) {
    super(props)
    var infos = props.infos

    this.state = {
      infos: infos
    }
  }

  renderItems(items) {
    if (items === undefined) {
      return
    }
    return (
      <tbody>
        {Object.keys(items).map((id) => {
          return (
            <tr>
              <td>{id}</td>
              <td>{items[id]}</td>
            </tr>
          )
        })}
      </tbody>
    )
  }

  render() {
    return (
      <Table striped bordered hover size="sm" >
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        {this.renderItems(this.state.infos)}
      </Table >
    )
  }
}
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Table from 'react-bootstrap/Table'

export default class Instances extends Component {
    static propTypes = {
        instances: PropTypes.array
    }

    constructor(props) {
        super(props)
        var instances = props.instanceInfo

        var keys = []
        if (instances !== undefined && instances.size > 0) {
            Object.keys(instances[0]).map((k) => {
                if (k !== "key") {
                    keys.push(k)
                }
            })
        }

        this.state = {
            instances: instances,
            keys: keys
        }
    }

    renderHeader(instances) {
        if (instances === undefined || instances.size === 0) {
            return
        }
        return (
            <thead>
                <tr>
                    <th>#</th>
                    {this.state.keys.map((n) => {
                        return <th>{n}</th>
                    })}
                    <th>State</th>
                </tr>
            </thead>
        )
    }

    renderItem() {

    }

    render() {
        return (
            <Table striped bordered hover size="sm" >
                {this.renderHeader(this.state.instances)}
                < tbody >
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td colSpan="2">Larry the Bird</td>
                        <td>@twitter</td>
                    </tr>
                </tbody>
            </Table >
        )
    }
}

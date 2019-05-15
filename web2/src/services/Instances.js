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
        if (instances !== undefined) {
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

    upperCaseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    formatHeader(key) {
        if (key.startsWith("c_")) {
            return this.upperCaseFirstLetter(key.substr(2)) + " 1/min";
        }
        if (key.startsWith("k_")) {
            return this.upperCaseFirstLetter(key.substr(2));
        }
        if (key === "ts") {
            // TODO: Handle old timestamp
        } else if (key === "v") {
            return "Version"
        } else {
            return this.upperCaseFirstLetter(key)
        }   
    }

    renderHeader(keys) {
        if (keys === undefined) {
            return
        }
        return (
            <thead>
                <tr>
                    <th>#</th>
                    {keys.map((n) => {
                        return <th>{this.formatHeader(n)}</th>
                    })}
                </tr>
            </thead>
        )
    }

    renderItem(keys, instance) {
        return keys.map((n) => {
            return <td>{this.formatData(n, instance[n])}</td>
        })
    }

    formatData(field, value) {
        if (field === "started") {
            var v = ((new Date).getTime()/1000 - parseInt(value))/60;
            if (v < 1) {
                return "Just now";
            } else if (v > 60*24) {
                return "" + Math.round(v/(60*24)) + " days";
            } else {
                return "" + Math.round(v) + " min";
            }
        }
        if (field.startsWith("c_")) {
            if (value === undefined || value.length === 0) {
                return "N/A";
            }
            return value[value.length - 1];
        }
        return value
    }

    renderItems(keys, instances) {
        if (instances === undefined) {
            return
        }
        return (
            <tbody>
                {Object.keys(instances).map((id) => {
                    return (
                        <tr>
                            <td>{instances[id].key}</td>
                            {this.renderItem(keys, instances[id])}
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    render() {
        return (
            <Table striped bordered hover size="sm" >
                {this.renderHeader(this.state.keys)}
                {this.renderItems(this.state.keys, this.state.instances)}
            </Table >
        )
    }
}

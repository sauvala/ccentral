import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Stats from './Stats';
import Info from './Info';
import Instances from './Instances';
import Configuration from './Configuration';
import { Container } from 'react-bootstrap';
import CCentralApi from '../CCentralApi';

export default class Service extends Component {

    static propTypes = {
        serviceId: PropTypes.string.required,
        ccApi: PropTypes.instanceOf(CCentralApi).required
    }

    constructor(props) {
        super(props)
        this.ccApi = props.ccApi
        this.state = {
            instanceInfo: [],
            infos: {},
            serviceId: props.serviceId,
            loaded: false
        }
        this.ccApi.getService(this.state.serviceId, this.handleServiceUpdate)
    }

    handleServiceUpdate = (data) => {
        var updatesState = {}
        if (data !== null) {
            console.log(data)
            updatesState.loaded = true
            updatesState.instanceInfo = this.loadInstanceInfo(data.clients)
            updatesState.infos = data.info
            this.setState(updatesState)
        }
    }

    loadInstanceInfo = (data) => {
        var instances = []
        Object.keys(data).map(function (key, index) {
            var s = data[key]
            s["key"] = key
            instances.push(s)
        });
        console.log(instances)
        return instances
    }

    render() {
        return (
            <Container>
                <h1>{this.state.serviceId}</h1>
                {this.state.loaded ?
                    <div>
                        <Stats />
                        <Info infos={this.state.infos}/>
                        <Instances instanceInfo={this.state.instanceInfo} />
                        <Configuration />
                    </div>
                    :
                    <p>Loading</p>
                }
            </Container>
        )
    }
}

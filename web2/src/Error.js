import React, { Component } from 'react'
import { Alert, Container, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types';

export default class ErrorBar extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            error: '',
            message: ''
        };
        if (this.props.api) {
            this.props.api.addErrorListener(this.errorEvent)
        }
    }

    errorEvent = (e) => {
        let state = {error: e.error,
                     message: e.message}
        console.log("ERROR", state)
        this.setState(state)
    }

    errorClose = (e) => {
        this.setState({
            error: '',
            message: ''
        })
    }

    sendError = (title, msg) => {
        this.setState({
            error: title,
            message: msg
        })
    }

    render() {
        if (this.state.error === '') {
            return null
        }
        return (
            <Container style={{paddingTop: "10px"}}>
                <Row className="show-grid">
                    <Col xs={12} md={12}>
                        <Alert onClose={this.errorClose} dismissible="true" variant="danger">
                            {/* <Alert.Heading></Alert.Heading> */}
                            { this.state.error }
                            <p>
                            { this.state.message }
                            </p>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        )
    }
}

ErrorBar.propTypes = {
    //ffApi: PropTypes.object.isRequired
}

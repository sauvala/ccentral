import React, { Component } from 'react'
import { Image, Container, Row, Col } from 'react-bootstrap'

export default class Main extends Component {

  render() {
    return (
      <Container>
        <Row className="justify-content-md-center" style={{ 'paddingBottom': '10px' }}>
          <Col xs={10} md={4}>
            Base
          </Col>
        </Row>
      </Container>
    )
  }
}

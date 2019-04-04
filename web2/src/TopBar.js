import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

export class TopBar extends Component {

    constructor(props) {
        super(props)
        this.api = props.api
        this.state = {
            serviceList: [],
        };
        this.api.getServices(this.handleUpdateServices)
    }

    handleUpdateServices = (data) => {
        if (data === null) {
            this.setState({serviceList: []})
            return
        }
        this.setState({serviceList: data.services})
    }

    renderServices() {
        if (this.state.serviceList != null) {
            console.log(this.state.serviceList)
            return this.state.serviceList.map((n) => {
                return (
                    <NavDropdown.Item href={"#service/" + n}>{n}</NavDropdown.Item>
                )
            })
        }
    }

    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">CCentral</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    <Nav className="mr-auto">
                        <Nav.Link href="#Main">Main</Nav.Link>
                        <NavDropdown title="Services" id="collasible-nav-dropdown">
                            {this.renderServices()}
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar >
        )
    }
}

export default TopBar
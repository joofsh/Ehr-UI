import React, { Component, PropTypes } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, CollapsibleNav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { IndexLink } from 'react-router';
import { connect } from 'react-redux';


export class App extends Component {
  static propTypes = {
    //children: PropTypes.object.isRequired,
    //pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const styles = require('./App.scss');

    return <div className="app">
      <Navbar>
        <NavbarBrand>
          <IndexLink to="/" activeStyle={{color: '#33e0ff'}}>
            <div className="brand-logo"/>
            <span className="brand-title">Patient Manager</span>
          </IndexLink>
        </NavbarBrand>

        <Navbar.Collapse>
          <Nav navbar>
            <LinkContainer to="/users">
              <NavItem>Users</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <div className="container">
        {this.props.children}
      </div>
    </div>;
  }
}

export default connect()(App);

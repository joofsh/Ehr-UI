import React, { Component, PropTypes } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, CollapsibleNav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';


export class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    ensureAuthed: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  // TODO: Check auth everytime App receives props. Currently
  // creates infinite loop
  componentWillReceiveProps(nextProps) {
    //this.props.ensureAuthed(nextProps);
  }

  componentWillMount() {
    this.props.ensureAuthed();
  }

  render() {
    const styles = require('./App.scss');
    let authed = !!this.props.session.user;

    return <div className="app">
      {authed && <Navbar>
        <NavbarBrand>
          <IndexLink to="/" activeStyle={{color: '#33e0ff'}}>
            <div className="brand-logo"></div>
            <span className="brand-title">Patient Manager</span>
          </IndexLink>
        </NavbarBrand>

        <Navbar.Collapse>
          <Nav navbar>
            <LinkContainer to="/users">
              <NavItem active={true}>Users</NavItem>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>}

      <div className="container">
        {this.props.children}
      </div>
    </div>;
  }
};

function mapDispatchToProps(dispatch) {
  return {
    ensureAuthed: (nextProps) => {
      dispatch((dispatch, getState) => {
        if (!getState().session.user) {
          console.info('redirecting to login!');
          dispatch(pushPath('/login'));
        }
      })
    }
  }
}

function mapStateToProps(state) {
  return {
    session: state.session
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App)

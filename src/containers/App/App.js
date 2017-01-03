import React, { Component, PropTypes } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Helmet from 'react-helmet';

import { LinkContainer } from 'react-router-bootstrap';
import { IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';

import config from '../../../config';

// Paths that do not require authentication
const UNRESTRICTED_PATHS = [
  /^\/$/, // homepage
  /^\/login$/, // login
  /^\/resources(.*)?/, // resources & subroutes
  /^\/(debug|context).html/ // testing pages
];

export class App extends Component {
  static propTypes = {
    authed: PropTypes.bool,
    authedStaff: PropTypes.bool,
    authedGuest: PropTypes.bool,
    children: PropTypes.object.isRequired,
    ensureAuthed: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    path: PropTypes.string
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.ensureAuthed();
  }

  componentWillReceiveProps() {
    this.props.ensureAuthed();
  }

  render() {
    let {
      logout,
      authed,
      authedGuest,
      authedStaff
    } = this.props;

    require('./App.scss');
    return (<div className="app">
      <Helmet {...config.appMeta}/>
      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to="/">
              <div className="brand-logo">
                <p className="beta-tag">Beta</p>
              </div>
              <h1 className="sr-only">DC Resources</h1>
            </IndexLink>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav navbar pullRight>
            {authedStaff && <NavDropdown title="Clients" id="user-dropdown">
              <LinkContainer to={{ pathname: '/users' }}>
                <MenuItem>
                  View Clients
                </MenuItem>
              </LinkContainer>
              <LinkContainer to={{ pathname: 'clients/new' }}>
                <MenuItem>
                  Add New Client
                </MenuItem>
              </LinkContainer>
            </NavDropdown>}
            {authedStaff && <NavDropdown title="Content" id="question-dropdown">
              <LinkContainer to={{ pathname: '/questions'}}>
                <MenuItem>
                  Manage Questions
                </MenuItem>
              </LinkContainer>
              <LinkContainer to={{ pathname: '/tags' }}>
                <MenuItem>
                  Manage Tags
                </MenuItem>
              </LinkContainer>
            </NavDropdown>}
            <NavDropdown title="Resources" id="resources-dropdown">
              {authedGuest &&
                <LinkContainer to={{ pathname: '/my_resources' }}>
                  <MenuItem>
                    My Resources
                  </MenuItem>
                </LinkContainer>}
              {authedStaff &&
                <LinkContainer to="/demo/my_resources">
                  <MenuItem>
                    Demo My Resources
                  </MenuItem>
                </LinkContainer>}
              <LinkContainer to={{ pathname: '/resources' }}>
                <MenuItem>
                  All Resources
                </MenuItem>
              </LinkContainer>
              <LinkContainer to={{ pathname: '/resources/new' }}>
                <MenuItem>
                  Submit A Resources
                </MenuItem>
              </LinkContainer>
            </NavDropdown>
            {authed ?
              <NavItem onClick={logout}>Logout</NavItem> :
              <LinkContainer to={{ pathname: '/login' }}>
                <NavItem active>Sign In</NavItem>
              </LinkContainer>}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

        {this.props.children}

      {__DEVELOPMENT__ && <div id="devtools"/>}
    </div>);
  }
}

function logoutAction() {
  return {
    type: 'CALL_API',
    method: 'put',
    url: '/logout',
    successType: (dispatch) => {
      dispatch({ type: 'INVALIDATE_CURRENT_USER' });
      dispatch(pushPath('/'));
    }
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ensureAuthed: () => {
      dispatch((dispatch, getState) => {
        let path = getState().routing.path;
        let requireAuth = true;

        UNRESTRICTED_PATHS.forEach(unrestricted_path => {
          // Skip auth check if the current path matches one of the
          // unrestricted regexes
          if (unrestricted_path.test(path)) {
            requireAuth = false;
          }
        });

        if (requireAuth && !getState().session.user) {
          console.info('redirecting to login!');
          dispatch(pushPath('/login'));
        }
      });
    },
    logout: () => {
      dispatch(logoutAction());
    }
  };
}

function mapStateToProps(state) {
  return {
    authed: !!state.session.user,
    path: state.routing.path,
    authedStaff: state.session.user && state.session.user.staff,
    // TODO: Convert this to user class with `isGuest`-like boolean properties
    authedGuest: state.session.user && state.session.user.role === 'guest'
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

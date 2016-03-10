import React, { Component, PropTypes } from 'react';
import { Navbar, Nav, NavItem, Image, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';

// Paths that do not require authentication
const UNRESTRICTED_PATHS = [
  /^\/$/, // homepage
  /^\/login$/, // login
  /^\/resources(.*)?/ // resources & subroutes
];

export class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
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
    let { logout, authedStaff } = this.props;

    require('./App.scss');
    return (<div className="app">
      {<Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to="/" activeStyle={{ color: '#3C58B6' }}>
              <div className="brand-logo"></div>
              <span className="brand-title">DC Resources</span>
            </IndexLink>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav navbar pullRight>
            {authedStaff && <LinkContainer to="/users">
              <NavItem active>Users</NavItem>
            </LinkContainer>}
            <LinkContainer to="/resources">
              <NavItem active>Resources</NavItem>
            </LinkContainer>
            <LinkContainer to="/login">
              <NavItem active>Sign In</NavItem>
            </LinkContainer>
          </Nav>
          {/*<Nav pullRight>
            <NavDropdown title={user.name} id="user-dropdown" className="pull-right">
              <NavItem onClick={logout}>Logout</NavItem>
            </NavDropdown>
            <NavItem>
              <Image src={user.image_url} className="profilePic" circle/>
            </NavItem>
          </Nav>*/}
        </Navbar.Collapse>
        </Navbar>}

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
      dispatch(pushPath('/login'));
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
    session: state.session,
    path: state.routing.path,
    authedStaff: state.session.user && state.session.user.staff
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

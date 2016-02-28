import React, { Component, PropTypes } from 'react';
import { Navbar, Nav, NavItem, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { IndexLink } from 'react-router';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';

export class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    session: PropTypes.object.isRequired,
    ensureAuthed: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.props.ensureAuthed();
  }

  // TODO: Check auth everytime App receives props. Currently
  // creates infinite loop
  componentWillReceiveProps() {
    // this.props.ensureAuthed(nextProps);
  }


  render() {
    let { session: { user } } = this.props;
    let authed = !!user;

    require('./App.scss');
    return (<div className="app">
      {authed && <Navbar>
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
          <Nav navbar>
            <LinkContainer to="/users">
              <NavItem active>Users</NavItem>
            </LinkContainer>
            <LinkContainer to="/resources">
              <NavItem active>Resources</NavItem>
            </LinkContainer>
          </Nav>
          <Nav pullRight>
            <NavItem>
              <Image src={user.image_url} className="profilePic" circle/>
              {user.name}
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>}

      <div className="container">
        {this.props.children}
      </div>
      {__DEVELOPMENT__ && <div id="devtools"/>}
    </div>);
  }
}

function mapDispatchToProps(dispatch) {
  return {
    ensureAuthed: () => {
      dispatch((dispatch, getState) => {
        if (!getState().session.user) {
          console.info('redirecting to login!');
          dispatch(pushPath('/login'));
        }
      });
    }
  };
}

function mapStateToProps(state) {
  return {
    session: state.session
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);

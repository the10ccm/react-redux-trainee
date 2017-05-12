import React from 'react';
import { withRouter, Link } from 'react-router';
import { Nav, Navbar, NavItem, NavDropdown, MenuItem
  } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';

import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import config from './config';
import * as auth from './lib/auth';
import * as actions from './actions';
import { o } from './lib/helpers';


class NavUserMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout (e) {
    e.preventDefault();
    this.props.dispatch(actions.cleanup());
    this.props.dispatch(push(config.route.logout));
  }

  render() {
    if (!auth.isAuthenticated()) {
      return (
        <Nav pullRight>
          <LinkContainer to={config.route.login} active={false}>
            <NavItem eventKey={3}>Login</NavItem>
          </LinkContainer>
          <LinkContainer to={config.route.register} active={false}>
            <NavItem eventKey={3}>Register</NavItem>
          </LinkContainer>
        </Nav>
      )
    }
    const username = o(o(this.props.profile).user).username;
    return (
      <Nav pullRight>
        <NavDropdown eventKey={3} title={username} id="basic-nav-dropdown">
          {
            this.props.current == 'update' ? null :
          <LinkContainer to={config.route.update} active={false}>
              <MenuItem eventKey={3.1}>Update</MenuItem>
          </LinkContainer>
          }
          <LinkContainer to={config.route.logout}>
            <MenuItem eventKey={3.2} onClick={this.handleLogout}>
              Logout
            </MenuItem>
          </LinkContainer>
        </NavDropdown>
      </Nav>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    dispatch: state.dispatch
  }
}
NavUserMenu = connect(mapStateToProps)(NavUserMenu);


export class Navigator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 'index'
    };
  }

  render() {
    return (
      <Navbar inverse>
        <Navbar.Header>
            <Navbar.Brand>
             <Link to={config.route.index}>Area</Link>
            </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <NavUserMenu/>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

import React from 'react';
import { Link, browserHistory } from 'react-router';
import { Form, FormGroup, FormControl, Row, Col, Button, ControlLabel, Checkbox
  } from 'react-bootstrap';

import { connect } from 'react-redux'

import * as actions from './actions';
import { ValidationHelpText, setValidationState, FormGroupField,
  NonFieldErrors } from './lib/components';
import * as auth from './lib/auth';
import { fetchProfile } from './lib/network';
import config from './config';
import { o } from './lib/helpers';


export class ProfileRow extends React.Component {
  render() {
    return (
      <Row>
        <Col md={3} componentClass={ControlLabel}>{this.props.label}</Col>
        <Col md={9}>{this.props.value}</Col>
      </Row>
    )
  }
}

class DisplayProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.props.dispatch(actions.requestGetProfile());
  }

  render() {
    return (
      <div>
        <div id="main-content">
          <h1>Profile</h1>
          <div className="profile-content">
            <ProfileRow label="Username" value={this.props.profile.user.username}/>
            <ProfileRow label="First Name" value={this.props.profile.user.firstname}/>
            <ProfileRow label="Last Name" value={this.props.profile.user.lastname}/>
            <ProfileRow label="Email" value={this.props.profile.user.email}/>
            <ProfileRow label="Birthday" value={this.props.profile.birthday}/>
            <ul>
              <Link to={config.route.update}>Update Profile</Link>
            </ul>
          </div>
        </div>
      </div>
      );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    isFetching: state.isFetching
  }
}

DisplayProfilePage = connect(mapStateToProps)(DisplayProfilePage)
export { DisplayProfilePage }

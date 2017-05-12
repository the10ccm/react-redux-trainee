// React
import React from 'react';
import { Link, browserHistory } from 'react-router';
import { Form, FormGroup, FormControl, Col, Button, ControlLabel,
  Checkbox, Row, HelpBlock, Fade, Alert } from 'react-bootstrap';

import { connect } from 'react-redux'

// 3rd party
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';

// local
import { Navigator } from './navigator';
import { ValidationHelpText, setValidationState,
  FormGroupField, FormGroupRow, NonFieldErrors } from './lib/components';
import * as auth from './lib/auth';
import * as network from './lib/network';
import config from './config';
import { o, tree, setStateForUser, setStateForProfile } from './lib/helpers';
import * as actions from './actions';

class UpdateProfilePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // Fadeout option
      open: false,
      profile: {
        // store the datetime as was derived
        birthday: moment().format(config.DATETIME_FORMAT),
        tags: '',
        user: {
          firstname: '',
          lastname: '',
          username: '',
          password: '',
          email: ''
        },
      },
      errors: {}
    }
    // Get the profile data
    this.props.dispatch(actions.requestGetProfile());
    this.onHandleSubmit = this.onHandleSubmit.bind(this);
    this.onHandleChangeDate = this.onHandleChangeDate.bind(this);
    this.fadeOut = this.fadeOut.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps", this.props.isFetching,
      nextProps.isFetching, nextProps);
    this.setState({
      open: true,
      profile: nextProps.profile,
      errors: nextProps.errors
    });
  }

  onHandleSubmit(e) {
    // Fill the payload
    const payload = {
      birthday: this.state.profile.birthday,
      user: {
        firstname: this.state.profile.user.firstname,
        lastname: this.state.profile.user.lastname,
        password: this.state.profile.user.password,
        email: this.state.profile.user.email
      }
    }
    e.preventDefault();
    this.props.dispatch(actions.requestUpdateProfile(payload));
  }

  onHandleChangeDate(value) {
    if (moment.isMoment(value)) {
      value = value.format(config.DATETIME_FORMAT);
    }
    setStateForProfile.bind(this)(value, 'birthday');
  }

  fadeOut(e) {
    const that = this;
    setTimeout(function() {
        that.setState({open: false});
      }, 1000);
  }

  render() {
    const that = this;
    return (
      <div>
        <div className="messages">
          <Fade in={this.state.open} onEnter={this.fadeOut}>
            <div>
              <Alert bsStyle="info">The profile has been updated</Alert>
            </div>
          </Fade>
        </div>
        <div id="main-content">
          <h1>Update Profile</h1>
          <div className="update-content">
            <Form horizontal onSubmit={this.onHandleSubmit}>
              <NonFieldErrors errors={o(this.state.errors).non_field_errors}/>
              <FormGroupRow label="Username"
                value={this.props.profile.user.username}/>
              <FormGroupField
                controlId="password"
                label="Password"
                type="password"
                value={o(o(o(this.state).profile).user).password||''}
                onChange={e => {
                  setStateForUser.bind(this)(e.target.value, 'password')}}
                errorText={o(o(this.state.errors).user).password}
                validationStateByError={true}/>
              <Col sm={3}>
              </Col>
              <Col sm={9}>
                <HelpBlock bsClass="help-block">
                  Enter a new password if you want to change one
                </HelpBlock>
              </Col>
              <FormGroupField
                controlId="firstname"
                label="Firstname"
                type="text" placeholder="Firstname"
                value={o(o(o(this.state).profile).user).firstname||''}
                onChange={e => {
                  setStateForUser.bind(this)(e.target.value, 'firstname')}}
                errorText={o(o(this.state.errors).user).firstname}
                validationStateByError={true}/>
              <FormGroupField
                controlId="lastname"
                label="Lastname"
                type="text" placeholder="Lastname"
                value={o(o(o(this.state).profile).user).lastname||''}
                onChange={e => {
                  setStateForUser.bind(this)(e.target.value, 'lastname')}}
                errorText={o(o(this.state.errors).user).lastname}
                validationStateByError={true}/>
              <FormGroupField
                controlId="email"
                label="Email"
                type="text"
                value={o(o(o(this.state).profile).user).email||''}
                onChange={e => {
                  setStateForUser.bind(this)(e.target.value, 'email')}}
                errorText={o(o(this.state.errors).user).email}
                validationStateByError={true}/>

              <FormGroup controlId="birthday">
                <Col componentClass={ControlLabel} sm={3}>Birthday</Col>
                <Col sm={9}>
                  <Datetime
                    timeFormat={false}
                    dateFormat="YYYY-MM-DD"
                    defaultValue={moment()}
                    value={moment(o(o(this.state).profile).birthday||'')}
                    onChange={this.onHandleChangeDate}
                    errorText={o(this.state.errors).birthday}
                    closeOnSelect={true}
                  />
                  <ValidationHelpText text={o(this.state.errors).birthday}/>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col smOffset={3} sm={4}>
                  <Button type="submit">Update Profile</Button>
                </Col>
                <Col sm={2}>
                  <Link to={config.route.index}>Cancel</Link>
                </Col>
              </FormGroup>
            </Form>
          </div>
        </div>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
    isFetching: state.isFetching,
    errors: state.errors
  }
}
UpdateProfilePage = connect(mapStateToProps)(UpdateProfilePage)

export { UpdateProfilePage }

import React from 'react';
import { withRouter, Link } from 'react-router';
import { Form, FormGroup, FormControl, Col, Button, ControlLabel, Checkbox
  } from 'react-bootstrap';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import { Navigator } from './navigator';
import { ValidationHelpText, setValidationState, FormGroupField,
  NonFieldErrors } from './lib/components';

import * as actions from './actions';
import * as auth from './lib/auth';
import { convertUserToJSON, jsonRequest } from './lib/network';
import config from './config';
import { o, setStateForUser } from './lib/helpers';


class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: {
        user: {
          firstname: '',
          lastname: '',
          email: '',
          username: '',
          password: '',
        }
      },
      errors: {}
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps", this.props.isFetching,
      nextProps.isFetching, nextProps);
    this.setState({
      errors: nextProps.errors
    });
  }


  handleSubmit(e) {
    e.preventDefault();
    var that = this;
    const payload = this.state.profile.user;
    this.props.dispatch(actions.requestCreateProfile(payload));
  }

  render() {
    // Rends Firstname, Lastname, Email, Username, Password
    const { location, history } = this.props;
    return (
      <div>
        <div className="register-content">
          <Form horizontal onSubmit={this.handleSubmit}>
            <NonFieldErrors errors={o(this.state.errors).non_field_errors}/>
            <FormGroupField
              controlId="firstname"
              label="Firstname"
              type="text"
              onChange={e => {setStateForUser.bind(this)(e.target.value, 'firstname')}}
              errorText={o(this.state.errors).firstname}
              validationStateByError={true}/>
            <FormGroupField
              controlId="lastname"
              label="Lastname"
              type="text"
              onChange={e => {setStateForUser.bind(this)(e.target.value, 'lastname')}}
              errorText={o(this.state.errors).lastname}
              validationStateByError={true}/>
            <FormGroupField controlId="username" label="Username"
              type="text"
              onChange={e => {setStateForUser.bind(this)(e.target.value, 'username')}}
              errorText={o(this.state.errors).username}
              validationStateByError={true}/>
            <FormGroupField
              controlId="password"
              label="Password"
              type="password"
              onChange={e => {setStateForUser.bind(this)(e.target.value, 'password')}}
              errorText={o(this.state.errors).password}
              validationStateByError={true}/>
            <FormGroup>
              <Col smOffset={2} sm={10}>
                <Button type="submit">Sign Up</Button>
              </Col>
            </FormGroup>
          </Form>
        </div>
      </div>
      );
  }
};

const mapStateToProps = (state) => {
  return {
    errors: state.errors
  }
}
RegisterPage = connect(mapStateToProps)(RegisterPage);

export { RegisterPage }

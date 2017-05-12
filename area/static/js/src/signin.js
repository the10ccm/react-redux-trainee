import React from 'react';
import { Link, withRouter } from 'react-router';
import { Form, FormGroup, FormControl, Col, Button, ControlLabel, Checkbox
  } from 'react-bootstrap';

import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import * as actions from './actions';
import { Navigator } from './navigator';
import { ValidationHelpText, setValidationState, FormGroupField,
  NonFieldErrors } from './lib/components';
import * as auth from './lib/auth';
import { jsonRequest } from './lib/network';
import config from './config';
import { o } from './lib/helpers';


class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errors: {user:{}}
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    auth.logout();
  }

  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps", this.props.isFetching,
      nextProps.isFetching, nextProps);
    this.setState({
      errors: nextProps.errors
    });
  }

  static sendCredentials(dispatch, username, password) {
    auth.login(username, password).then(result => {
      dispatch(actions.setProfile({
        profile: {user: {...result.json}}
      }))
      dispatch(push(config.route.index));
    }).catch(error => {
      // Unable to log in with provided credentials.
      console.log('*** Login Error Exception: ');
      console.dir(error);
      dispatch(actions.requestFailure(error.errors))
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.dispatch(
      actions.requestSendCredentials(this.state.username, this.state.password)
    );
  }

  render() {
    //console.log('Login component: ', this)
    const { location, history } = this.props;
    return (
      <div>
        <div className="sign-content">
            <Form horizontal onSubmit={this.handleSubmit}>
              <NonFieldErrors errors={o(this.state.errors).non_field_errors}/>
              <FormGroupField
                controlId="username"
                label="Username"
                type="text"
                onChange={e => {this.setState({username: e.target.value})}}
                errorText={o(this.state.errors).username}
                validationStateByError="{true}"/>
              <FormGroupField
                controlId="password"
                label="Password"
                type="password"
                onChange={e => {this.setState({password: e.target.value})}}
                errorText={o(this.state.errors).password}
                validationStateByError="{true}"/>
              <FormGroup>
                <Col smOffset={3} sm={4}>
                  <Button type="submit">
                    Sign in
                  </Button>
                </Col>
                <Col sm={3}>
                  <Link to={config.route.register}>Registration</Link>
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

LoginPage = connect(mapStateToProps)(LoginPage);

export { LoginPage }


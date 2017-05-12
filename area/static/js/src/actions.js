export const SEND_PROFILE = "SEND_PROFILE"
export const REQUEST_INITIATED = "REQUEST_INITIATED"
export const REQUEST_PROCESSED = "REQUEST_PROCESSED"
export const SET_PROFILE = "SET_PROFILE"
export const REQUEST_FAILURE = "REQUEST_FAILURE"
export const SEND_CREDENTIALS = "SEND_CREDENTIALS"
export const CLEANUP = "CLEANUP"
export const CLEANUP_ERRORS = "CLEANUP_ERRORS"

import { push } from 'react-router-redux'

import config from './config';
import { o } from './lib/helpers';
import * as auth from './lib/auth';
import * as network from './lib/network'
import { LoginPage } from './signin'


export function cleanup() {
  return {
    type: CLEANUP
  }
}

// Cleanup the errors set in the state
export function cleanupErrors() {
  return {
    type: CLEANUP_ERRORS
  }
}

// Indicates that the processing has been finished
export function requestProcessed() {
  return {
    type: REQUEST_PROCESSED
  }
}

// Indicates that the processing is started
export function requestInitiated() {
  return {
    type: REQUEST_INITIATED
  }
}

// Update the profile
export function setProfile(profile) {
  return {
    type: SET_PROFILE,
    profile,
  }
}

export function requestFailure(errors) {
  return {
    type: REQUEST_FAILURE,
    status: 'error',
    errors
  }
}


// Async actions
//
// Send the credentials
export function requestSendCredentials(username, password) {
  return function (dispatch) {
    return LoginPage.sendCredentials(dispatch, username, password);
  }
}

// Get the profile
export function requestGetProfile() {
  return function (dispatch) {
    dispatch(requestInitiated());
    return network.fetchProfile().then(data => {
      dispatch(setProfile(data))
      //dispatch(requestProcessed());
    }).catch(error => {
      console.log('Error catch:', this, 'err: ', error);
      dispatch(requestFailure(error.errors))
    });
  }
}

// Create a person
export function requestCreateProfile(payload) {
  return function (dispatch) {
    // Here we may send some processing status
    //dispatch(requestInitiated());
    return network.createProfile(payload).then(data => {
      // parsed data
      console.log('Parsed response: ', data);
      // Return JSON if success
      dispatch(setProfile({user: payload}));
      auth.signin(data.json['token']);
      dispatch(push(config.route.index));
     //dispatch(requestProcessed());
    }).catch(error => {
      console.log('Error catch this: ', this, 'err: ');
      console.dir(error);
      dispatch(requestFailure(error.errors))
    });
  }
}

// Update the profile
export function requestUpdateProfile(payload) {
  return function (dispatch) {
    // Here we may send some processing status
    //dispatch(requestInitiated());
    return network.sendProfile(payload).then(data => {
      // parsed data
      console.log('Parsed response: ', data);
      // Return JSON if success
      dispatch(setProfile(payload));
      //dispatch(requestProcessed());
    }).catch(error => {
      console.log('Error catch this: ', this, 'err: ');
      console.dir(error);
      dispatch(requestFailure(error.errors))
    });
  }
}
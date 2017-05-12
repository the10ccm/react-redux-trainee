import 'whatwg-fetch';

import config from '../config';
import * as actions from '../actions';
import { o } from './helpers';


export function convertJSONToUser(data) {
  return {
      username: o(data).username,
      email: o(data).email,
      // we have to convert DB's names here
      firstname: o(data).first_name,
      lastname: o(data).last_name
  }
}

export function convertUserToJSON(data) {
  return {
    //username: o(data.user).username,
    password: o(data).password,
    username: o(data).username,
    email: o(data).email,
    // we have to convert DB's names here
    first_name: o(data).firstname,
    last_name: o(data).lastname
  }
}

export function convertProfileToJSON(data) {
  return {
    birthday: data.birthday,
    tags: data.tags,
    user: {...convertUserToJSON(data.user)}
  }
}

export function convertJSONToProfile(data) {
  return {
    birthday: data.birthday,
    tags: data.tags,
    user: {...convertJSONToUser(data.user)}
  }
}

/*
*  Successful Response ::= {
*    response: response,
*    data: {param: value}
*  }
*
*  Exception ::= {
*    response: response,
*    errors: {
*      non_field_errors: [],
*      field: value
*  }}
*/
export function jsonRequest(url, method, payload) {
  // collects the response's data
  var data = {};
  var headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  if (localStorage['token'])
    headers['Authorization'] = 'Token ' + localStorage['token'];

  console.log('send payload: '+JSON.stringify(payload||'')+' by method: '+method+' header: '+JSON.stringify(headers));

  var params = {
    method: method,
    headers: headers,
  };

  if (!['GET', 'HEAD'].includes(method)) {
    params['body'] = JSON.stringify(payload);
  }
  return fetch(url, params).then(response => {
    // check the status, return parsed data
    data['response'] = response;
    data['success'] = response.ok ? true : false;
    return response.json()
  }).then(json => {
    // fill the data
    console.log('response json', json);
    if (data['success'] == false) {
      // Fills errors to json
      console.log('raw response: ', data.response);
      let error = new Error(data.response.statusText);
      error.errors = json;
      error.response = data.response;
      throw error;
    }
    data['json'] = json;
    return data;
  }).catch(error => {
    // Raises the final exception
    console.log('Errors detected', error);
    if ('errors' in error) {
      // Here are a JSON's errors
      console.log('DRF JSON response detected');
      console.log('error: ', error);
      // pass the exception farther
      throw error;
    }
    // We caught a parsing json data exception
    // Believe it was an http error (404, 500, ...)
    console.log('HTTP error detected', data);
    let http_error = new Error(data.response.statusText);
    let error_text = 'HTTP Error: ' + data.response.statusText +
                     ' (' + data.response.status + ')';
    http_error.errors = {
      non_field_errors: [error_text]
    };
    console.log("error_text exception: ", error_text);
    http_error.response = data.response;
    console.log('send exception: ', http_error);
    console.dir(http_error);
    throw http_error;
  })
}


// Get the profile
export function fetchProfile() {
  return jsonRequest(config.baseUrl+config.api.personUrl, 'GET').then(data => {
    // parsed data
    console.log('Parsed response: ', data);
    // Return JSON if success
    if (!('user' in data.json)) {
      // Response is malformed
      var error = new Error('Response data malformed.');
      error.errors = {non_field_errors: 'Server Error'};
      throw error;
    }
    return convertJSONToProfile(data.json);
  });
}


// Send the update
export function sendProfile(payload) {
  return jsonRequest(
    config.baseUrl+config.api.personUrl,
    'PUT',
    convertProfileToJSON(payload)
  );
}

// Create the profile
export function createProfile(payload) {
  return jsonRequest(
    config.baseUrl+config.api.registerUrl,
    'POST',
    convertUserToJSON(payload));
}

import config from '../config';
import {jsonRequest} from './network';


export function isAuthenticated() {
  console.log('*** isAuthenticated: ', localStorage.token);
  return ('token' in localStorage) ? true : false;
}


export function login(username, password) {
  console.log('*** Login Request. Send credentials: ', username, password);
  const payload = {
    username: username,
    password: password
  };
  return jsonRequest(config.baseUrl+config.api.authUrl, 'POST', payload)
    .then(data => {
      // parsed data
      console.log('Parsed response: ', data);
      // Return JSON if success
      if (!('token' in data.json)) {
        // Response malformed
        var error = new Error('Response data malformed.');
        //error.response = ;
        throw error;
      }
      signin(data.json['token']);
      console.log('*** Login succeeded', data);
      return data;
    })
}


export function signin(token) {
  localStorage.token = token;
}

export function getToken() {
  return localStorage.token
}

export function logout(cb) {
  delete localStorage.token;
  if (cb) cb();
}



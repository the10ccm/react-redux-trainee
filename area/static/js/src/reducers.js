import { combineReducers } from 'redux'
import { LOCATION_CHANGE, routerReducer } from 'react-router-redux'

import { SEND_PROFILE, SET_PROFILE, REQUEST_FAILURE,
  REQUEST_PROCESSED, REQUEST_INITIATED, SEND_CREDENTIALS,
  CLEANUP, CLEANUP_ERRORS
} from './actions'


export const initialState = {
  profile: {
    birthday: '',
    tags: '',
    user: {
      firstname: '',
      lastname: '',
      username: '',
      email: ''
    }
  },
  isFetching: false,
  // The set of field and non-field errors
  errors: {}
}

// Profile property of the state
function profile(state = initialState.profile, action) {
  switch(action.type) {
    case SET_PROFILE:
      return { ...state,
        ...action.profile,
        user: {
          ...state.user,
          ...action.profile.user}
      };
    case CLEANUP:
      return initialState;
    default:
      return state;
  }
}

// isFetching property
function isFetching(state = initialState.isFetching, action) {
  switch(action.type) {
    case REQUEST_FAILURE:
    case REQUEST_PROCESSED:
      return false
    case REQUEST_INITIATED:
      return true
    case CLEANUP:
      return initialState.isFetching
    default:
      return state
  }
}

// Errors property
function errors(state = initialState.errors, action) {
  switch(action.type) {
    case REQUEST_FAILURE:
      return action.errors;
    case LOCATION_CHANGE:
      // clear errors {} due to react-router-redux
    case CLEANUP:
    case CLEANUP_ERRORS:
      return initialState.errors;
    default:
      return state
  }
}

export const rootAppReducer = combineReducers(
  {
    profile,
    isFetching,
    routing: routerReducer,
    errors
  }
)
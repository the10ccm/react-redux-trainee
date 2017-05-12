import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexLink, Link, Redirect, IndexRoute,
  browserHistory, hashHistory
  } from 'react-router';

import { syncHistoryWithStore, routerMiddleware, push } from 'react-router-redux'

import { createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'

// local import
import { Navigator } from './navigator';
import { LoginPage } from './signin';
import { RegisterPage } from './registration';
import { DisplayProfilePage } from './profile';
import { UpdateProfilePage } from './update';

import * as auth from './lib/auth';
import config from './config';
import { o } from './lib/helpers';

import { rootAppReducer, initialState } from './reducers'
import * as actions from './actions'


const loggerMiddleware = createLogger()
const routerMW = routerMiddleware(browserHistory)

let store = createStore(
  rootAppReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    loggerMiddleware, // neat middleware that logs actions
    routerMW
  )
);


let unsubscribe = store.subscribe(() =>
  console.log("*** STORE changes state: ", store.getState())
)
//store.dispatch(getProfile());


class App extends React.Component {
  constructor(props, ...other) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
    console.log('INIT APP, props: ', this.props, other);
    this.isUsernameRestored();
  }

  // fetch the profile if the user has been already authenticated
  isUsernameRestored() {
    if (auth.isAuthenticated()) {
      this.props.dispatch(actions.requestGetProfile);
    }
  }

  componentWillMount() {
    console.log('+++ App mounted');
    this.props.dispatch(actions.cleanupErrors());
  }

  componentWillReceiveProps(nextProps) {
    console.log('+++ APP receiver props:', nextProps);
    //this.isUsernameRestored();
  }

  static requireAuth(nextState, replace) {
    const isLogged = auth.isAuthenticated()
    if (!isLogged) {
      localStorage.returnPath = nextState.location.pathname;
      replace({
        // redirect to page
        pathname: config.route.login,
        // come back to current page
        state: { nextPathname: nextState.location.pathname}
      });
    }
  }

  static logout(nextState, replace) {
    auth.logout();
    replace({pathname: config.route.login});
  }

  render() {
    return (
      <div>
        <Navigator/>
        {this.props.children}
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    profile: state.profile,
  }
}
App = connect(mapStateToProps)(App);

// init history to watch for navigation events
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path={config.route.index} component={App}>
        <IndexRoute component={DisplayProfilePage}
          onEnter={App.requireAuth} />
        <Route path={config.route.update}
          component={UpdateProfilePage}
          onEnter={App.requireAuth} />
        <Route path={config.route.login}
          component={LoginPage}/>
        <Route path={config.route.register}
          component={RegisterPage} />
        <Route path={config.route.logout}
          onEnter={App.logout} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('content')
)

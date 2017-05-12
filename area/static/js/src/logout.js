import React from 'react';
import { withRouter } from 'react-router';

import * as auth from './lib/auth';
import config from './config';

class WRLogoutPage extends React.Component {
  constructor(props) {
    super(props);
    auth.logout();
    this.props.router.push(config.route.index);
  }

  render() {
    return null;
  }
}

export var LogoutPage = withRouter(WRLogoutPage);

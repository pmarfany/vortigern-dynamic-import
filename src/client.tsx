import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
const { Router } = require('react-router');
import { configureStore } from './app/redux/store';
import 'isomorphic-fetch';
import Routes from './app/routes';
import {createBrowserHistory} from 'history';

const browserHistory = createBrowserHistory();
const store = configureStore(
  browserHistory,
  window.__INITIAL_STATE__,
);

ReactDOM.hydrate(
  <Provider store={store} key="provider">
    <Router history={browserHistory}>
      <Routes />
    </Router>
  </Provider>,
  document.getElementById('app'),
);

import 'es6-promise/auto';
import 'isomorphic-fetch';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
const { Router } = require('react-router');
import { configureStore } from './app/redux/store';
import 'isomorphic-fetch';
import Routes from './app/routes';
import {createBrowserHistory} from 'history';
import {preloadReady} from 'react-loadable';

const browserHistory = createBrowserHistory();
const store = configureStore(
  browserHistory,
  window.__INITIAL_STATE__,
);

preloadReady().then(() => {
  ReactDOM.hydrate(
    <Provider store={store} key="provider">
      <Router history={browserHistory}>
        <Routes />
      </Router>
    </Provider>,
    document.getElementById('app'),
  );
});

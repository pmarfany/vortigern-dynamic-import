import * as React from 'react';
import {Route} from 'react-router';
import {About, App, Home} from 'containers';

export default () => (
  <App>
    {/*<Route path="/about" component={About} />*/}
    <About />
    <Route path="/" exact={true} component={Home} />
  </App>
);

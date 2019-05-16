const appConfig = require('../config/main');

import 'es6-promise/auto';
import 'isomorphic-fetch';

import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Loadable from 'react-loadable';
import {getBundles} from 'react-loadable-ssr-addon';

import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router';
import {createMemoryHistory} from 'history';
import { configureStore } from './app/redux/store';
import Routes from './app/routes';

import { Html } from './app/containers';
const manifest = require('../build/manifest.json');
const stats = require('../build/assets-manifest.json');

const express = require('express');
const path = require('path');
const compression = require('compression');
const Chalk = require('chalk');
const favicon = require('serve-favicon');

const app = express();

app.use(compression());

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackConfig = require('../config/webpack/dev');
  const webpackCompiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    historyApiFallback: true,
    quiet: true,
  }));

  app.use(require('webpack-hot-middleware')(webpackCompiler));
}

app.use(favicon(path.join(__dirname, 'public/favicon.ico')));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  const location = req.url;
  const memoryHistory = createMemoryHistory(req.url);
  const store = configureStore(memoryHistory);
  const modules = [];

  const markup = ReactDOMServer.renderToString(
    <Loadable.Capture report={(moduleName) => {
      console.log('Capturing module', moduleName);
      modules.push(moduleName);
    }}>
      <Provider store={store} key="provider">
        <StaticRouter location={location} context={{}}>
          <Routes/>
        </StaticRouter>
      </Provider>
    </Loadable.Capture>,
  );

  const modulesToBeLoaded = [...stats.entrypoints, ...modules];
  console.log(location, modulesToBeLoaded);
  const bundles = getBundles(stats, modulesToBeLoaded);

  res.status(200).send(renderHTML(markup, store, bundles));
});

Loadable.preloadAll().then(() => {
  app.listen(appConfig.port, appConfig.host, (err) => {
    if (err) {
      console.error(Chalk.bgRed(err));
    } else {
      console.info(Chalk.black.bgGreen(
        `\n\n💂  Listening at http://${appConfig.host}:${appConfig.port}\n`,
      ));
    }
  });
});

function renderHTML(markup: string, store: any, bundles: any) {
  const html = ReactDOMServer.renderToString(
    <Html markup={markup} manifest={manifest} store={store} bundles={bundles} />,
  );

  return `<!doctype html> ${html}`;
}

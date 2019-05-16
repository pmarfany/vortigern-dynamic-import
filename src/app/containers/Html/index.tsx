import { IStore } from 'redux/IStore';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import serialize from 'serialize-javascript';

interface IHtmlProps {
  manifest?: any;
  markup?: string;
  store?: Redux.Store<IStore>;
  bundles?: any;
}

class Html extends React.Component<IHtmlProps, {}> {

  public render() {
    const head = Helmet.rewind();
    const { markup, store } = this.props;

    const bundleScripts = (this.props.bundles.js || []);
    const bundleStyles = (this.props.bundles.css || []);

    const renderStyles = bundleStyles.map(({publicPath}, i) =>
      <link key={i} rel="stylesheet" type="text/css" href={publicPath} />,
    );

    const renderScripts = bundleScripts.map(({publicPath}, i) =>
      <script src={publicPath} key={i} />,
    );

    // tslint:disable-next-line:max-line-length
    const initialState = (
      <script dangerouslySetInnerHTML={{ __html: `window.__INITIAL_STATE__=${serialize(store.getState(), { isJSON: true })};` }}
              charSet="UTF-8" />
    );

    return (
      <html>
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}

          {renderStyles}
          <link rel="shortcut icon" href="/favicon.ico" />
        </head>
        <body>
          <main id="app" dangerouslySetInnerHTML={{ __html: markup }} />
          {initialState}
          {renderScripts}
        </body>
      </html>
    );
  }
}

export { Html }

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router';

import './src/global/less/global.less';

import GlobalHeader from './src/global/layout/GlobalHeader/index';
import SideNav from './src/global/layout/SideNav/index';

export default class Layout extends React.Component {
  render() {
    return (
      <div className="layout">
        <GlobalHeader />
        <SideNav pathName={this.props.location.pathname} />
        {this.props.children}
      </div>
    );
  }
}

const routes = {
  path: '/',
  component: Layout,
  getIndexRoute(history, callback) {
    require.ensure([], function (require) {
      callback(null, require('./src/pages/default/index').default);
    });
  },
  getChildRoutes(history, callback) {
    if (history.location.pathname === '/') {
      require.ensure([], function (require) {
        callback(null, [
          require('./src/pages/default/index').default
        ]);
      });
    } else if (history.location.pathname === '/dbInfo' || history.location.pathname === '/memoryInfo' || 
      history.location.pathname === '/qpsInfo') {
      require.ensure([], function (require) {
        callback(null, [
          require('./src/pages/dbInfo/index').default,
          require('./src/pages/memoryInfo/index').default,
          require('./src/pages/qpsInfo/index').default
        ]);
      });
    }
  } 
};

ReactDOM.render(
  <Router history={hashHistory} routes={routes} />,
  document.getElementById('app')
);

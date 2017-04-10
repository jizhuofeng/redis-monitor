import React from 'react';
import {Link} from 'react-router';

import './style';

class GlobalHeader extends React.Component {
  render() {
    return (
      <div className="global-header">
        <Link to="/">
          <div className="logo"></div>
        </Link>
      </div>
    );
  }
}

export default GlobalHeader;

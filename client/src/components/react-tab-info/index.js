import React from 'react';

import './style';

export class TabInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.data.length !== 0) {
      let tabBlock = this.props.data.map((data, index) => {
        if(this.props.selected == index + 1) {
          return (
            <div key={'tab-info' + index} className="tab-block selected" style={{
              width: (1.0 / this.props.data.length) * 100 + '%'
            }} onClick={data.loadDetail}>
              <div className="number">{data.number}</div>
              <div className="info-name">{data.name}</div>
            </div>
          );
        }else {
          return (
            <div key={'tab-info' + index} className="tab-block" style={{
              width: (1.0 / this.props.data.length) * 100 + '%'
            }} onClick={data.loadDetail}>
              <div className="number">{data.number}</div>
              <div className="info-name">{data.name}</div>
            </div>
          );
        }
      });

      return (
        <div className="tab-info">
          {tabBlock}
        </div>
      );
    } else {
      return (
        <div className="tab-info">
          <div className="loading">
            <img className="loading-img" src="http://cdn1.showjoy.com/images/17/170c6b32594b4c56b66dd7b79f9c6b8b.png"/>
            <div className="loading-content">数据加载中，请稍候…</div>
          </div>
        </div>
      );
    }
  }
}
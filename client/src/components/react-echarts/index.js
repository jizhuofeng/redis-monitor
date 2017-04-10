import React from 'react';
import ReactEcharts from 'echarts-for-react';

import './style';

export class Charts extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="charts">
        <div className="charts-name">{this.props.title}</div>
        <ReactEcharts option={this.props.option} showLoading={this.props.loading}/>
      </div>
    );
  }
}
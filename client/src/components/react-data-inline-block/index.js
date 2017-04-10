import React from 'react';

import './style';

export class DataInlineBlock extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.data.length === 0) {
      return (
        <div className="data-inline-block"></div>
      );
    } else {
      let tempNodeArr = this.props.data.map((data, index) => {
        let typeClass = data.type === 'up' ? "data-block up" : "data-block down";
        let typeArrow = data.type === 'up' ? "↑" : "↓";

        let typeClass2 = data.type2 === 'up' ? "data-block up" : "data-block down";
        let typeArrow2 = data.type2 === 'up' ? "↑" : "↓";

        if(data.name2 != null) {
          return (
            <div key={'data-index-' + index} className={typeClass}>
              <div className="data-content grid-left">
                <div className="title">{data.name}</div>
                <div className="number">{data.number}</div>
                <div className="sub-title">较前一{this.props.timeType === 'day' ? '天' : '月'}</div>
                <div className="sub-number">{typeArrow} {data.rate}</div>
              </div>
              <div className="data-content grid-right">
                <div className="title">{data.name2}</div>
                <div className="number">{data.number2}</div>
                <div className="sub-title">较前一{this.props.timeType2 === 'day' ? '天' : '月'}</div>
                <div className="sub-number">{typeArrow2} {data.rate2}</div>
              </div>
            </div>
          );
        }else {
        return (
          <div key={'data-index-' + index} className={typeClass}>
            <div className="data-content grid-left">
              <div className="title">{data.name}</div>
              <div className="number">{data.number}</div>
              <div className="sub-title">较前一{this.props.timeType === 'day' ? '天' : '月'}</div>
              <div className="sub-number">{typeArrow} {data.rate}</div>
            </div>
              <div className="data-content grid-right center">
                <div className="rate">店长：{data.seller}</div>
                <div className="rate">买家：{data.buyer}</div>
              </div>
          </div>
        );
        }
      });

      return (
        <div className="data-inline-block">
          {tempNodeArr}
        </div>
      );
    }
  }
}
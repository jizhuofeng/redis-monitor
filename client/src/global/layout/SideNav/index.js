import React from 'react';
import {hashHistory} from 'react-router';
import {Icon} from 'antd';

import locationProps from '../../conf/location';

import './style';

class SideNav extends React.Component {
  constructor(props) {
    super(props);

    let sideNavProps = locationProps;
    let currentUrl = this.props.pathName;

    sideNavProps.forEach(data => {
      data.listShow = false;
      data.currentTitle = false;
      if (data.list) {
        data.list.forEach((dataList) => {
          dataList.current = false;
          if (dataList.pageUrl === currentUrl) {
            data.listShow = true;
            data.currentTitle = true;
            dataList.current = true;
          }
        });
      } else if (data.pageUrl) {
        if (data.pageUrl === currentUrl) {
          data.listShow = true;
          data.currentTitle = true;
        }
      }
    });

    this.state = {
      sideNavProps: sideNavProps
    };
  }

  setListShow = (data, index) => {
    let tempState = Object.assign({}, this.state);
    let tempListShow = tempState.sideNavProps[index].listShow;
    if (tempState.sideNavProps[index].list) {
      tempState.sideNavProps.forEach((value, key) => {
        if (index === key) {
          value.listShow = !tempListShow;
        } else {
          value.listShow = false;
        }
      });
      this.setState(tempState);
    } else {
      tempState.sideNavProps.forEach((value, key) => {
        if (index === key) {
          value.listShow = !tempListShow;
          value.currentTitle = true;
        } else {
          value.listShow = false;
          value.currentTitle = false;
          value.list.forEach(tempListData => {
            tempListData.current = false;
          });
        }
      });

      this.setState(tempState, ()=> {
        hashHistory.push(tempState.sideNavProps[index].pageUrl);
      });
    }
  };

  setSideNavListCurrent = (titleIndex, listIndex, url) => {
    let tempState = Object.assign({}, this.state);
    tempState.sideNavProps.forEach((data, index) => {
      if (index === titleIndex) {
        data.listShow = true;
        data.currentTitle = true;
        data.list.forEach((tempListData, tempListIndex) => {
          tempListData.current = tempListIndex === listIndex;
        });
      } else {
        data.listShow = false;
        data.currentTitle = false;
        if (data.list) {
          data.list.forEach(tempListData => {
            tempListData.current = false;
          });
        }
      }
    });
    this.setState(tempState, () => {
      hashHistory.push(url);
    });
  };

  renderSideNavNode = (sideNavProps) => {
    let sideBarNode = [];

    sideNavProps.forEach((data, index) => {
      if (data.list) {
        let operateNode = <div className="operate">
          {data.listShow ? '收起' : '展开'}<Icon style={{marginLeft: '5px'}} type={data.listShow ? 'up' : 'down'}/>
        </div>;

        sideBarNode.push(
          <li key={index} className={data.currentTitle ? "list-title title-active" : "list-title"}
              onClick={() => this.setListShow(data, index)}>
            <Icon style={{marginRight: '5px'}} type={data.listIcon}/>{data.listTitle}
            {operateNode}
          </li>
        );

        data.list.forEach((dataList, key) => {
          if (data.listShow) {
            if (dataList.current) {
              sideBarNode.push(
                <li key={index + '-' + key} className="list-node active">
                  {dataList.pageName}
                </li>
              );
            } else {
              sideBarNode.push(
                <li key={index + '-' + key} className="list-node"
                    onClick={() => this.setSideNavListCurrent(index, key, dataList.pageUrl)}>
                  {dataList.pageName}
                </li>
              );
            }
          } else {
            sideBarNode.push(
              <li key={index + '-' + key} className="list-node list-hide"
                  onClick={() => this.setSideNavListCurrent(index, key, dataList.pageUrl)}>
                {dataList.pageName}
              </li>
            );
          }
        });

      } else if (data.pageUrl) {
        sideBarNode.push(
          <li key={index} className={data.currentTitle ? "list-title title-active" : "list-title"}
              onClick={() => this.setListShow(data, index)}>
            <Icon style={{marginRight: '5px'}} type={data.listIcon}/>{data.listTitle}
          </li>
        );
      }
    });

    return sideBarNode;
  };

  render() {
    let tempSideNavProps = this.state.sideNavProps;

    return (
      <ul className="side-nav">
        {this.renderSideNavNode(tempSideNavProps)}
      </ul>
    );
  }
}

export default SideNav;

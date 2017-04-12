import React from 'react';

import { Input, Button, Spin, Form, Row, Col, message, Tabs, Icon, Tag, 
  Modal, Select, Dropdown, Card} from 'antd';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
const Option = Select.Option;

import { Glo_getRequest, Glo_postRequest } from '../../global/js/request';
import { Glo_timeStampFormat } from '../../global/js/date';
import {Charts} from '../../components/react-echarts/index';

import './style';

//page framework
class PageContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    	instances: [],
    	currentInstance: {

    	},
    	loading: false,
    	chartOption: {
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['keys']
			},
			grid: {
				left: '3%',
				right: '3%',
				bottom: '2%',
				containLabel: true
			},
			xAxis: [
				{
					type: 'category',
					data: []
				}
			],
			yAxis: [
				{
					type: 'value'
				}
			],
			series: [
				{
					name: 'keys',
					type: 'bar',
					data: []
				}
			]
		}
	};
  }
  renderCharts = (value) => {
  	let tempState = Object.assign({}, this.state);
  	tempState.loading = false;
  	let dbs = [];
  	let dbkeys = [];
  	if(value.data.Keyspace) {
  		for(let info in value.data.Keyspace) {
  			dbs.push(info);
  			let tmp = value.data.Keyspace[info];
  			let keyNum = tmp.split(',')[0].split('=')[1];
  			dbkeys.push(keyNum);
  		}
  	}
  	tempState.chartOption.xAxis[0].data = dbs;
  	tempState.chartOption.series[0].data = dbkeys;
  	this.setState(tempState);
  }
  getInstanceBaseInfo = (instance) => {
  	let _self = this;
  	let tempState = Object.assign({}, this.state);
  	tempState.loading = true;
  	_self.setState(tempState);
  	let data = {
  		name: instance.name
  	}
  	//获取实例基本信息
  	Glo_getRequest({
  		context: _self,
  		init: false,
  		data: data,
  		url: '/monitor/server/base-info',
  		response: (err, res) => {
  			let responseResult = JSON.parse(res.text);
  			if (responseResult.code === 1) {
  				_self.renderCharts(responseResult);
  			} else {
  				let tempState = Object.assign({}, this.state);
  				tempState.loading = false;
  				_self.setState(tempState);
  				message.error(responseResult.message);
  			}
  		}
  	});
  }
  instanceChange = (value) => {
  	let tempState = Object.assign({}, this.state);
    for(let i = 0; i < tempState.instances.length; i++) {
      if(tempState.instances[i].showName == value) {
        tempState.currentInstance = tempState.instances[i];
        break;
      }
    }
  	this.setState(tempState, () => {
      this.getInstanceBaseInfo(tempState.currentInstance); 
    });
  }
  initInstances = (value) => {
    let tempState = Object.assign({}, this.state);
    tempState.instances = [];
    for(let key in value.data) {
      tempState.instances.push({
        showName: key + '(' + value.data[key].host + 
          ':' + value.data[key].port + ')',
        name: key,
        host: value.data[key].host,
        port: value.data[key].port
      })
    }
    if(tempState.instances[0]) {
    	tempState.currentInstance = tempState.instances[0];
    }
    
    this.setState(tempState, () => {
      if(tempState.instances.length > 0) {
        this.getInstanceBaseInfo(this.state.instances[0]);
      }
    });

  }
  componentWillMount() {
    let _self = this;
    Glo_getRequest({
      context: _self,
      init: true,
      url: '/monitor/instance',
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.code === 1) {
          _self.initInstances(responseResult);
        } else {
          message.error(responseResult.message);
        }
      }
    });
  }

  render() {
    let _self = this;
    return (
      <div className="main-content">
        <div className="content-block top-block">
        	<Select placeholder="请选择实例" 
        		style={{ width: '30%' }}
            value={_self.state.currentInstance.showName}
        		onChange={(value) => _self.instanceChange(value)}>
        		{this.state.instances.map( (data, index)=> {
        			return <Option key={index} value={data.showName}>{data.showName}</Option>
        		})}
        	</Select>
        </div>
        <div className="content-block">
        
        </div>
        <div className="content-block">
 			    <Charts title={"key分布图"} loading={_self.state.loading} option={_self.state.chartOption}/>
          <Card title="keys说明">
            <p>实例中每个db包含的key的总数量</p>
          </Card>
        </div>

      </div>
    );
  }
}

let route = {
  path: '/dbInfo',
  component: PageContent
};

export default route;
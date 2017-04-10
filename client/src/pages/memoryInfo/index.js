import React from 'react';
import moment from 'moment';

import { Input, Button, Spin, Form, Row, Col, DatePicker, message, Tabs, Icon, Tag, 
  Modal, Select, Dropdown, Card} from 'antd';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

import { Glo_getRequest, Glo_postRequest } from '../../global/js/request';
import { Glo_timeStampFormat } from '../../global/js/date';
import {Charts} from '../../components/react-echarts/index';
import {Glo_getCurrentDate, Glo_getPreDate} from '../../global/js/date';
import './style';

//page framework
class PageContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	loading: false,
    	beginTime: moment().hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss'),
    	endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    	type: '1',
    	instances: [],
    	currentInstance: {

    	},
    	chartOption: {
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				data: ['memory(M)']
			},
			grid: {
				left: '4%',
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
					name: 'memory(M)',
					type: 'line',
					data: []
				}
			]
		}
	};
  }
  rangePickChange = (timeArr) => {
    let tempState = Object.assign({}, this.state);
    tempState.beginTime = timeArr[0];
    tempState.endTime = timeArr[1];
    this.setState(tempState);
  };
  typeChange = (value) => {
    let tempState = Object.assign({}, this.state);
   	tempState.type = value;
    this.setState(tempState);	
  }
  renderCharts = (value) => {
  	let tempState = Object.assign({}, this.state);
  	tempState.loading = false;
  	let times = [];
  	let memory = [];
  	if(value.data) {
  		for(let i = 0; i < value.data.length; i++) {
  			let item = value.data[i];
  			times.push(item.time);
  			memory.push(item.value/1024/1024)
  		}
  	}
  	tempState.chartOption.xAxis[0].data = times;
  	tempState.chartOption.series[0].data = memory;
  	this.setState(tempState);
  }
  instanceChange = (value) => {
  	let tempState = Object.assign({}, this.state);
  	tempState.currentInstance = {
  		name: value
  	}
  	this.setState(tempState);
  }
  initInstances = (value) => {
    let tempState = Object.assign({}, this.state);
    tempState.instances = [];
    for(let key in value.data) {
      tempState.instances.push({
        name: key,
        host: value.data[key].host,
        port: value.data[key].port
      })
    }
    if(tempState.instances[0]) {
    	tempState.currentInstance = tempState.instances[0];
    }
    
    this.setState(tempState);
    this.reqMemoryData();
  }
  reqMemoryData = () => {
  	let _self = this;
  	let data = {
  		name: this.state.currentInstance.name,
  		type: this.state.type,
  		beginTime: this.state.beginTime,
  		endTime: this.state.endTime
  	}
  	Glo_getRequest({
      context: _self,
      init: false,
      data: data,
      url: '/monitor/server/memory-change',
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.code === 1) {
          _self.renderCharts(responseResult);
        } else {
          message.error(responseResult.message);
        }
      }
    });

  }
  componentWillMount() {
    let _self = this;
    let tempState = Object.assign({}, this.state);
   	tempState.beginTime = moment(this.currentDate).hour(0).minute(0).second(0).format('YYYY-MM-DD HH:mm:ss');
   	tempState.endTime = moment(this.currentDate).hour(23).minute(59).second(59).format('YYYY-MM-DD HH:mm:ss');
    this.setState(tempState);
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
        		style={{ width: '15%' }}
        		onChange={(value) => _self.instanceChange(value)}>
        		{this.state.instances.map( (data, index)=> {
        			return <Option key={index} value={data.name}>{data.name}</Option>
        		})}
        	</Select>
        	<Select placeholder="请选择统计类型" defaultValue={"按分钟"}
        		style={{ width: '15%' }}
        		onChange={(value) => _self.typeChange(value)}>
        		<Option value="1">按分钟</Option>
        		<Option value="2">按小时</Option>
        		<Option value="3">按天</Option>
        	</Select>
            <RangePicker format="YYYY-MM-DD HH:mm:ss" showTime
              onChange={(moment, dateString) => this.rangePickChange(dateString)}
              defaultValue={[moment(this.state.beginTime, "YYYY-MM-DD HH:mm:ss"), 
              	moment(this.state.endTime, "YYYY-MM-DD HH:mm:ss")]}/>
            <Button className="search-btn" type="primary" icon="search" onClick={() => this.reqMemoryData(1)}>查询</Button>
        </div>
        <div className="content-block">
          <Charts title={"内存走势图"} loading={this.state.loading} option={this.state.chartOption}/>
          <Card title="内存说明">
            <p>当前时间点实例使用的内存大小</p>
          </Card>
        </div>

      </div>
    );
  }
}

let route = {
  path: '/memoryInfo',
  component: PageContent
};

export default route;
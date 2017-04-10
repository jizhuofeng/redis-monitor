import React from 'react';

import {Button, Spin, Table, message, Modal, Form, Input} from 'antd';
const FormItem = Form.Item;
import {Glo_getRequest, Glo_deleteRequest, Glo_postRequest} from '../../global/js/request';

import './style';

class PageContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addModalVisible: false,
      addSending: false,
      editModalVisible: false,
      editSending: false,
      modalKey: 0,
      currentInstance: {

      },
      addInstance: {

      },
      tableData: []
    };
  }
  addInstanceChange = (key, value) => {
    let tempState = Object.assign({}, this.state);
    tempState.addInstance[key] = value;
    this.setState(tempState);
  }
  currentInstanceChange = (key, value) => {
    let tempState = Object.assign({}, this.state);
    tempState.currentInstance["newName"] = value;
    this.setState(tempState);
  }
  showAddModal = () => {
    let tempState = Object.assign({}, this.state);
    tempState.addModalVisible = true;
    this.setState(tempState);
  }
  hideAddModal = () => {
    let tempState = Object.assign({}, this.state);
    tempState.addModalVisible = false;
    tempState.addSending = false;
    this.setState(tempState);
  }
  showEditModal = (text, record, id) => {
    
    let tempState = Object.assign({}, this.state);
    tempState.modalKey++;
    tempState.currentInstance = Object.assign({}, record);
    tempState.editModalVisible = true;
    this.setState(tempState);
  }
  hideEditModal = () => {
    let tempState = Object.assign({}, this.state);
    tempState.editSending = false;
    tempState.editModalVisible = false;
    this.setState(tempState);
  }

  renderRenameResult = () => {
    let tempState = Object.assign({}, this.state);
    tempState.editSending = false;
    tempState.editModalVisible = false;
    tempState.tableData[tempState.currentInstance["index"]]["name"] = tempState.currentInstance["newName"];
    tempState.currentInstance = Object.assign({}, tempState.tableData[tempState.currentInstance["index"]]);
    this.setState(tempState);
  }
  renderDeleteResult = (id) => {
    let tempState = Object.assign({}, this.state);
    tempState.tableData.splice(id, 1);
    this.setState(tempState);
  }
  renameInstance = () => {
    let _self = this;
    let tempState = Object.assign({}, this.state);
    tempState.editSending = true;
    this.setState(tempState);
    let data = {
      name: _self.state.currentInstance["newName"],
      oldName: _self.state.currentInstance["name"]
    }
    Glo_postRequest({
      context: _self,
      init: false,
      data: data,
      url: '/monitor/instance/rename',
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.code === 1) {
          _self.renderRenameResult();
        } else {
          _self.hideEditModal();
          message.error("修改失败(" + responseResult.message + ")");
        }
      }
    });
  }
  deleteInstance = (text, record, id) => {
    let _self = this;
    let data = {
      name: record["name"]
    }
    Glo_deleteRequest({
      context: _self,
      init: true,
      data: data,
      url: '/monitor/instance',
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.code === 1) {
          _self.renderDeleteResult(text);
        } else {
          message.error("删除失败(" + responseResult.message + ")");
        }
      }
    });
  }
  renderAddResult = () => {
    let _self = this;
    //添加后重新load实例数据
    let tempState = Object.assign({}, this.state);
    tempState.addModalVisible = false;
    tempState.loading = true;
    _self.setState(tempState);
    Glo_getRequest({
      context: _self,
      init: false,
      url: '/monitor/instance',
      response: (err, res) => {
        let tempState = Object.assign({}, this.state);
        tempState.loading = false;
        this.setState(tempState);
        let responseResult = JSON.parse(res.text);
        if (responseResult.code === 1) {
          this.renderTable(responseResult);
        } else {
          message.error(responseResult.message);
        }
      }
    });
  }
  addInstance = () => {
    let _self = this;
    let data = {
      "host": _self.state.addInstance["host"],
      "port": _self.state.addInstance["port"]
    }
    if(_self.state.addInstance["name"]) {
      data["name"] = _self.state.addInstance["name"];
    }
    if(_self.state.addInstance["password"]) {
      data["password"] = _self.state.addInstance["password"];
    }
    Glo_postRequest({
      context: _self,
      data: data,
      url: '/monitor/instance',
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.code === 1) {
          _self.renderAddResult();
        } else {
          _self.hideAddModal();
          message.error("添加失败(" + responseResult.message + ")");
        }
      }
    });
  }
  renderTable = (value) => {
    let tempState = Object.assign({}, this.state);
    tempState.loading = false;
    let data = [];
    let index = 0;
    for(let key in value.data) {
      data.push({
        name: key,
        host: value.data[key].host,
        port: value.data[key].port,
        index: index
      })
      index++;
    }

    tempState.tableData = data;
    tempState.totalPage = value.pageCount;
    tempState.currentPage = value.pageCurrent;
    this.setState(tempState);
  };

  componentWillMount(){
    let _self = this;
    Glo_getRequest({
      context: _self,
      init: true,
      url: '/monitor/instance',
      response: (err, res) => {
        let responseResult = JSON.parse(res.text);
        if (responseResult.code === 1) {
          _self.renderTable(responseResult);
        } else {
          message.error(responseResult.message);
        }
      }
    });
  }

  render() {
    const columns = [{
      title: '实例名',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '地址',
      dataIndex: 'host',
      key: 'host'
    }, {
      title: '端口',
      dataIndex: 'port',
      key: 'port'
    },{
      title: '操作',
      dataIndex: 'index',
      render: (text, record, id) => {
        return (
          <div>
            <Button type="primary" size="small" onClick={() => this.showEditModal(text, record, id)}>修改实例名</Button>
            <Button className="red-btn" type="primary" size="small"
                    onClick={() => this.deleteInstance(text, record, id)}>删除实例</Button>
          </div>
        );
      },
      key: 'index'
    }];

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 14},
    };

    return (
      <div className="main-content">
        <div className="top-block">
          <Button icon="plus-circle-o" type="primary" className="add-btn"
                  onClick={() => this.showAddModal()}>添加实例</Button>
        </div>
        <div className="content-block">
          <Spin spinning={this.state.loading}>
            <Table columns={columns} dataSource={this.state.tableData} 
            pagination={false} size="middle"/>
          </Spin>
          <Modal title="修改实例名"
            key={this.state.modalKey}
            okText={this.state.editSending ? "修改中": "确认修改"}
            visible={this.state.editModalVisible}
            onOk={() => this.renameInstance()}
            confirmLoading={this.state.editSending}
            onCancel={() => this.hideEditModal()}
            afterClose={() => this.hideEditModal()}>
            <Form horizontal>
              <FormItem
                {...formItemLayout}
                label="实例原名">
                <Input type="text" defaultValue={this.state.currentInstance.name}
                readOnly={true}/>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="实例新名">
                <Input type="text" defaultValue=""
                onChange={(e) => this.currentInstanceChange('name', e.target.value)}/>
              </FormItem>
            </Form>
          </Modal>
          <Modal title="添加实例"
            okText={this.state.addSending ? "添加中": "确认添加"}
            visible={this.state.addModalVisible}
            onOk={() => this.addInstance()}
            confirmLoading={this.state.addSending}
            onCancel={() => this.hideAddModal()}>
            <Form horizontal>
              <FormItem
                {...formItemLayout}
                label="name">
                <Input type="text" defaultValue=""
                onChange={(e) => this.addInstanceChange('name', e.target.value)}/>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="host">
                <Input type="text" defaultValue=""
                onChange={(e) => this.addInstanceChange('host', e.target.value)}/>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="port">
                <Input type="text" defaultValue=""
                onChange={(e) => this.addInstanceChange('port', e.target.value)}/>
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="password">
                <Input type="text" defaultValue=""
                onChange={(e) => this.addInstanceChange('password', e.target.value)}/>
              </FormItem>
            </Form>
          </Modal>
        </div>
      </div>
    );
  }
}

let route = {
  component: PageContent
};

export default route;
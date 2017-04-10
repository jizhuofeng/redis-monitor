'use strict';
let moment = require('moment');
let redis = require('redis');
let RedisApi = require('./api/redis');
let util = require('../common/util');
let logger = require('../common/logger').logger;

//实例qps数据
module.exports = new class {
	constructor() {

	}
	//按分钟获取
	async getQpsInfoByMinute(config, beginTime, endTime) {
		let beginT = moment(beginTime);
		let endT = moment(endTime);
		let fields = [];
		let dateArr = [];
		let count = 0;
		while(!beginT.isAfter(endT, 'minute')) {
			if(count >= 1440) {
				break;
			}
			let tmpT = beginT.clone().second(0);
			dateArr.push(tmpT.format('YYYY-MM-DD HH:mm'));
			fields.push(tmpT.unix());
			beginT.add(1, 'minutes');
			count++;
		}
		logger.debug('fields %s', JSON.stringify(fields));
		let key = config.host + ':' + config.port + ':CP:M';
		let values = await RedisApi.hmget(key, fields);
		let data = [];
		if(values) {
			for(let i = 0; i < values.length - 1 ; i++) {
				let tmp = {
					time: dateArr[i],
					value: 0
				}
				if(values[i+1]) {
					let nowAllCP = parseInt(values[i+1], 10);
					let lastAllCP = nowAllCP;
					if(values[i]) {
						lastAllCP = parseInt(values[i], 10);
					}
					
					tmp.value = nowAllCP - lastAllCP;
				}
				data.push(tmp);
			}
		}
		return data;
	}
	//按小时获取
	async getQpsInfoByHour(config, beginTime, endTime) {
		let beginT = moment(beginTime);
		let endT = moment(endTime);
		let fields = [];
		let dateArr = [];
		let count = 0;
		while(!beginT.isAfter(endT, 'hour')) {
			if(count > 200) {
				break;
			}
			let tmpT = beginT.clone().minute(0).second(0);
			dateArr.push(tmpT.format('YYYY-MM-DD HH'));
			fields.push(tmpT.unix());
			beginT.add(1, 'hours');
			count++;
		}
		logger.debug('fields %s', JSON.stringify(fields));
		let key = config.host + ':' + config.port + ':CP:M';
		let values = await RedisApi.hmget(key, fields);
		let data = [];
		if(values) {
			for(let i = 0; i < values.length - 1 ; i++) {
				let tmp = {
					time: dateArr[i],
					value: 0
				}
				if(values[i+1]) {
					let nowAllCP = parseInt(values[i+1], 10);
					let lastAllCP = nowAllCP;
					if(values[i]) {
						lastAllCP = parseInt(values[i], 10);
					}
					
					tmp.value = nowAllCP - lastAllCP;
				}
				data.push(tmp);
			}
		}
			
		return data;
	}
	//按天获取
	async getQpsInfoByDate(config, beginTime, endTime) {
		let beginT = moment(beginTime);
		let endT = moment(endTime);
		let fields = [];
		let dateArr = [];
		while(!beginT.isAfter(endT, 'day')) {
			let tmpT = beginT.clone().hour(0).minute(0).second(0);
			dateArr.push(tmpT.format('YYYY-MM-DD'));
			fields.push(tmpT.unix());
			beginT.add(1, 'days');
		}
		logger.debug('fields %s', JSON.stringify(fields));
		let key = config.host + ':' + config.port + ':CP:M';
		let values = await RedisApi.hmget(key, fields);
		let data = [];
		if(values) {
			for(let i = 0; i < values.length - 1 ; i++) {
				let tmp = {
					time: dateArr[i],
					value: 0
				}
				if(values[i+1]) {
					let nowAllCP = parseInt(values[i+1], 10);
					let lastAllCP = nowAllCP;
					if(values[i]) {
						lastAllCP = parseInt(values[i], 10);
					}
					
					tmp.value = nowAllCP - lastAllCP;
				}
				data.push(tmp);
			}
		}
		return data;
	}
	//获取内存变化情况
	async getQpsInfo(name, type, beginTime, endTime) {
		let key = 'server-instance-list';
		let insConfig = await RedisApi.hget(key, name);
		if(!insConfig) {
			logger.info('get qps info instance not exists');
			return null;
		}
		let config = JSON.parse(insConfig);
		let data = null;
		switch(type) {
			case 1: 
				data = await this.getQpsInfoByMinute(config, beginTime, endTime);
				break;
			case 2:
				data = await this.getQpsInfoByHour(config, beginTime, endTime);
				break;
			case 3:
				data = await this.getQpsInfoByDate(config, beginTime, endTime);
				break;
		}
		return data;

	}
}
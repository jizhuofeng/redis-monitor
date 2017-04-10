/**
 * Created by jason on 2017/3/28.
 */
'use strict';
const moment = require('moment');
const redis = require('redis');
const InstanceService = require('../service/instance-service');
const logger = require('../common/logger').logger;
const util = require('../common/util');

//同步redis数据
exports.createData = async function () {
	try {
		//获取实例列表
		let redisList = await InstanceService.getInstanceList(null, true);
		logger.debug('create data redis list %s', JSON.stringify(redisList));
		for(let key in redisList) {
			//遍历实例
			let res = await InstanceService.syncRedisInstanceInfo(redisList[key]);
			logger.info('create data result  %s', res);
		}
	} catch (err) {
		logger.error('create data occour error %s', err.toString());
		
	}

}
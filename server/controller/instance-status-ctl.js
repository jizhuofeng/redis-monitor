/**
 * Created by jason on 2017/3/28.
 */
'use strict';
let InstanceService = require('../service/instance-service');
let MemoryService = require('../service/memory-management-service');
let QpsService = require('../service/qps-management-service');
let logger = require('../common/logger').logger;
let Response = require('../common/response');

module.exports = new class {
	constructor() {
	}
	async getServerBaseInfo(ctx, next) {
		//获取实例info命令返回的数据
		let [name] = [];
		if(ctx.query) {
			({name} = ctx.query);
		}
		logger.info('get server base info request body %s', JSON.stringify(ctx.query));
		if(!name) {
			logger.warn('get server base info less params name');
			Response.FAILED(ctx, '缺少参数');
			return;
		}
		try {
			let info = await InstanceService.getServerBaseInfo(name);
			logger.info('get server base info %s', JSON.stringify(info));
			Response.SUCCESS(ctx, info);
		} catch(err) {
			logger.error('get server base info error %s', err.toString());
			Response.FAILED(ctx, '获取失败');
		}
	}
	async getMemoryChangeInfo(ctx, next) {
		let [name, type, beginTime, endTime] = [];
		if(ctx.query) {
			({name, type, beginTime, endTime} = ctx.query);
		}
		//type 1=分钟， 2=小时，3=天
		//type=1时时间区间限制为一天内的数据(beginTime当天的数据)
		//type=2时时间区间限制为一周内的数据（beginTime之后一周内的数据）
		//type=3时时间区间无限制
		if(!name || !type || !beginTime || !endTime) {
			logger.warn('get memory info less params type or beginTime or endTime');
			Response.FAILED(ctx, '缺少参数');
			return;
		}
		type = parseInt(type, 10);
		try {
			let data = [];
			data = await MemoryService.getMemoryChangeInfo(name, type, beginTime, endTime);
			Response.SUCCESS(ctx, data);
		} catch(err) {
			logger.error('get memory info error %s', err.toString());
			Response.FAILED(ctx, '获取失败');
		}
	}
	async getQpsInfo(ctx, next) {
		let [name, type, beginTime, endTime] = [];
		if(ctx.query) {
			({name, type, beginTime, endTime} = ctx.query);
		}
		//type 1=分钟， 2=小时，3=天
		//type=1时时间区间限制为一天内的数据(beginTime当天的数据)
		//type=2时时间区间限制为一周内的数据（beginTime之后一周内的数据）
		//type=3时时间区间无限制
		if(!name || !type || !beginTime || !endTime) {
			logger.warn('get qps info less params type or beginTime');
			Response.FAILED(ctx, '缺少参数');
			return;
		}
		type = parseInt(type, 10);
		try {
			let data = [];
			data = await QpsService.getQpsInfo(name, type, beginTime, endTime);
			Response.SUCCESS(ctx, data);
		} catch(err) {
			logger.error('get qps info error %s', err.toString());
			Response.FAILED(ctx, '获取失败');
		}
	}
}
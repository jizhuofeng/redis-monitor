/**
 * Created by jason on 2017/3/28.
 */
'use strict';
let InstanceService = require('../service/instance-service');
let logger = require('../common/logger').logger;
let Response = require('../common/response');

module.exports = new class {
	constructor() {
	}
	//获取redis实例信息
	async getInstance(ctx, next) {

		let [name] = [];
		if(ctx.query) {
			({name} = ctx.query);
		}
		logger.info('get instance list request body %s', JSON.stringify(ctx.query));
		try {
			let info = await InstanceService.getInstanceList(name);
			logger.info('get instance list %s', JSON.stringify(info));
			Response.SUCCESS(ctx, info);
		} catch(err) {
			logger.error('get instance list error %s', err.toString());
			Response.FAILED(ctx, '获取失败');
		}
		
	}
	//添加redis实例
	async addInstance(ctx, next) {

		let [name, host, port, password] = [];
		if(ctx.request.body) {
			({name, host, port, password} = ctx.request.body);
		}
		logger.info('add instance request body %s', JSON.stringify(ctx.request.body));
		if(!host || !port) {
			logger.warn('add instance less params host or port');
			Response.FAILED(ctx, '缺少参数');
			return;
		}
		if(!name) {
			name = host + ':' + port;
		}
		try {

			let res = await InstanceService.addInstance(name, host, port, password);
			logger.info('add instance result %s', res);
			if(res != 'success') {
				Response.FAILED(ctx, '添加失败(' + res + ')');
				return;
			} 
			Response.SUCCESS(ctx);
		} catch(err) {
			logger.error('add instance error %s', err.toString());
			Response.FAILED(ctx, '添加失败');
		}
	}
	async deleteInstance(ctx, next) {
		let [name] = [];
		if(ctx.request.body) {
			({name} = ctx.request.body);
		}
		logger.info('delete instance request body %s', JSON.stringify(ctx.request.body));
		if(!name) {
			logger.warn('delete instance less params name');
			Response.FAILED(ctx, '缺少参数');
			return;
		}
		try {
			let res = await InstanceService.deleteInstance(name);
			logger.info('delete instance result %s', res);
			if(res != 'success') {
				Response.FAILED(ctx, '删除失败(' + res + ')');
				return;
			} 
			Response.SUCCESS(ctx);
			
		} catch(err) {
			logger.error('delete instance error %s', err.toString());
			Response.FAILED(ctx, '删除失败');
		}

		
	}
	async renameInstance(ctx, next) {
		let [name, oldName] = [];
		if(ctx.request.body) {
			({name, oldName} = ctx.request.body);
		}
		logger.info('rename instance request body %s', JSON.stringify(ctx.request.body));
		if(!name || !oldName) {
			logger.warn('rename instance less params name or oldName');
			Response.FAILED(ctx, '缺少参数');
			return;
		}
		try {
			let res = await InstanceService.renameInstance(name, oldName);
			logger.info('rename instance result %s', res);
			if(res != 'success') {
				Response.FAILED(ctx, '重命名失败(' + res + ')');
				return;
			} 
			Response.SUCCESS(ctx);
		} catch(err) {
			logger.error('rename instance error %s', err.toString());
			Response.FAILED(ctx, '重命名失败');
		}
	}
}
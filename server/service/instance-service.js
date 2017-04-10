/**
 * Created by jason on 2017/3/29.
 */
'use strict';
let moment = require('moment');
let redis = require('redis');
let RedisApi = require('./api/redis');
let util = require('../common/util');
let logger = require('../common/logger').logger;

module.exports = new class {
	constructor() {

	}
	//检查实例是否可以已存在
	async checkInstanceExists(host, port) {
		let insList = await this.getInstanceList();
		if(insList) {
			for(let key in insList) {
				let ins = insList[key];
				if(ins.host == host && ins.port == port) {
					return true;
				}
			}
		}
		return false;
	}
	//检查实例是否可以正常连接
	async checkInstanceConnect(host, port, password) {
		let config = {
			host: host,
			port: port
		}
		if(password) {
			config.password = password;
		}
		return new Promise(function(resolve, reject) {
			let client = redis.createClient(config);
			client.on('error', function(err) {
				client.quit();
				resolve(false);
			});
			client.on('ready', function() {
				client.quit();
				resolve(true);
			});
		});
	}
	//获取实例info命令数据
	async getServerBaseInfo(name) {
		let key = 'server-instance-list';
		let insConfig = await RedisApi.hget(key, name);
		if(!insConfig) {
			logger.info('get server base info instance not exists');
			return null;
		}
		let config = JSON.parse(insConfig);
		let canConnect = await this.checkInstanceConnect(config.host, config.port, config.password);
		if(!canConnect) {
			logger.info('get server base info instance can not connect');
			return null;
		}
		let client = redis.createClient(config);
		client.on('error', function(err) {
			logger.error('get server info connect redis %s', err.toString());
			client.quit();
		});
		let info = await RedisApi.info(client);
		//解析redis info 命令返回的数据
		let infoObj = util.parseRedisServerInfo(info);
		return infoObj;
	}
	//实例重命名
	async renameInstance(name, oldName) {
		let key = 'server-instance-list';
		let field = name;
		let fieldOld = oldName;
		let newInfo = await RedisApi.hget(key, field);
		if(newInfo) {
			return 'instance has exists';
		}
		let oldInfo = await RedisApi.hget(key, fieldOld);
		if(oldInfo) {
			//重新添加
			let addRes = await RedisApi.hset(key, field, oldInfo);
			//删除
			let delRes = await RedisApi.hdel(key, fieldOld);
			return 'success';
		} else {
			return 'instance not exists';
		}
	}
	//删除实例
	async deleteInstance(name) {

		let field = name;
		let key = 'server-instance-list';
		let ins = await RedisApi.hget(key, field);
		if(!ins) {
			//实例不存在
			logger.info('delete instance instance not exists');
			return 'instance not exists';
		}
		let res = await RedisApi.hdel(key, field);
		return 'success';
	}
	
	//添加实例
	async addInstance(name, host, port, password) {
		//检察是否已存在
		let exists = await this.checkInstanceExists(host, port);
		if(exists) {
			logger.info('add instance instance has exists');
			return 'instance has exists';
		}
		//检查实例是否可正常连接
		// let canConnect = await this.checkInstanceConnect(host, port, password);
		// if(!canConnect) {
		// 	logger.info('add instance instance can not connect');
		// 	return 'can not connect';
		// }
		let info = {
			host: host,
			port: port
		}
		if(password) {
			info.password = password;
		}
		let field = name;
		let key = 'server-instance-list';
		let value = JSON.stringify(info);
		let res = await RedisApi.hset(key, field, value);
		return 'success';
	}
	//获取实例列表
	async getInstanceList(name, flag = false) {
		let key = 'server-instance-list';
		let list = {};
		if(name) {
			let tmp = await RedisApi.hget(key, name);
			if(tmp) {
				let ins = JSON.parse(tmp)
				list[name] = {
					host: ins.host,
					port: ins.port
				}
				if(flag && ins.password) {
					list[name].password = ins.password;
				}
			}
			
		} else {
			let tmp = await RedisApi.hgetall(key);
			if(tmp) {
				for(let key in tmp) {
					let ins = JSON.parse(tmp[key])
					list[key] = {
						host: ins.host,
						port: ins.port
					}
					if(flag && ins.password) {
						list[key].password = ins.password;
					}
				}
			}
		}
		return list;
	}
	//同步redis实例状态信息
	async syncRedisInstanceInfo(config) {
		try {
			let nowT = moment();
			let client = redis.createClient(config);
			client.on('error', function(err) {
				logger.error('sync redis instance info connect redis %s', err.toString());
				client.quit();
			});
			let info = await RedisApi.info(client);
			//解析redis info 命令返回的数据
			let infoObj = util.parseRedisServerInfo(info);
			//logger.debug('instance info %s', JSON.stringify(infoObj));
			let res = null;
			let dayT = nowT.clone().hour(0).minute(0).second(0).unix();
			let hourT = nowT.clone().minute(0).second(0).unix();
			let minuteT = nowT.clone().second(0).unix();
			let preKey = config.host + ':' + config.port;
			let usedMemory = infoObj.Memory.used_memory;
			let totalCommand = infoObj.Stats.total_commands_processed;
			//内存数据
			//分钟信息
			await RedisApi.hset(preKey + ':M:M',
					minuteT, usedMemory);
			//小时信息
			let hourV = await RedisApi.hget(preKey + ':M:H', hourT);
			if(!hourV || parseInt(hourV) < parseInt(usedMemory)) {
				//更新小时内最大值
				await RedisApi.hset(preKey + ':M:H',
						hourT, usedMemory);
			}
			//天信息
			let dayV = await RedisApi.hget(preKey + ':M:D', dayT);
			if(!dayV || parseInt(dayV) < parseInt(usedMemory)) {
				//更新天内最大值
				await RedisApi.hset(preKey + ':M:D',
						dayT, usedMemory);
			}
			//执行命令数统计
			await RedisApi.hset(preKey+":CP:M", minuteT, totalCommand);
			client.quit();
			return "success";
		} catch(err) {
			logger.error('sync redis instance info error %s', err);
			return 'sync failed';
		}

	}

}
/**
 * Created by jason on 2017/3/29.
 */
'use strict';
let redisClient = require('../../common/redis-client');

//redis各种api接口封装
//如果提供client参数则使用提供的client, 若不提供client则默认使用全局的redisClient
module.exports = new class {
	constructor() {

	}
	//hgetall
	hgetall(key, client = redisClient) {
		return new Promise(function(resolve, reject) {
			client.hgetall(key, function(err, res) {
				if(!err && res) {
					resolve(res);
					return;
				}
				resolve(null);
			})
		})
	}
	//hget
	hget(key, field, client = redisClient) {
		return new Promise(function(resolve, reject) {
			client.hget(key, field, function(err, res) {
				if(!err && res) {
					resolve(res);
					return;
				}
				resolve(null);
			})
		})
	}
	//hmget
	hmget(key, fields, client = redisClient) {
		return new Promise(function(resolve, reject) {
			client.hmget(key, fields, function(err, res) {
				if(!err && res) {
					resolve(res);
					return;
				}
				resolve(null);
			})
		})
	}
	//hset
	hset(key, field, value, client = redisClient) {
		return new Promise(function(resolve, reject) {
			client.hset(key, field, value, function(err, res) {
				if(!err && res) {
					resolve(res);
					return;
				}
				resolve(null);
			})
		})
	}
	//hdel
	hdel(key, field, client = redisClient) {
		return new Promise(function(resolve, reject) {
			client.hdel(key, field, function(err, res) {
				if(!err && res) {
					resolve(res);
					return;
				}
				resolve(null);
			})
		})
	}
	//info
	info(client) {
		return new Promise(function(resolve, reject) {
			client.info(function(err, res) {
				if(!err && res) {
					resolve(res);
					return;
				}
				resolve(null);
			})
		})
	}
}
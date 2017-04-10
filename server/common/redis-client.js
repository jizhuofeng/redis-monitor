/**
 * Created by jason on 2017/3/29.
 */
'use strict';

const redis = require('redis');
const config = require('../config');
const logger = require('./logger').logger;
const redisClient= redis.createClient(config.redis);

redisClient.on('error', function (err) {
	logger.error('redis error event - ' + config.redis.host + ':' +
			config.redis.port + ' - ' + err);
});

module.exports = redisClient;


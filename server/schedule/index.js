/**
 * Created by jason on 2017/3/28.
 */
'use strict';

let schedule = require('node-schedule');
let CRSI = require('./create-redis-server-info');
let logger = require('../common/logger').logger;


let rule = '0 * * * * *';
schedule.scheduleJob(rule, CRSI.createData);
logger.debug('schedule start');


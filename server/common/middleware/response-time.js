'use strict';
const logger = require('../logger').logger;

module.exports = async function (ctx, next){
	let start = new Date();
  	await next();
  	let ms = new Date() - start;
  	logger.info(`request : ${ctx.method} ${ctx.url} used ${ms}ms`);
}
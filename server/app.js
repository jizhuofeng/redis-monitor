/**
 * Created by jason on 2017/3/28.
 */

'use strict';
const Koa = require('koa');
const path = require('path');
const bodyparser = require('koa-bodyparser');
const staticServer = require('koa-static');
const responseTime = require('./common/middleware/response-time');
const router = require('./router');
const app = new Koa();

app.use(bodyparser());
app.use(responseTime);
//静态资源配置
app.use(staticServer(__dirname + '/public'));
//应用路由
router(app);
module.exports = app;
/**
 * Created by jason on 2017/3/28.
 */
'use strict';
const Router = require('koa-router');
const ISCtl = require('../controller/instance-status-ctl');


const router = new Router({
});
//实例运行状态信息获取
router.get('/server/base-info', ISCtl.getServerBaseInfo);
//获取实例内存变化
router.get('/server/memory-change', ISCtl.getMemoryChangeInfo);
//获取实例处理请求的变化
router.get('/server/qps', ISCtl.getQpsInfo);
module.exports = router;

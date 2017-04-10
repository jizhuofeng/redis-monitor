/**
 * Created by jason on 2017/3/28.
 */
'use strict';
const Router = require('koa-router');
const ILCtl = require('../controller/instance-list-ctl');

const router = new Router({
});
//监控系统监控的实例列表管理
//获取实例列表
router.get('/instance', ILCtl.getInstance);
//添加实例
router.post('/instance', ILCtl.addInstance);
//删除实例
router.del('/instance', ILCtl.deleteInstance);
//实例重命名
router.post('/instance/rename', ILCtl.renameInstance);

module.exports = router;

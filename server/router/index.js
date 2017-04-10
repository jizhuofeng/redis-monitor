/**
 * Created by jason on 2017/3/28.
 */
'use strict';
const Router = require('koa-router');
const fs = require('fs');

const appRouter = new Router();
//动态引入router目录下路由文件
let files = fs.readdirSync(__dirname);
if (files && files.length > 0) {
	for(let i = 0; i < files.length; i++) {
		let file = files[i];
		let pos = file.lastIndexOf('.');
		if (pos == -1) {
			continue;
		}
		let fileName = file.substr(0, pos);
		let fileExt = file.substr(pos+1);
		if (fileName === 'index') {
			continue;
		}
		let router = require('./' + fileName);
		appRouter.use('/monitor', router.routes(), router.allowedMethods());
	}
}
function router(app){
	app.use(appRouter.routes());
}

module.exports = router;
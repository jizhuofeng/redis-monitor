/**
 * Created by jason on 2017/3/29.
 */
'use strict';

//解析redis info命令返回的数据结构
exports.parseRedisServerInfo = function (info) {

	let data = {
	}
	if(!info) {
		return data;
	}
	let tmp = info.split('#');
	for(let i = 0; i < tmp.length; i++) {
		if(tmp[i] == '') {
			continue;
		}
		let items = tmp[i].split('\r\n');
		let resTmp = {

		}
		for(let k = 1; k < items.length; k++) {
			if(items[k] == '') {
				continue;
			}
			let item = items[k].split(':');
			resTmp[item[0]] = item[1];

		}
		data[items[0].substr(1, items[0].length)] = resTmp
	}
	return data;
}
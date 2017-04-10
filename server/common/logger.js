/**
 * Created by jason on 2017/3/28.
 */
'use strict';

let log4js = require('log4js');
let path = require('path');
log4js.configure({
	"replaceConsole": true,
	"appenders":[{
		"category": "console",
		"type": "console"
	},
		{
			"type": "file",
			"category": "logger",
			"filename": path.join(__dirname, "../logs/redis-monitor.log"),
			"pattern": "-yyyy-MM-dd",
			"alwaysIncludePattern": true,
			"layout":{
				"type":"pattern",
				"pattern" : "%d(%x{pid})[%p][%c] %m",
				"tokens":{
					"pid": function(){return process.pid;}
				}
			}
		}
	],
	"levels":{
		"[all]": "DEBUG"
	}
})

module.exports = {
	'logger': log4js.getLogger('logger')
}


'use strict';

module.exports = new class {
	constructor() {

	}
	SUCCESS(ctx, data = [], pageCount = 1, pageCurrent = 1) {
		if(!data) {
			data = {};
		}
		ctx.body = {
			code: 1,
			message: 'success',
			data: data,
			pageCount: pageCount,
			pageCurrent: pageCurrent
		}
	}
	FAILED(ctx, message = 'failed') {
		ctx.body = {
			code: 0,
			message: message
		}
	}
}
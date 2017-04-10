let locationProps = [{
	listTitle: '实例管理',
	listIcon: 'database',
	pageUrl: '/'
}, {
	listTitle: '状态监控',
	listIcon: 'area-chart',
	list: [{
		pageName: '实例信息',
		pageUrl: '/dbInfo'
	}, {
		pageName: '内存变化',
		pageUrl: '/memoryInfo'
	}, {
		pageName: '吞吐率',
		pageUrl: '/qpsInfo'
	}]
	
}];

export default locationProps;
//------------------------------------报表----------------------------------------------------
note.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('charts',{ 
		url:'/charts',
		views:{'content':{templateUrl:templates_path+'/charts/charts.html'}}
	}).state('distribute',{ //报表-分布图
		url:'/distribute',
		parent:'charts',
		views:{'charts_view':{templateUrl:templates_path+'/charts/distribute.html'}}
	}).state('compare',{ //报表-对比图
		url:'/compare',
		parent:'charts',
		views:{'charts_view':{templateUrl:templates_path+'/charts/compare.html'}}
	}).state('trend',{ //报表-趋势图
		url:'/trend',
		parent:'charts',
		views:{'charts_view':{templateUrl:templates_path+'/charts/trend.html'}}
	}).state('property_distribute',{ //报表-资产分布图
		url:'/property/distribute',
		parent:'charts',
		views:{'charts_view':{templateUrl:templates_path+'/charts/property_distribute.html'}}
	}).state('property_trend',{ //报表-资产趋势图
		url:'/property/trend',
		parent:'charts',
		views:{'charts_view':{templateUrl:templates_path+'/charts/property_trend.html'}}
	});
}]);
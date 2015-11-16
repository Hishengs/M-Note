//------------------------------------报表----------------------------------------------------
note.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('charts',{ 
		url:'/charts',
		views:{'content':{templateUrl:templates_path+'/charts/charts.html'}}
	}).state('budget',{ //报表-预算
		url:'/budget',
		parent:'charts',
		views:{'charts_view':{templateUrl:templates_path+'/charts/budget.html'}}
	});
}]);
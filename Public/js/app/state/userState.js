//----------------------------------用户中心-----------------------------------------------------
note.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('user',{ 
		url:'/user',
		views:{'content':{templateUrl:templates_path+'/user/user.html'}}
	}).state('basicInfo',{ //用户-基本信息
		url:'/basicInfo',
		parent:'user',
		views:{'user_view':{templateUrl:templates_path+'/user/basicInfo.html'}}
	}).state('modifyPasswd',{ //用户-修改密码
		url:'/modifyPasswd',
		parent:'user',
		views:{'user_view':{templateUrl:templates_path+'/user/modifyPasswd.html'}}
	});
}]);
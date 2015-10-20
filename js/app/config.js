m_index.config(['$locationProvider', '$urlRouterProvider', '$compileProvider',function($locationProvider, $urlRouterProvider,$compileProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("");
    //deal unsafe:javascript:...
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
}]);

//state
m_index.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('home',{  //首页
		url:'',
		views:{'content':{templateUrl:templates_path+'/home.html'}}
	}).state('login',{  //登陆
		url:'/login',
		views:{'content':{templateUrl:templates_path+'/login.html'}}
	}).state('register',{ //注册
		url:'/register',
		views:{'content':{templateUrl:templates_path+'/register.html'}}
	}).state('bill',{ //记账
		url:'/bill',
		views:{'content':{templateUrl:templates_path+'/bill.html'}}
	});
}]);
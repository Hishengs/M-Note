m_index.config(['$locationProvider', '$urlRouterProvider', '$compileProvider',function($locationProvider, $urlRouterProvider,$compileProvider) {
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("");
    //deal unsafe:javascript:...
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
}]);

//state
m_index.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('home',{
		url:'/'
	}).state('login',{
		url:'/login',
		views:{'content':{templateUrl:templates_path+'/login.html'}}
	}).state('register',{
		url:'/register',
		views:{'content':{templateUrl:templates_path+'/register.html'}}
	});
}]);
//首页
note.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('home',{  
		url:'',
		views:{'content':{templateUrl:templates_path+'/home.html'}}
	}).state('welcome',{  //欢迎页
		url:'/welcome',
		views:{'content':{templateUrl:templates_path+'/welcome.html'}}
	}).state('login',{  //登陆
		url:'/login',
		views:{'content':{templateUrl:templates_path+'/login.html'}}
	}).state('register',{ //注册
		url:'/register',
		views:{'content':{templateUrl:templates_path+'/register.html'}}
	});
}]);
//------------------共有的控制器----------------
var site_prefix = "http://localhost/note2/"
//var controller_path = '';
//----------------------------------------主页------------------------------------------------
note.controller('c_index',function($scope,$rootScope,$state,$http,$location,$log,ipCookie){
	//对所有的url跳转作权限验证
	$rootScope.$on('$locationChangeStart', function(event){
        if(!ipCookie('is_logined')){
        	//如果未登录，除了注册登陆不允许跳转到别的地方
        	console.log(arguments);
        	console.log(arguments[1].split('#')[1]);
        	if(arguments[1].split('#')[1] != "/login" && arguments[1].split('#')[1] != "/register"){
				$state.go('login');
				hMessage("请登录后再操作！");
			}
		} 
	});
	$state.go('home');
});
//----------------------------------------导航栏------------------------------------------------
note.controller('c_nav',function($scope,$state,$rootScope,$http,ipCookie){
	//在这之前向服务器请求用户的登陆状态
	/*$http.get(home_path+"/User/is_logined.html").success(function(){
		if(res.error === 0){
			if(res.is_logined)
				$rootScope.user.is_logined = true;//登陆状态
			else $rootScope.user.is_logined = false;
		}else $rootScope.user.is_logined = false;
	});*/
	$scope.current_tab = 'home';
	$scope.switchTab = function(tab){
		$scope.current_tab = tab;
		$state.go(tab);
	}
	if(!ipCookie('is_logined'))
	{
		$rootScope.login_register_show = true;
		$rootScope.user_show = false;
		$rootScope.username_text = '';
	}else{
		$rootScope.login_register_show = false;
		$rootScope.user_show = true;
		$rootScope.username_text = '<i class="uk-icon-user"></i> ' + ipCookie('username');
	}
});
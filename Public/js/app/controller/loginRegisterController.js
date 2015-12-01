//-------------------登陆注册控制器----------------------
note.controller('c_login',function($scope,$state,$rootScope,$timeout,ipCookie,User){
	
	setTitle("随手记-登陆");
	$scope.username = $scope.password = '';
	var loginable = true;
	$scope.login = function(){
		if(!loginable){hMessage('正在登陆，请耐心等待...');return;}
		loginable = false;
		//格式验证
		if($scope.username.length < 1 || $scope.password.length < 1){hMessage("用户名或密码不能为空！",2000);return;}
		else if($scope.password.length >= 1 && $scope.password.length < 6){hMessage("请输入6位以上的密码！",2000);return;}
		//post
		var loginInfo = {'username':$scope.username,'password':$scope.password};
		var is_new = true;
		$timeout(function(){if(is_new)hMessage('这可能是你的第一次登陆，相关数据正在初始化，请耐心等候...');},3000);
		User.login(loginInfo).success(function(res){
			is_new = false;
			if(res.error === 0){
				loginable = true;
				hMessage("登陆成功！",1500);
				$rootScope.login_register_show = false;
				$rootScope.user_show = true;
				
				//信息记录
				$rootScope.user = {};//记录所有用户相关的信息
				$rootScope.user.is_logined = true;//登陆状态
				console.log("已登陆");
				ipCookie('is_logined',1);
				ipCookie('username',$scope.username);
				$rootScope.user.name = $scope.username;
				$rootScope.username_text = '<i class="uk-icon-user"></i> ' + $scope.username;
				$rootScope.user.email = "819537918@qq.com";
				$rootScope.user.id = 1000;
				$rootScope.user.avatar = "https://dn-lanbaidiao.qbox.me/avatar_1000_a645761e1fc399f5be08308eacead7ce?imageView2/1/w/80/h/80";

				setTimeout(function(){$state.go('home');},1500);
			}else if(res.error === 2){hMessage("该用户不存在！",1500);loginable = true;}
			else{hMessage(res.msg,2000);loginable = true;}
		}).error(function(data,state){
			console.log(data);
			console.log(state);
		});
	}
});
note.controller('c_register',function($scope,$state,User){
	setTitle("随手记-注册");
	$scope.username = $scope.email = $scope.password = $scope.password_confirm = '';
	var registerable = true;
	$scope.register = function(){
		if(!registerable){hMessage('正在登陆，请耐心等待...');return;}
		registerable = false;
		//格式验证
		console.log($scope.username+","+$scope.email+","+$scope.password+","+$scope.password_confirm);
		//格式验证
		if($scope.username.length < 1){hMessage("用户名不能为空！",2000);return;}
		else if(!usernameVerify($scope.username)){hMessage("用户名只能以英文字母或中文开头,包含数字，下划线，字母，中文！",3000);return;}
		else if($scope.email.length < 1){hMessage("邮箱不能为空！",2000);return;}//邮箱这里要作进一步正则验证
		else if(!emailVerify($scope.email)){hMessage("请输入正确的邮箱格式！",2000);return;}
		else if(checkEmpty($scope.password)){hMessage("密码不能为空！",2000);return;}
		else if($scope.password.length > 1 && $scope.password.length < 6){hMessage("请输入6位以上的密码！",2000);return;}
		else if($scope.password !== $scope.password_confirm){hMessage("两次输入的密码不一致！",2000);return;}
		//将按钮设为不可用状态
		//$("#register-btn").html("注册中...");
		//$("#register-btn").attr("disabled","disabled");
		document.getElementById('register-btn').innerHTML = "注册中...";
		document.getElementById('register-btn').disabled = "disabled";
		//post
		var registerInfo = {'username':$scope.username,'email':$scope.email,'password':$scope.password,'password_confirm':$scope.password_confirm};
		User.register(registerInfo).success(function(res){
			if(res.error === 0){
				registerable = true;
				hMessage("注册成功，请登陆！",2000);
				$state.go('login');
			}
			else {hMessage(res.msg,2000);registerable = true;}
			//恢复按钮状态
			//$("#register-btn").html("注册");
			//$("#register-btn").attr("disabled",false);
			document.getElementById('register-btn').innerHTML = "注册";
			document.getElementById('register-btn').disabled = false;
		});
	}
});
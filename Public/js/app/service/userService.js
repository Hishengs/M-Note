note.service('User',function($http){
	//注册
	this.register = function(registerInfo){
		return $http({
			method:'POST',
			url:home_path+"/User/register.html",
			data:registerInfo
		});
	}
	//登录
	this.login = function(loginInfo){
		return $http({
			method:'POST',
			url:home_path+"/User/login.html",
			data:loginInfo
		});
	}
	//注销
	this.logout = function(){
		return $http({
			method:'GET',
			url:home_path+"/User/logout.html"
		});
	}
	//获取基本信息
	this.getBasicInfo = function(){
		return $http({
			method:'GET',
			url:home_path+"/User/get_user_basic_info.html"
		});
	}
	//修改信息
	this.modifyUserInfo = function(userInfo){
		return $http({
			method:'POST',
			url:home_path+"/User/modify_user_basic_info.html",
			data:userInfo
		});
	}
	//修改密码
	this.modifyPassword = function(passwordInfo){
		return $http({
			method:'POST',
			url:home_path+"/User/modify_user_password.html",
			data:passwordInfo
		});
	}
	//上传头像
	this.uploadAvatar = function(registerInfo){
		/*return $http({
			method:'POST',
			url:home_path+"/User/register.html",
			data:registerInfo
		});*/
	}
});
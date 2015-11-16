/*账户信息
增删查改
by Hisheng
at 2015-11-16
**/
note.service('Account',function($http){
	//增
	this.add = function(account){
		return $http({
			method:'POST',
			url:home_path+"/Account/add_account.html",
			data:account
		});
	}
	//删
	this.delete = function(account_id){
		return $http({
			method:'POST',
			url:home_path+"/Account/delete_account.html",
			data:{'account_id':account_id}
		});
	}
	//查
	this.query = function(condition){
		return $http({
			method:'POST',
			url:home_path+"/Account/account_query.html",
			data:condition
		});
	}
	//改
	this.modify = function(account){
		return $http({
			method:'POST',
			url:home_path+"/Account/modify_account.html",
			data:account
		});
	}
	//获取用户的账户信息
	this.getAccountInfo = function(){
		return $http({
			method:'POST',
			url:home_path+"/Account/get_user_accounts.html"
		});
	}
});

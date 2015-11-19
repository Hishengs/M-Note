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
	//删 type1删除一级账户,type2删除二级账户
	/**
	如果删除的二级账户所属的一级账户仅有该二级账户，则连一级账户也一并删除
	*/
	this.delete = function(account_id,type){
		return $http({
			method:'POST',
			url:home_path+"/Account/delete_account.html",
			data:{'account_id':account_id,'type':type}
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
	//改 修改一级账户
	this.modifyAccount = function(modified_account){
		return $http({
			method:'POST',
			url:home_path+"/Account/modify_account.html",
			data:{'account_name':modified_account.account_name,'account_id':modified_account.account_id}
		});
	}
	//修改二级账户
	this.modifyChildAccount = function(modified_child_account){
		return $http({
			method:'POST',
			url:home_path+"/Account/modify_child_account.html",
			data:{'child_account_id':modified_child_account.child_account_id,'child_account_name':modified_child_account.child_account_name,
			'child_account_balance':modified_child_account.child_account_balance,'child_account_remarks':modified_child_account.child_account_remarks}
		});
	}
	//获取用户的账户信息
	this.getAccounts = function(){
		return $http({
			method:'POST',
			url:home_path+"/Account/get_user_accounts.html"
		});
	}
	//获取单个账户的信息，包括余额，流入，流出(联表查询)
	this.getAccount = function(account_id){
		return $http({
			method:'POST',
			url:home_path+"/Account/get_account.html",
			data:{'account_id':account_id}
		});
	}
	//获取账户列表
	this.getAccountList = function(){
		return $http({
			method:'GET',
			url:home_path+"/Account/get_account_list.html"
		});
	}
});

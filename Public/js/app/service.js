/**
验证服务
by Hisheng
at 2015-11-16
*/
note.service('validator',function(){
	//邮箱验证
	this.checkEmail = function(email){
		//支持中文邮箱
		var re = /^[\u4e00-\u9fa5a-zA-Z\d]+([-_.][\u4e00-\u9fa5A-Za-z\d]+)*@([\u4e00-\u9fa5A-Za-z\d]+[-.]){1,2}[\u4e00-\u9fa5A-Za-z\d]{2,5}$/g;
		//var c_re = re.compile();
		return re.test(email);
	}
	//用户名验证
	//以英文字母或中文开头,只能包含数字，下划线，字母，中文
	this.checkUsername = function(username){
		var re = /^([a-z,A-Z,\u4e00-\u9fa5])([\w,\d,\u4e00-\u9fa5,_])*$/g;
		return re.test(username);
	}
	//check if empty
	this.isEmpty = function(value){
		var re = /^[\s,\n,\t]*$/g;
		return re.test(value);
	}
});
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
/**
账单服务,账单的增删查改
by Hisheng
at 2015-11-16
**/
note.service('Bill',function($http){
	//增
	this.add = function(bill){
		return $http({
			method:'POST',
			url:home_path+"/Bill/add_bill.html",
			data:bill
		});
	}
	//删
	this.delete = function(bill_id){
		return $http({
			method:'POST',
			url:home_path+"/Bill/delete_bill.html",
			data:{'bill_id':bill_id}
		});
	}
	//查
	this.query = function(condition){
		return $http({
			method:'POST',
			url:home_path+"/Bill/bill_query.html",
			data:condition
		});
	}
	//改
	this.modify = function(bill){
		return $http({
			method:'POST',
			url:home_path+"/Bill/modify_bill.html",
			data:bill
		});
	}
	//获取今日账单
	this.getTodayBills = function(){
		return $http({
			method:'GET',
			url:home_path+"/Bill/get_today_bills.html",
		});
	}
	//根据id获取账单
	this.getBillById = function(bill_id){
		return $http({
			method:'GET',
			url:home_path+"/Bill/get_bill_by_id.html?bill_id="+bill_id,
		});
	}
	//查看账单详情
	this.view = function(billId){
		//
	}
	//获取账单分类信息,type表明是支出分类还是收入分类
	this.getCategoryInfo = function(type){
		return $http({
			method:'GET',
			url:home_path+"/Bill/get_user_bill_categories.html?type="+type,
		});
	}
	//添加分类
	this.addCategory = function(categoryItem){
		return $http({
			method:'POST',
			url:home_path+"/Bill/add_bill_category.html",
			data:categoryItem
		});
	}
	//删除一级分类
	this.deleteCategory = function(bill_category_id){
		return $http({
			method:'POST',
			url:home_path+"/Bill/delete_bill_category.html",
			data:{bill_category_id:bill_category_id}
		});
	}
	//删除二级分类
	this.deleteChildCategory = function(child_bill_category_id){
		return $http({
			method:'POST',
			url:home_path+"/Bill/delete_child_bill_category.html",
			data:{child_bill_category_id:child_bill_category_id}
		});
	}
	//修改一级分类
	this.modifyCategory = function(bill_category_id,bill_category_name){
		return $http({
			method:'POST',
			url:home_path+"/Bill/modify_bill_category.html",
			data:{'bill_category_id':bill_category_id,'bill_category_name':bill_category_name}
		});
	}
	//修改二级分类
	this.modifyChildCategory = function(child_bill_category_id,child_bill_category_name){
		return $http({
			method:'POST',
			url:home_path+"/Bill/modify_child_bill_category.html",
			data:{'child_bill_category_id':child_bill_category_id,'child_bill_category_name':child_bill_category_name}
		});
	}
});

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

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
});

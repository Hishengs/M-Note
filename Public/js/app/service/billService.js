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

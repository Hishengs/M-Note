//-------------服务-----------------
//账单服务，用户获取用户账单分类信息
//支出分类
m_index.service('BillOutcomeCategory',function($http){
	this.requestUrl = home_path+"/Bill/get_user_bill_categories.html?type=outcome";
	this.billOutcomeCategories = [];

	this.updateBillOutcomeCategory = function(){
		$http.get(this.requestUrl).success(function(res){
			console.log("通过服务更新了账单支出分类:");
			console.log(res);
			if(res.error === 0){
				this.billOutcomeCategories = res.bill_category_items;
			}
		});
	};
	//update是否需要更新
	this.getBillOutcomeCategory = function(update){
		if(update){
			return $http.get(this.requestUrl);
		}else return this.billOutcomeCategories;
	}
});
//收入分类
m_index.service('BillIncomeCategory',function($http){
	this.requestUrl = home_path+"/Bill/get_user_bill_categories.html?type=income";
	this.billIncomeCategories = [];
	this.updateBillIncomeCategory = function(){
		$http.get(this.requestUrl).success(function(res){
			console.log("通过服务更新了账单收入分类:");
			console.log(res);
			if(res.error === 0){
				this.billIncomeCategories = res.bill_category_items;
			}
		});
	};
	//update是否需要更新
	this.getBillIncomeCategory = function(update){
		if(update){
			return $http.get(this.requestUrl);
		}else return this.billIncomeCategories;
	}
});
//账户信息
m_index.service('Accounts',function($http){
	this.requestUrl = home_path+"/Account/get_user_accounts.html";
	this.accounts = [];
	this.updateAccounts = function(){
		$http.get(this.requestUrl).success(function(res){
			console.log("通过服务更新了账户信息:");
			console.log(res);
			if(res.error === 0){
				this.accounts = res.account_items;
			}
		});
	};
	//update是否需要更新
	this.getAccounts = function(update){
		if(update){
			return $http.get(this.requestUrl);
		}else return this.accounts;
	}
});
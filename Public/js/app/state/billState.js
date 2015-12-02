//--------------------------------------记账-----------------------------------------------
note.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('bill',{ 
		url:'/bill',
		views:{'content':{templateUrl:templates_path+'/bill/bill.html'}}
	}).state('today_bills',{ //记账-今日账单-默认的state
		url:'/today',
		parent:'bill',
		views:{'bill_view':{templateUrl:templates_path+'/bill/today_bills.html'}}
	}).state('bill_query',{ //记账-账单查询
		url:'/query',
		parent:'bill',
		views:{'bill_view':{templateUrl:templates_path+'/bill/bill_query.html'}}
	}).state('bill_category',{ //记账-账单分类
		url:'/categoryItems',
		parent:'bill',
		views:{'bill_view':{templateUrl:templates_path+'/bill/bill_category.html'}}
	}).state('bill_details',{ //记账-账单详情
		url:'/bill/:billId',
		parent:'today_bills',
		views:{'bill_details_view':{templateUrl:templates_path+'/bill/bill_details.html'}}
	}).state('modify_bill',{ //记账-账单修改
		url:'/modify',
		parent:'today_bills',
		views:{'bill_details_view':{templateUrl:templates_path+'/bill/modify_bill.html'}}
	}).state('modify_bill_outcome',{ //记账-账单修改-outcome
		url:'/modifyBillOutcome',
		parent:'modify_bill',
		views:{'modify_bill_view':{templateUrl:templates_path+'/bill/modify_bill_outcome.html'}}
	}).state('modify_bill_income',{ //记账-账单修改-income
		url:'/modifyBillIncome',
		parent:'modify_bill',
		views:{'modify_bill_view':{templateUrl:templates_path+'/bill/modify_bill_income.html'}}
	}).state('bill_add_outcome',{ //新建支出
		url:'/add/outcome',
		parent:'bill',
		views:{'bill_add_view':{templateUrl:templates_path+'/bill/bill_add_outcome.html'}}
	}).state('bill_add_income',{ //新建收入
		url:'/add/income',
		parent:'bill',
		views:{'bill_add_view':{templateUrl:templates_path+'/bill/bill_add_income.html'}}
	}).state('add_category',{ //添加分类
		url:'/add/category',
		parent:'bill',
		views:{'bill_add_view':{templateUrl:templates_path+'/bill/add_category.html'}}
	}).state('add_account',{ //添加账户
		url:'/add/account',
		parent:'bill',
		views:{'bill_add_view':{templateUrl:templates_path+'/bill/add_account.html'}}
	});
}]);
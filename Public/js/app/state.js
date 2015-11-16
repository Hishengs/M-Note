//首页
m_index.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('home',{  
		url:'',
		views:{'content':{templateUrl:templates_path+'/home.html'}}
	}).state('login',{  //登陆
		url:'/login',
		views:{'content':{templateUrl:templates_path+'/login.html'}}
	}).state('register',{ //注册
		url:'/register',
		views:{'content':{templateUrl:templates_path+'/register.html'}}
	});
}]);
//--------------------------------------记账-----------------------------------------------
m_index.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('bill',{ 
		url:'/bill',
		views:{'content':{templateUrl:templates_path+'/bill/bill.html'}}
	}).state('today_bills',{ //记账-今日账单-默认的state
		url:'/today_bills',
		parent:'bill',
		views:{'bill_view':{templateUrl:templates_path+'/bill/today_bills.html'}}
	}).state('bill_query',{ //记账-账单查询
		url:'/bill_query',
		parent:'bill',
		views:{'bill_view':{templateUrl:templates_path+'/bill/bill_query.html'}}
	}).state('bill_category',{ //记账-账单分类
		url:'/bill_category',
		parent:'bill',
		views:{'bill_view':{templateUrl:templates_path+'/bill/bill_category.html'}}
	}).state('bill_details',{ //记账-账单详情
		url:'/details',
		parent:'today_bills',
		views:{'bill_details_view':{templateUrl:templates_path+'/bill/bill_details.html'}}
	}).state('modify_bill',{ //记账-账单修改
		url:'/modify_bill',
		parent:'today_bills',
		views:{'bill_details_view':{templateUrl:templates_path+'/bill/modify_bill.html'}}
	}).state('modify_bill_outcome',{ //记账-账单修改-outcome
		url:'/modify_bill_outcome',
		parent:'modify_bill',
		views:{'modify_bill_view':{templateUrl:templates_path+'/bill/modify_bill_outcome.html'}}
	}).state('modify_bill_income',{ //记账-账单修改-income
		url:'/modify_bill_income',
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
		url:'/add_category',
		parent:'bill',
		views:{'bill_add_view':{templateUrl:templates_path+'/bill/add_category.html'}}
	}).state('add_account',{ //添加账户
		url:'/add_account',
		parent:'bill',
		views:{'bill_add_view':{templateUrl:templates_path+'/bill/add_account.html'}}
	});
}]);
//------------------------------------报表----------------------------------------------------
m_index.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('charts',{ 
		url:'/charts',
		views:{'content':{templateUrl:templates_path+'/charts/charts.html'}}
	}).state('budget',{ //报表-预算
		url:'/budget',
		parent:'charts',
		views:{'charts_view':{templateUrl:templates_path+'/charts/budget.html'}}
	});
}]);
//----------------------------------账户-----------------------------------------------------
m_index.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('accounts',{ 
		url:'/accounts',
		views:{'content':{templateUrl:templates_path+'/accounts/accounts.html'}}
	}).state('accounts_sum',{ //账户-总的账户情况
		url:'/accounts_sum',
		parent:'accounts',
		views:{'accounts_view':{templateUrl:templates_path+'/accounts/accounts_sum.html'}}
	}).state('account',{ //账户-单个账户详情
		url:'/account',
		parent:'accounts',
		views:{'accounts_view':{templateUrl:templates_path+'/accounts/account.html'}}
	});
}]);
//----------------------------------用户中心-----------------------------------------------------
m_index.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('user',{ 
		url:'/user',
		views:{'content':{templateUrl:templates_path+'/user/user.html'}}
	}).state('basicInfo',{ //用户-基本信息
		url:'/basicInfo',
		parent:'user',
		views:{'user_view':{templateUrl:templates_path+'/user/basicInfo.html'}}
	}).state('modifyPasswd',{ //用户-修改密码
		url:'/modifyPasswd',
		parent:'user',
		views:{'user_view':{templateUrl:templates_path+'/user/modifyPasswd.html'}}
	});
}]);
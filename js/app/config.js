m_index.config(['$locationProvider', '$urlRouterProvider', '$compileProvider',function($locationProvider, $urlRouterProvider,$compileProvider) {
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("");
    //deal unsafe:javascript:...
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
}]);

//state
m_index.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('home',{  //首页
		url:'',
		views:{'content':{templateUrl:templates_path+'/home.html'}}
	}).state('login',{  //登陆
		url:'/login',
		views:{'content':{templateUrl:templates_path+'/login.html'}}
	}).state('register',{ //注册
		url:'/register',
		views:{'content':{templateUrl:templates_path+'/register.html'}}
	}).state('bill',{ //--------------------------------------记账-----------------------------------------------
		url:'/bill',
		views:{'content':{templateUrl:templates_path+'/bill/bill.html'}}
	}).state('bill_details',{ //记账-账单详情
		url:'/bill_details',
		parent:'bill',
		views:{'bill_details_view':{templateUrl:templates_path+'/bill/bill_details.html'}}
	}).state('modify_bill',{ //记账-账单修改
		url:'/modify_bill',
		parent:'bill',
		views:{'bill_details_view':{templateUrl:templates_path+'/bill/modify_bill.html'}}
	}).state('modify_bill_outcome',{ //记账-账单修改-outcome
		url:'/modify_bill_outcome',
		parent:'modify_bill',
		views:{'modify_bill_view':{templateUrl:templates_path+'/bill/modify_bill_outcome.html'}}
	}).state('modify_bill_income',{ //记账-账单修改-income
		url:'/modify_bill_income',
		parent:'modify_bill',
		views:{'modify_bill_view':{templateUrl:templates_path+'/bill/modify_bill_income.html'}}
	}).state('bill_outcome',{ //支出
		url:'/outcome',
		parent:'bill',
		views:{'bill_view':{templateUrl:templates_path+'/bill/outcome.html'}}
	}).state('bill_income',{ //收入
		url:'/income',
		parent:'bill',
		views:{'bill_view':{templateUrl:templates_path+'/bill/income.html'}}
	}).state('charts',{ //------------------------------------报表----------------------------------------------------
		url:'/charts',
		views:{'content':{templateUrl:templates_path+'/charts/charts.html'}}
	}).state('budget',{ //报表-预算
		url:'/budget',
		parent:'charts',
		views:{'charts_view':{templateUrl:templates_path+'/charts/budget.html'}}
	}).state('accounts',{ //----------------------------------账户-----------------------------------------------------
		url:'/accounts',
		views:{'content':{templateUrl:templates_path+'/accounts/accounts.html'}}
	}).state('cash',{ //账户-现金
		url:'/cash',
		parent:'accounts',
		views:{'accounts_view':{templateUrl:templates_path+'/accounts/cash.html'}}
	});
}]);
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
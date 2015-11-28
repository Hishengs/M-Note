//----------------------------------账户-----------------------------------------------------
note.config(['$stateProvider',function($stateProvider){
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
	}).state('account_manage',{ //账户-账户管理
		url:'/manage',
		parent:'accounts',
		views:{'accounts_view':{templateUrl:templates_path+'/accounts/manage.html'}}
	}).state('account_transfer',{ //账户-转账
		url:'/transfer',
		parent:'accounts',
		views:{'accounts_view':{templateUrl:templates_path+'/accounts/transfer.html'}}
	}).state('account_transfer_query',{ //账户-转账查询
		url:'/transfer/query',
		parent:'accounts',
		views:{'accounts_view':{templateUrl:templates_path+'/accounts/transfer_query.html'}}
	});
}]);
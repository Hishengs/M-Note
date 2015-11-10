//---------------------账户控制器-------------------------
//----------------------------------------账户页面----------------------------------------------
//---+c_accounts
//---|---c_account 单个账户详情
//---|---c_cash

//c_accounts
m_index.controller('c_accounts',function($scope,$rootScope,$state,$http,Accounts){
	//获取账户分类
	Accounts.getAccounts(true).success(function(res){
		$rootScope.account_items = res.account_items;
		$rootScope.child_accounts = $rootScope.account_items[0].child_accounts;
	});
	setTitle("随手记-账户");
	$state.go('accounts_sum');
	$scope.current_accounts_tab = 'cash';
	//显示单个账户信息
	$scope.showAccount = function(account_id){
		console.log("account_id:"+account_id);
		//$rootScope.account_id = account_id;
		//请求该账户的信息
		$http.get(home_path+"/Account/get_account_info.html?account_id="+account_id).success(function(res){
			if(res.error === 0){
				$rootScope.account = res.account;
			}
		});
		$state.go('account');
	}
	//添加账户
	$scope.addAccount = function(){
		var add_account_modal = UIkit.modal("#add-account-modal");
		if ( add_account_modal.isActive() ) {
		    add_account_modal.hide();
		} else {
		    add_account_modal.show();
		}
	}
	//切换账户
	$scope.switchAccountsTab = function(tab){
		$scope.current_accounts_tab = tab;
	}
});
//添加账户
m_index.controller('c_add_account_modal',function($scope,$state){
	$scope.add_self_account_btn_icon = '<i class="uk-icon-toggle-off uk-icon-medium"></i>';
	$scope.ifAddSelfAccount = false;
	//添加自定义类型
	$scope.addSelfAccount = function(){
		$scope.ifAddSelfAccount = $scope.ifAddSelfAccount?false:true;
		if($scope.ifAddSelfAccount)
			$scope.add_self_account_btn_icon = '<i class="uk-icon-toggle-on uk-icon-medium"></i>';
		else $scope.add_self_account_btn_icon = '<i class="uk-icon-toggle-off uk-icon-medium"></i>';
	}
})
//c_accounts_sum
m_index.controller('c_accounts_sum',function($scope,$state){
	//modify-account-modal
	$scope.modifyAccount = function(){
		var modify_account_modal = UIkit.modal("#modify-account-modal");
		if ( modify_account_modal.isActive() ) {
		    modify_account_modal.hide();
		} else {
		    modify_account_modal.show();
		}
	}
});
//c_account 
m_index.controller('c_account',function($scope,$rootScope,$state,$http){
	//
});
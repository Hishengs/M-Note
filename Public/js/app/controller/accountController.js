//---------------------账户控制器-------------------------
//----------------------------------------账户页面----------------------------------------------
//---+c_accounts
//---|---c_account 单个账户详情
//---|---c_cash

//c_accounts
note.controller('c_accounts',function($scope,$rootScope,$state,Account){
	$scope.current_account = {};
	$scope.current_accounts_tab = 'account_manage';
	
	//获取账户分类
	Account.getBasicAccountItems().success(function(res){
		$rootScope.account_items = res.account_items;
		$rootScope.child_accounts = $rootScope.account_items[0].child_accounts;
	});
	setTitle("随手记-账户");
	$state.go('account_manage');
	
	//切换账户
	$scope.switchAccountsTab = function(tab){
		$scope.current_accounts_tab = tab;
		$state.go(tab,{reload:true});
	}
});
//查看账户详情
note.controller('c_account_view',function($scope,$rootScope,$state,Account){
	$scope.current_account = {};
	$scope.account_bills_tip_show = false;
	//请求该账户的信息
	Account.getAccount($rootScope.current_account_id).success(function(res){
		console.log(res);
		if(res.error === 0){
			$scope.current_account.account = res.account;
			//先置零
			$scope.current_account.flow_in = 0;
			$scope.current_account.flow_out = 0;
			$scope.current_account.balance = parseFloat($scope.current_account.account.child_account_balance);
			//计算余额s,流入in流出out
			for(var i=0;i<$scope.current_account.account.bills.length;i++){
				if($scope.current_account.account.bills[i].bill_type == 1)//支出
				{
					$scope.current_account.flow_out += parseFloat($scope.current_account.account.bills[i].bill_sum);
				}else $scope.current_account.flow_in += parseFloat($scope.current_account.account.bills[i].bill_sum);
			}
			if(!i)$scope.account_bills_tip_show = true;
			else $scope.account_bills_tip_show = false;
			$scope.current_account.balance += $scope.current_account.flow_in - $scope.current_account.flow_out;
			console.log($scope.current_account);
		}else hMessage(res.msg);
	});
	//查看账单详情
	$scope.showBillDetail = function(index){
		//
	}
	//返回
	$scope.backward = function(){
		$state.go('account_manage');
	}
})
//账户管理
note.controller('c_account_manage',function($scope,$rootScope,$state,Account){
	$scope.start_date = $scope.end_date = null;
	$scope.account_items = {};
	$scope.is_self_defined = false;
	$scope.toggle_type = "off";
	$scope.added_account = "";
	$scope.modified_child_account = {};
	$scope.modified_account = {};
	$scope.added_child_account = {};
	$scope.sum = {};

	$scope.updateAccountList = function(end_date){
		if(end_date)var cdt = {'end_date':end_date};
		//更新账户列表
		Account.getDetailedAccountItems(cdt).success(function(res){
			console.log(res);
			if(res.error === 0){
				$scope.account_items = res.account_list;
				$scope.added_account = $scope.account_items[0].account_id;
				//计算总额
				$scope.sumAccounts($scope.account_items);
			}else hMessage(res.msg);
		});
	}
	$scope.updateAccountList();
	//计算账户总额
	$scope.sumAccounts = function(account_items){
		$scope.sum.balance = $scope.sum.flow_in = $scope.sum.flow_out = 0;
		for(var i=0;i<account_items.length;i++){
			for(var j=0;j<account_items[i].child_accounts.length;j++){
				$scope.sum.flow_in += parseFloat(account_items[i].child_accounts[j].flow_in);
				$scope.sum.flow_out += parseFloat(account_items[i].child_accounts[j].flow_out);
				$scope.sum.balance += parseFloat(account_items[i].child_accounts[j].child_account_balance);
			}
		}
		$scope.sum.balance += $scope.sum.flow_in - $scope.sum.flow_out;
	}
	//按時間查詢賬戶詳情
	$scope.query = function(){
		console.log('end_date:'+$scope.end_date);
		$scope.updateAccountList($scope.end_date);
	}
	//添加账户
	$scope.vAddAccount = function(){
		UIkit.modal("#account_add_modal").show();
	}
	//添加自定义账户
	$scope.switchAddSelfAccount = function(){
		$scope.is_self_defined = $scope.is_self_defined?false:true;
		$scope.toggle_type = $scope.toggle_type=="on"?"off":"on";
		$scope.added_account = $scope.added_account==""?$scope.account_items[0].account_id:"";
	}
	//提交添加账户
	$scope.addAccount = function(){
		var is_self_defined = $scope.is_self_defined?1:0;
		var account = {'is_self_defined':is_self_defined,'account':$scope.added_account,
		'child_account_name':$scope.added_child_account.name,'child_account_balance':$scope.added_child_account.default_balance,
		'child_account_remarks':$scope.added_child_account.remarks};
		console.log(account);
		Account.add(account).success(function(res){
			if(res.error === 0){
				//更新账户信息
				$scope.updateAccountList();
				hMessage("账户添加成功！");
			}else hMessage(res.msg);
		});
	}
	//修改一级账户
	$scope.vModifyAccount = function(account_item){
		$scope.modified_account = account_item;
		console.log($scope.modified_account);
		UIkit.modal("#account_modify_modal").show();
	}
	//修改二级账户
	$scope.vModifyChildAccount = function(child_account){
		$scope.modified_child_account = child_account;
		$scope.modified_child_account.balance = parseFloat($scope.modified_child_account.child_account_balance) + $scope.modified_child_account.flow_in - $scope.modified_child_account.flow_out;
		console.log($scope.modified_child_account);
		UIkit.modal("#child_account_modify_modal").show();
	}
	//提交修改一级账户
	$scope.modifyAccount = function(){
		Account.modifyAccount($scope.modified_account).success(function(res){
			if(res.error === 0){
				$scope.updateAccountList();
				hMessage("账户修改成功！");
			}else hMessage(res.msg);
		});
	}
	//提交修改二级账户
	$scope.modifyChildAccount = function(){
		//修正余额
		var added_num = $scope.modified_child_account.balance-(parseFloat($scope.modified_child_account.child_account_balance)+($scope.modified_child_account.flow_in - $scope.modified_child_account.flow_out));
		$scope.modified_child_account.child_account_balance = parseFloat($scope.modified_child_account.child_account_balance) + added_num;
		console.log('added_num'+added_num);
		Account.modifyChildAccount($scope.modified_child_account).success(function(res){
			if(res.error === 0){
				$scope.updateAccountList();
				hMessage("账户修改成功！");
			}else hMessage(res.msg);
		});
	}
	//删除一级账户
	$scope.deleteAccount = function(account_id){
		if(confirm("你确定要删除该一级账户??该账户下所有的子账户及其账单都将被删除！！")){
			console.log("删除一级账户:"+account_id);
			Account.delete(account_id,1).success(function(res){
				if(res.error === 0){
					$scope.updateAccountList();
					hMessage("账户删除成功！");
				}else hMessage(res.msg);
			});
		}
	}
	//删除二级账户
	$scope.deleteChildAccount = function(child_account_id){
		if(confirm("你确定要删除该二级账户??该账户下所有的账单都将被删除！！")){
			console.log("删除二级账户:"+child_account_id);
			Account.delete(child_account_id,2).success(function(res){
				if(res.error === 0){
					$scope.updateAccountList();
					hMessage("账户删除成功！");
				}else hMessage(res.msg);
			});
		}
	}
	//查看账户详情
	$scope.viewChildAccount =function(account_id){
		$rootScope.current_account_id = account_id;
		console.log("account_id:"+account_id);
		$state.go('account');
	}
});
//转账
note.controller('c_account_transfer',function($scope,$rootScope,$state,Account){
	$scope.out_account = {items:{},child_accounts:{},account:null,child_account:null};
	$scope.in_account = {items:{},child_accounts:{},account:null,child_account:null};
	$scope.transfer_num = null;
	$scope.transfer_remarks = null;
	//获取账户分类
	Account.getBasicAccountItems().success(function(res){
		$scope.out_account.account_items = $scope.in_account.account_items = res.account_items;
		$scope.out_account.child_accounts = $scope.in_account.child_accounts = res.account_items[0].child_accounts;
		$scope.out_account.account = $scope.in_account.account = $rootScope.account_items[0].account_id;
		$scope.out_account.child_account = $scope.in_account.child_account = $rootScope.child_accounts[0].child_account_id;
		//Listener
		$scope.$watch('out_account.account',function(newV,oldV){
			for(var i=0;i<$scope.out_account.account_items.length;i++){
				if(newV === $scope.out_account.account_items[i].account_id){
					$scope.out_account.child_accounts = $scope.out_account.account_items[i].child_accounts;
					$scope.out_account.child_account = $scope.out_account.child_accounts[0].child_account_id;
				}
			}
		});
		$scope.$watch('in_account.account',function(newV,oldV){
			for(var i=0;i<$scope.in_account.account_items.length;i++){
				if(newV === $scope.in_account.account_items[i].account_id){
					$scope.in_account.child_accounts = $scope.in_account.account_items[i].child_accounts;
					$scope.in_account.child_account = $scope.in_account.child_accounts[0].child_account_id;
				}
			}
		});
	});
	$scope.transfer = function(){
		var cdt = {out_account:$scope.out_account.child_account,in_account:$scope.in_account.child_account,transfer_num:$scope.transfer_num,transfer_remarks:$scope.transfer_remarks};
		if(cdt.out_account === cdt.in_account){hMessage('不能在同一个账户上进行转账！');return;}
		if(typeof cdt.transfer_num !== "number"){hMessage('金额只能为数字！');return;}
		if(cdt.transfer_num <= 0){hMessage('金额只能为正数！');return;}
		
		console.log(cdt);
		Account.transfer(cdt).success(function(res){
			console.log(res);
			if(res.error === 0){
				hMessage('转账成功！');
			}else hMessage(res.msg);
		});
	}
});
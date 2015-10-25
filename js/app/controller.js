var controller_path = '';
//主控制器
m_index.controller('c_index',function($scope,$rootScope,$state,$http){
	$state.go('home');
});
//navigation
m_index.controller('c_nav',function($scope,$state){
	$scope.current_tab = 'home';
	$scope.switchTab = function(tab){
		$scope.current_tab = tab;
	}
});
//----------------------------------------记账页面----------------------------------------------
//|-+c_bill
//|---c_add_bill_modal
//|---+c_bill_details_modal
//|---|---c_modify_bill

//c_bill
m_index.controller('c_bill',function($scope,$state,$http){
	//获取当日账单列表，bill_list
	/*$http.get(controller_path+'').success(function(res){
		if(res.error === 0)
			$scope.bill_list = res.data;
			$scope.bill_tip_show = false;
		else if(res.error === 2){//查询为空
			$scope.bill_tip_show = true;
			$scope.bill_tip = '今天还没有账单信息，快去记一笔吧！';
		}
		else console.log(res.msg);
	});*/
	$scope.bill_tip_show = true;
	$scope.bill_tip = '今天还没有账单信息，快去记一笔吧！';
	$scope.showAddBillModal = function(){//显示新增账单模态框
		var bill_modal = UIkit.modal("#add-bill-modal");
		if ( bill_modal.isActive() ) {
		    bill_modal.hide();
		} else {
		    bill_modal.show();
		}
		$state.go('bill_outcome');
	}
	$scope.showBillDetail = function(){//显示账单详情模态框
		var bill_detail_modal = UIkit.modal("#bill-detail-modal");
		if ( bill_detail_modal.isActive() ) {
		    bill_detail_modal.hide();
		} else {
		    bill_detail_modal.show();
		}
		$state.go('bill_details');
	}
});
//c_add_bill_modal
m_index.controller('c_add_bill_modal',function($scope,$state){
	$scope.bill_type = '记账-支出';
	$scope.current_bill_view = 'outcome';
	var date = new Date();
	var current_minute = parseInt(date.getMinutes());
	var maxHour = parseInt(date.getHours());//设置限制最大时间
	$scope.hours = new Array();
	for (var i = 0; i < maxHour+1; i++) {
		if(current_minute >= 30)
		{$scope.hours.push(i+':00');$scope.hours.push(i+':30');}
		else $scope.hours.push(i+':00');
	};
	console.log($scope.hours);
	$scope.switchBillType = function(){
		if($scope.current_bill_view == 'outcome'){$state.go('bill_income');$scope.current_bill_view = 'income';$scope.bill_type = '记账-收入';}
		else {$state.go('bill_outcome');$scope.current_bill_view = 'outcome';$scope.bill_type = '记账-支出';}
	}
	//账单post
});
//c_bill_details_modal
m_index.controller('c_bill_details_modal',function($scope,$state,$http){
	$scope.deleteBill = function(){//删除账单
		confirm('你确定要删除该账单？本操作不可撤销！');
	}
	$scope.modifyBill = function(){//修改账单
		$state.go('modify_bill');
	}
});
//c_modify_bill
m_index.controller('c_modify_bill',function($scope,$state,$http){
	$scope.current_bill_type = 'outcome';
	$state.go('modify_bill_outcome');
	$scope.bill_modify_tip_show = false;//提示
	//根据账单id获取账单类型，根据账单类型对应显示不同的view(outcome/income)
	$scope.switchBillType = function(){//切换支出-收入
		if($scope.current_bill_type == 'outcome'){
			$state.go('modify_bill_income');
			$scope.current_bill_type = 'income';
		}else{
			$state.go('modify_bill_outcome');
			$scope.current_bill_type = 'outcome';
		}
		$scope.bill_modify_tip_show = true;
		$scope.bill_modify_tip = '切换类型后账单<b>类别</b>可能需要修改！';
	}
	$scope.backward = function(){//返回账单详情页面
		$scope.bill_modify_tip_show = false;
		$state.go('bill_details');
	}
});

//----------------------------------------报表页面----------------------------------------------
//---+c_charts
//---|---c_budget

//c_charts
m_index.controller('c_charts',function($scope,$state){
	$state.go('budget');
	$scope.current_charts_tab = 'budget';
	$scope.switchChartsTab = function(tab){
		$scope.current_charts_tab = tab;
	}
});
//c_budget
m_index.controller('c_budget',function($scope,$state){});

//----------------------------------------账户页面----------------------------------------------
//---+c_accounts
//---|---c_cash

//c_accounts
m_index.controller('c_accounts',function($scope,$state){
	$state.go('cash');
	$scope.current_accounts_tab = 'cash';
	$scope.addAccount = function(){
		var add_account_modal = UIkit.modal("#add-account-modal");
		if ( add_account_modal.isActive() ) {
		    add_account_modal.hide();
		} else {
		    add_account_modal.show();
		}
	}
	$scope.switchAccountsTab = function(tab){
		$scope.current_accounts_tab = tab;
	}
});
//c_cash
m_index.controller('c_cash',function($scope,$state){});
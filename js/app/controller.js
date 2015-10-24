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
//c_bill
m_index.controller('c_bill',function($scope,$state){
	$scope.bill_tip_show = true;
	$scope.bill_tip = '今天还没有账单信息，快去记一笔吧！';
	$scope.showBillModal = function(){
		var bill_modal = UIkit.modal("#new-bill-modal");
		if ( bill_modal.isActive() ) {
		    bill_modal.hide();
		} else {
		    bill_modal.show();
		}
		$state.go('bill_outcome');
	}
	$scope.showBillDetail = function(){
		var bill_detail_modal = UIkit.modal("#bill-detail");
		if ( bill_detail_modal.isActive() ) {
		    bill_detail_modal.hide();
		} else {
		    bill_detail_modal.show();
		}
		//$state.go('bill_outcome');
	}
});
//c_bill_modal
m_index.controller('c_bill_modal',function($scope,$state){
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
});
//c_charts
m_index.controller('c_charts',function($scope,$state){
	$state.go('budget');
});
//c_budget
m_index.controller('c_budget',function($scope,$state){});
//c_accounts
m_index.controller('c_accounts',function($scope,$state){
	$state.go('cash');
	$scope.addAccount = function(){
		var add_account_modal = UIkit.modal("#add-account-modal");
		if ( add_account_modal.isActive() ) {
		    add_account_modal.hide();
		} else {
		    add_account_modal.show();
		}
	}
});
//c_cash
m_index.controller('c_cash',function($scope,$state){});
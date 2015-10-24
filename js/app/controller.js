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
});
//c_bill_modal
m_index.controller('c_bill_modal',function($scope,$state){
	$scope.bill_type = '记账-支出';
	$scope.current_bill_view = 'outcome';
	
	$scope.switchBillType = function(){
		if($scope.current_bill_view == 'outcome'){$state.go('bill_income');$scope.current_bill_view = 'income';$scope.bill_type = '记账-收入';}
		else {$state.go('bill_outcome');$scope.current_bill_view = 'outcome';$scope.bill_type = '记账-支出';}
	}
});
//c_charts
m_index.controller('c_charts',function(){});
//c_accounts
m_index.controller('c_accounts',function(){});
//c_cash
m_index.controller('c_cash',function(){});
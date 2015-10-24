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
//c_bill_modal
m_index.controller('c_bill_modal',function($scope,$state){
	$scope.bill_type = '记账-支出';
	$scope.current_bill_view = 'outcome';
	$state.go('bill_outcome');
	$scope.switchBillType = function(){
		if($scope.current_bill_view == 'outcome'){$state.go('bill_income');$scope.current_bill_view = 'income';$scope.bill_type = '记账-收入';}
		else {$state.go('bill_outcome');$scope.current_bill_view = 'outcome';$scope.bill_type = '记账-支出';}
	}
});
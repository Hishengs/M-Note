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
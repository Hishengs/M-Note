/*报表信息
增删查改
by Hisheng
at 2015-11-19
**/
note.service('Charts',function($http){
	//获取分布图数据
	this.getDistributeData = function(cdt){
		return $http({
			method:'POST',
			url:home_path+"/Charts/get_distribute_data.html",
			data:{'cdt':cdt}
		});
	}
	//获取收支对比数据
	this.getCompareData = function(cdt){
		return $http({
			method:'POST',
			url:home_path+"/Charts/get_compare_data.html",
			data:{'cdt':cdt}
		});
	}
});

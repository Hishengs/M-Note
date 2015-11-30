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
	//获取收支趋势数据
	this.getTrendData = function(cdt){
		return $http({
			method:'POST',
			url:home_path+"/Charts/get_trend_data.html",
			data:{'cdt':cdt}
		});
	}
	//资产分布的数据
	this.getPropertyDistributeData = function(cdt){
		return $http({
			method:'POST',
			url:home_path+"/Charts/get_property_distribute_data.html",
			data:cdt
		});
	}
	//资产趋势数据
	this.getPropertyTrendData = function(cdt){
		return $http({
			method:'GET',
			url:home_path+"/Charts/get_property_trend_data.html?end_date="+cdt['end_date'],
			/*data:cdt*/
		});
	}
});

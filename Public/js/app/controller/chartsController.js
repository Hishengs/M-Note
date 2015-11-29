//----------------报表控制器--------------------
note.controller('c_charts',function($scope,$rootScope,$http,Charts,$state){
	$state.go('compare');
	$scope.current_charts_tab = "compare";
	$scope.switchChartsTab = function(tab){
		$scope.current_charts_tab = tab;
		$state.go(tab);
	}
	//拷贝对象
	$rootScope.clone = function clone(obj) {
	    if (null == obj || "object" != typeof obj) return obj;
	    // Handle Date
	    if (obj instanceof Date) {
	        var copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }
	    // Handle Array
	    if (obj instanceof Array) {
	        var copy = [];
	        for (var i = 0; i < obj.length; ++i) {
	            copy[i] = $scope.clone(obj[i]);
	        }
	        return copy;
	    }
	    // Handle Object
	    if (obj instanceof Object) {
	        var copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = $scope.clone(obj[attr]);
	        }
	        return copy;
	    }
	    throw new Error("Unable to copy obj! Its type isn't supported.");
	}
	//设置图表选项的默认值
	//饼图
	$rootScope.pie_options = {};
	$rootScope.pie_options.title= {text:"",subtext:"",x:"center"};
	$rootScope.pie_options.legend = {orient:"vertical",x:"left",data:[]};
	$rootScope.pie_options.calculable = true;
	$rootScope.pie_options.tooltip = {trigger:'item',formatter: "{a} <br/>{b} : {c} ({d}%)"};
	$rootScope.pie_options.series = [{name:"",type:"pie",radius:"55%",center:['50%','60%'],data:[]}];
	//条形图
	$rootScope.line_options = {};
	$rootScope.line_options.title= {text:"",subtext:""};
	$rootScope.line_options.tooltip = {trigger: 'axis'};
	$rootScope.line_options.legend = {data:[]};
	$rootScope.line_options.calculable = true;
	$rootScope.line_options.xAxis = [{type : 'category',boundaryGap : false,data:[]}];
	$rootScope.line_options.yAxis = [{type : 'value',axisLabel:{formatter:'{value}'}}];
	$rootScope.line_options.series = [];
});
//分布图
note.controller('c_charts_distribute',function($scope,$rootScope,$http,Charts,$state){
	$scope.distribute_option = '0';
	$scope.start_date = $scope.end_date = "";
	$scope.charts_distribute_tip = '<i class="uk-icon-warning"></i> 请输入查询条件查询！';
	
	$scope.initCharts = function(){
		//
	}
	//初始化图表
	$scope.income_distribute_chart = echarts.init(document.getElementById('charts-distribute-pie-income'));//收入分布图
	$scope.outcome_distribute_chart = echarts.init(document.getElementById('charts-distribute-pie-outcome'));//支出分布图
	
	//查询
	$scope.query = function(){
		$scope.income_distribute_chart.clear();$scope.outcome_distribute_chart.clear();
		$scope.income_distribute_chart_options = $rootScope.clone($rootScope.pie_options);//待装载的数据
		$scope.income_distribute_chart_options.title.text = "收入分布图";
		$scope.income_distribute_chart_options.title.subtext = $scope.distribute_option=='0'?'账户':'分类';
		$scope.income_distribute_chart_options.series[0].name = $scope.distribute_option=='0'?'账户':'分类';
		
		$scope.outcome_distribute_chart_options = $rootScope.clone($rootScope.pie_options);//待装载的数据
		$scope.outcome_distribute_chart_options.title.text = "支出分布图";
		$scope.outcome_distribute_chart_options.title.subtext = $scope.distribute_option=='0'?'账户':'分类';
		$scope.outcome_distribute_chart_options.series[0].name = $scope.distribute_option=='0'?'账户':'分类';

		$scope.outcome_distribute_chart_options.legend.data = [];
		$scope.outcome_distribute_chart_options.series[0].data = [];
		$scope.income_distribute_chart_options.legend.data = [];
		$scope.income_distribute_chart_options.series[0].data = [];
		//获取数据
		var cdt = {'start_date':$scope.start_date,'end_date':$scope.end_date,'distribute':$scope.distribute_option};
		Charts.getDistributeData(cdt).success(function(res){
			console.log(cdt);
			if(res.error === 0){
				if($scope.distribute_option == '0'){//账户
					for(var i=0;i<res.bills.length;i++){
						if(res.bills[i].bill_type == 1){
							$scope.outcome_distribute_chart_options.legend.data.push(res.bills[i].child_account_name);
							$scope.outcome_distribute_chart_options.series[0].data.push({value:res.bills[i].bills_sum,name:res.bills[i].child_account_name});
						}
						else{
							$scope.income_distribute_chart_options.legend.data.push(res.bills[i].child_account_name);
							$scope.income_distribute_chart_options.series[0].data.push({value:res.bills[i].bills_sum,name:res.bills[i].child_account_name});
						}
					}
				}else{//分类
					for(var i=0;i<res.bills.length;i++){
						if(res.bills[i].bill_type == 1){
							$scope.outcome_distribute_chart_options.legend.data.push(res.bills[i].child_bill_category_name);
							$scope.outcome_distribute_chart_options.series[0].data.push({value:res.bills[i].bills_sum,name:res.bills[i].child_bill_category_name});
						}
						else{
							$scope.income_distribute_chart_options.legend.data.push(res.bills[i].child_bill_category_name);
							$scope.income_distribute_chart_options.series[0].data.push({value:res.bills[i].bills_sum,name:res.bills[i].child_bill_category_name});
						}
					}
				}
				if(i){
					$scope.income_distribute_chart.dispose();$scope.outcome_distribute_chart.dispose();
					$scope.income_distribute_chart = echarts.init(document.getElementById('charts-distribute-pie-income'));//收入分布图
					$scope.outcome_distribute_chart = echarts.init(document.getElementById('charts-distribute-pie-outcome'));//支出分布图
					$scope.charts_distribute_tip = '';
				}
				else {$scope.charts_distribute_tip = '<i class="uk-icon-warning"></i> 未查到相关信息！';}

				$scope.income_distribute_chart.setOption($scope.income_distribute_chart_options); 
				$scope.outcome_distribute_chart.setOption($scope.outcome_distribute_chart_options);

			}else hMessage(res.msg);
		});
	}
});
//对比图
note.controller('c_charts_compare',function($scope,$rootScope,$http,Charts,$state){
	$scope.start_date = $scope.end_date = "";
	$scope.charts_compare_tip = '<i class="uk-icon-warning"></i> 请输入查询条件查询！';

	//初始化图表
	$scope.compare_chart = echarts.init(document.getElementById('charts-compare-pie'));
	
	//查询
	$scope.query = function(){
		$scope.compare_chart.clear();
		$scope.compare_chart_options = $rootScope.clone($rootScope.pie_options);//待装载的数据
		$scope.compare_chart_options.title.text = "收支对比图";
		$scope.compare_chart_options.series[0].name = "金额";
		
		$scope.compare_chart_options.legend.data = [];
		$scope.compare_chart_options.series[0].data = [];
		//获取数据
		var cdt = {'start_date':$scope.start_date,'end_date':$scope.end_date};
		Charts.getCompareData(cdt).success(function(res){
			console.log(res);
			if(res.error === 0){
				for(var i=0;i<res.bills.length;i++){
					if(res.bills[i].bill_type == 1){
						$scope.compare_chart_options.legend.data.push('支出');
						$scope.compare_chart_options.series[0].data.push({value:res.bills[i].bills_sum,name:'支出'});
					}else{
						$scope.compare_chart_options.legend.data.push('收入');
						$scope.compare_chart_options.series[0].data.push({value:res.bills[i].bills_sum,name:'收入'});
					}
				}
				if(i){
					$scope.compare_chart.dispose();
					$scope.compare_chart = echarts.init(document.getElementById('charts-compare-pie'));
					$scope.charts_compare_tip = '';
				}else {$scope.charts_compare_tip = '<i class="uk-icon-warning"></i> 未查到相关信息！';}

				$scope.compare_chart.setOption($scope.compare_chart_options); 
			}else hMessage(res.msg);
		});
	}
});
//趋势图
note.controller('c_charts_trend',function($scope,$rootScope,$http,Charts,$state){
	//初始化图表
	$scope.time_unit = '1';
	$scope.start_date = $scope.end_date = "";
	$scope.charts_trend_tip = '<i class="uk-icon-warning"></i> 请输入查询条件查询！';

	//初始化图表
	$scope.outcome_trend_chart = echarts.init(document.getElementById('charts-trend-line-outcome'));//支出
	$scope.income_trend_chart = echarts.init(document.getElementById('charts-trend-line-income'));//收入
	
	//查询
	$scope.query = function(){
		$scope.outcome_trend_chart.clear();$scope.income_trend_chart.clear();
		$scope.outcome_trend_chart_options = $rootScope.clone($rootScope.line_options);//待装载的数据
		$scope.income_trend_chart_options = $rootScope.clone($rootScope.line_options);//待装载的数据

		$scope.outcome_trend_chart_options.title.text = "支出趋势图";
		$scope.income_trend_chart_options.title.text = "收入趋势图";

		switch(parseInt($scope.time_unit)){
			case 1:
				$scope.outcome_trend_chart_options.title.subtext = '单位:天';
				$scope.income_trend_chart_options.title.subtext = '单位:天';
				break;
			case 2:
				$scope.outcome_trend_chart_options.title.subtext = '单位:月';
				$scope.income_trend_chart_options.title.subtext = '单位:月';
				break;
			case 3:
				$scope.outcome_trend_chart_options.title.subtext = '单位:年';
				$scope.income_trend_chart_options.title.subtext = '单位:年';
				break;
			default:
				break;
		}
		
		$scope.outcome_trend_chart_options.legend.data = ['支出'];
		$scope.outcome_trend_chart_options.xAxis[0].data = [];
		$scope.outcome_trend_chart_options.series[0] = {};
		$scope.outcome_trend_chart_options.series[0].name = '支出';
		$scope.outcome_trend_chart_options.series[0].type = 'line';
		$scope.outcome_trend_chart_options.series[0].data = [];

		$scope.income_trend_chart_options.legend.data = ['收入'];
		$scope.income_trend_chart_options.xAxis[0].data = [];
		$scope.income_trend_chart_options.series[0] = {};
		$scope.income_trend_chart_options.series[0].name = '收入';
		$scope.income_trend_chart_options.series[0].type = 'line';
		$scope.income_trend_chart_options.series[0].data = [];
		
		//获取数据，默认单位是天
		var cdt = {'start_date':$scope.start_date,'end_date':$scope.end_date,'time_unit':$scope.time_unit};
		Charts.getTrendData(cdt).success(function(res){
			console.log(res);
			if(res.error === 0){
				for(var i=0;i<res.outcome_bills.length;i++){
					//var date = new Date(res.outcome_bills[i].bill_time);
					$scope.outcome_trend_chart_options.xAxis[0].data.push(res.outcome_bills[i].time_unit);
					$scope.outcome_trend_chart_options.series[0].data.push(res.outcome_bills[i].bill_sum);
				}
				for(var j=0;j<res.income_bills.length;j++){
					$scope.income_trend_chart_options.xAxis[0].data.push(res.income_bills[j].time_unit);
					$scope.income_trend_chart_options.series[0].data.push(res.income_bills[j].bill_sum);
				}
				if(!i&&!j)$scope.charts_trend_tip = '<i class="uk-icon-warning"></i> 未查到相关信息！';
				else $scope.charts_trend_tip = '';
				/*if(!i&&!j){
					$scope.charts_trend_tip = '<i class="uk-icon-warning"></i> 未查到相关信息！';
				}else if(i){
					$scope.charts_trend_tip = '';
					$scope.outcome_trend_chart.dispose();
					$scope.outcome_trend_chart_options = echarts.init(document.getElementById('charts-trend-line-outcome'));//支出
				}else if(j){
					$scope.charts_trend_tip = '';
					$scope.income_trend_chart.dispose();
					$scope.income_trend_chart = echarts.init(document.getElementById('charts-trend-line-income'));//收入
				}*/

				$scope.outcome_trend_chart.setOption($scope.outcome_trend_chart_options); 
				$scope.income_trend_chart.setOption($scope.income_trend_chart_options); 
			}else hMessage(res.msg);
		});
	}
});
//资产趋势图
note.controller('c_property_trend',function($scope,$rootScope,$http,Charts,$state){
	//初始化图表
	$scope.start_date = $scope.end_date = "";
	$scope.charts_property_trend_tip = '<i class="uk-icon-warning"></i> 请输入查询条件查询！';

	//初始化图表
	$scope.property_trend_chart = echarts.init(document.getElementById('charts-property-trend-line'));//支出
	
	//查询
	$scope.query = function(){
		$scope.property_trend_chart.clear();
		$scope.property_trend_chart_options = $rootScope.clone($rootScope.line_options);//待装载的数据

		$scope.property_trend_chart_options.title.text = "资产趋势图";
		
		$scope.property_trend_chart_options.legend.data = ['资产'];
		$scope.property_trend_chart_options.xAxis[0].data = [];
		$scope.property_trend_chart_options.series[0] = {};
		$scope.property_trend_chart_options.series[0].name = '资产';
		$scope.property_trend_chart_options.series[0].type = 'line';
		$scope.property_trend_chart_options.series[0].data = [];
		
		//获取数据
		var cdt = {'start_date':$scope.start_date,'end_date':$scope.end_date};
		Charts.getPropertyTrendData(cdt).success(function(res){
			console.log(res);
			if(res.error === 0){
				for(var i=0;i<res.outcome_bills.length;i++){
					//var date = new Date(res.outcome_bills[i].bill_time);
					$scope.property_trend_chart_options.xAxis[0].data.push(res.outcome_bills[i].bill_time);
					$scope.property_trend_chart_options.series[0].data.push(res.outcome_bills[i].bill_sum);
				}
				if(!i)$scope.charts_property_trend_tip = '<i class="uk-icon-warning"></i> 未查到相关信息！';
				else $scope.charts_property_trend_tip = '';

				$scope.property_trend_chart.setOption($scope.property_trend_chart_options); 
			}else hMessage(res.msg);
		});
	}
});
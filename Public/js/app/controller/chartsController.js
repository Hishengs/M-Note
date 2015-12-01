//----------------报表控制器--------------------
note.controller('c_charts',function($scope,$rootScope,$http,Charts,$state){
	$state.go('budget');
	$scope.current_charts_tab = "budget";
	$scope.switchChartsTab = function(tab){
		$scope.current_charts_tab = tab;
		$state.go(tab);
	}
});
//分布图
note.controller('c_charts_distribute',function($scope,$rootScope,$http,Charts,$state){
	$scope.distribute_option = '0';
	
	$scope.start_date = $rootScope.sdate;
	$scope.end_date = $rootScope.edate;
	$scope.charts_distribute_tip = '<i class="uk-icon-warning"></i> 请输入查询条件查询！';
	
	//初始化图表
	require(['echarts','echarts/chart/pie'],function(ec){
		$scope.income_distribute_chart = ec.init(document.getElementById('charts-distribute-pie-income'));//收入分布图
		$scope.outcome_distribute_chart = ec.init(document.getElementById('charts-distribute-pie-outcome'));//支出分布图

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

		$scope.query();
	});
	
	//$scope.income_distribute_chart = echarts.init(document.getElementById('charts-distribute-pie-income'));//收入分布图
	//$scope.outcome_distribute_chart = echarts.init(document.getElementById('charts-distribute-pie-outcome'));//支出分布图
	
	
});
//对比图
note.controller('c_charts_compare',function($scope,$rootScope,$http,Charts,$state){
	$scope.start_date = $rootScope.sdate;
	$scope.end_date = $rootScope.edate;
	$scope.charts_compare_tip = '<i class="uk-icon-warning"></i> 请输入查询条件查询！';

	//初始化图表
	require(['echarts','echarts/chart/pie'],function(ec){
		$scope.compare_chart = ec.init(document.getElementById('charts-compare-pie'));
		//$scope.compare_chart = echarts.init(document.getElementById('charts-compare-pie'));
		
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

		$scope.query();
	});
});
//趋势图
note.controller('c_charts_trend',function($scope,$rootScope,$http,Charts,$state){
	//初始化图表
	$scope.time_unit = '1';
	$scope.start_date = $rootScope.sdate;
	$scope.end_date = $rootScope.edate;
	$scope.charts_trend_tip = '<i class="uk-icon-warning"></i> 请输入查询条件查询！';

	//初始化图表
	require(['echarts','echarts/chart/line'],function(ec){
		$scope.outcome_trend_chart = ec.init(document.getElementById('charts-trend-line-outcome'));//支出
		$scope.income_trend_chart = ec.init(document.getElementById('charts-trend-line-income'));//收入
		//$scope.outcome_trend_chart = echarts.init(document.getElementById('charts-trend-line-outcome'));//支出
		//$scope.income_trend_chart = echarts.init(document.getElementById('charts-trend-line-income'));//收入
		
		//查询
		$scope.query = function(){
			$scope.outcome_trend_chart.clear();$scope.income_trend_chart.clear();//$scope.inout_trend_chart.clear();
			$scope.outcome_trend_chart_options = $rootScope.clone($rootScope.line_options);//待装载的数据
			$scope.income_trend_chart_options = $rootScope.clone($rootScope.line_options);//待装载的数据
			$scope.inout_trend_chart_options = $rootScope.clone($rootScope.line_options);

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
			$scope.outcome_trend_chart_options.title.text = "支出趋势图";
			$scope.outcome_trend_chart_options.legend.data = ['支出'];
			$scope.outcome_trend_chart_options.xAxis[0].data = [];
			$scope.outcome_trend_chart_options.series[0] = {};
			$scope.outcome_trend_chart_options.series[0].name = '支出';
			$scope.outcome_trend_chart_options.series[0].type = 'line';
			$scope.outcome_trend_chart_options.series[0].data = [];

			$scope.income_trend_chart_options.title.text = "收入趋势图";
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
						$scope.outcome_trend_chart_options.xAxis[0].data.push(res.outcome_bills[i].bill_time);
						$scope.outcome_trend_chart_options.series[0].data.push(res.outcome_bills[i].bill_sum);
					}
					for(var j=0;j<res.income_bills.length;j++){
						$scope.income_trend_chart_options.xAxis[0].data.push(res.income_bills[j].bill_time);
						$scope.income_trend_chart_options.series[0].data.push(res.income_bills[j].bill_sum);
					}

					if(!i&&!j)$scope.charts_trend_tip = '<i class="uk-icon-warning"></i> 未查到相关信息！';
					else $scope.charts_trend_tip = '';
					

					$scope.outcome_trend_chart.setOption($scope.outcome_trend_chart_options); 
					$scope.income_trend_chart.setOption($scope.income_trend_chart_options); 
				}else hMessage(res.msg);
			});
		}

		$scope.query();
	});
});
//资产分布图+负债分布图
note.controller('c_property_distribute',function($scope,$rootScope,$http,Charts,$state){
	//初始化图表
	$scope.end_date = $rootScope.edate;
	$scope.charts_property_distribute_tip = '<i class="uk-icon-warning"></i> 请输入查询条件查询！';

	//初始化图表
	require(['echarts','echarts/chart/pie'],function(ec){
		$scope.property_distribute_chart = ec.init(document.getElementById('charts-property-distribute-pie'));//
		$scope.liabilities_distribute_chart = ec.init(document.getElementById('charts-liabilities-distribute-pie'));//负债
		//$scope.property_distribute_chart = echarts.init(document.getElementById('charts-property-distribute-pie'));//
		//$scope.liabilities_distribute_chart = echarts.init(document.getElementById('charts-liabilities-distribute-pie'));//负债
		
		//查询
		$scope.query = function(){
			$scope.property_distribute_chart.clear();$scope.liabilities_distribute_chart.clear();
			$scope.property_distribute_chart_options = $rootScope.clone($rootScope.pie_options);//待装载的数据
			$scope.liabilities_distribute_chart_options = $rootScope.clone($rootScope.pie_options);//负债

			$scope.property_distribute_chart_options.title.text = "资产分布图";
			$scope.liabilities_distribute_chart_options.title.text = "负债分布图";
			
			$scope.property_distribute_chart_options.legend.data = [];
			$scope.property_distribute_chart_options.series[0] = {};
			$scope.property_distribute_chart_options.series[0].name = '账户资产';
			$scope.property_distribute_chart_options.series[0].type = 'pie';
			$scope.property_distribute_chart_options.series[0].data = [];
			
			//负债资产部分
			$scope.liabilities_distribute_chart_options.legend.data = [];
			$scope.liabilities_distribute_chart_options.series[0] = {};
			$scope.liabilities_distribute_chart_options.series[0].name = '账户负债';
			$scope.liabilities_distribute_chart_options.series[0].type = 'pie';
			$scope.liabilities_distribute_chart_options.series[0].data = [];
			
			//获取数据
			var cdt = {'end_date':$scope.end_date};
			Charts.getPropertyDistributeData(cdt).success(function(res){
				console.log(res);
				if(res.error === 0){
					var count1 = count2 = 0;
					for(var i=0,ilen=res.account_items.length;i<ilen;i++){
						for(var j=0,jlen=res.account_items[i].child_accounts.length;j<jlen;j++){
							var balance = parseInt(res.account_items[i].child_accounts[j].child_account_balance)+res.account_items[i].child_accounts[j].flow_in-res.account_items[i].child_accounts[j].flow_out;
							console.log('balance:'+balance);
							var name = res.account_items[i].child_accounts[j].child_account_name;
							if(balance > 0){
								$scope.property_distribute_chart_options.legend.data[count1++] = name;
								$scope.property_distribute_chart_options.series[0].data.push({value:Math.abs(balance),name:name});
							}else if(balance < 0){//负债
								$scope.liabilities_distribute_chart_options.legend.data[count2++] = name;
								$scope.liabilities_distribute_chart_options.series[0].data.push({value:Math.abs(balance),name:name});
							}
						}
					}
					if(!i)$scope.charts_property_distribute_tip = '<i class="uk-icon-warning"></i> 未查到相关信息！';
					else $scope.charts_property_distribute_tip = '';

					$scope.property_distribute_chart.setOption($scope.property_distribute_chart_options); 
					$scope.liabilities_distribute_chart.setOption($scope.liabilities_distribute_chart_options); 

				}else hMessage(res.msg);
			});
		}

		$scope.query();
	});
});
//资产趋势图
note.controller('c_property_trend',function($scope,$rootScope,$http,Charts,$state){
	//初始化图表
	$scope.end_date = $rootScope.edate;
	$scope.charts_property_trend_tip = '<i class="uk-icon-warning"></i> 请输入查询条件查询！';

	//初始化图表
	require(['echarts','echarts/chart/line'],function(ec){
		$scope.property_trend_chart = ec.init(document.getElementById('charts-property-trend-line'));//支出
		//$scope.property_trend_chart = echarts.init(document.getElementById('charts-property-trend-line'));//支出
		
		//查询
		$scope.query = function(){

			$scope.charts_property_trend_tip = '<i class="uk-icon-spinner"></i> 正在获取数据...';

			$scope.property_trend_chart.clear();
			$scope.property_trend_chart_options = $rootScope.clone($rootScope.line_options);//待装载的数据

			$scope.property_trend_chart_options.title.text = "资产趋势图";
			$scope.property_trend_chart_options.title.subtext = "单位:月";
			//有三条线，总资产，负债资产，净资产
			$scope.property_trend_chart_options.legend.data = ['总资产','负债资产','净资产'];
			$scope.property_trend_chart_options.xAxis[0].data = [];

			$scope.property_trend_chart_options.series[0] = {};
			$scope.property_trend_chart_options.series[0].name = '总资产';
			$scope.property_trend_chart_options.series[0].type = 'line';
			$scope.property_trend_chart_options.series[0].data = [];
			$scope.property_trend_chart_options.series[1] = {};
			$scope.property_trend_chart_options.series[1].name = '负债资产';
			$scope.property_trend_chart_options.series[1].type = 'line';
			$scope.property_trend_chart_options.series[1].data = [];
			$scope.property_trend_chart_options.series[2] = {};
			$scope.property_trend_chart_options.series[2].name = '净资产';
			$scope.property_trend_chart_options.series[2].type = 'line';
			$scope.property_trend_chart_options.series[2].data = [];
			
			var cdt = {'end_date':$scope.end_date};
			Charts.getPropertyTrendData(cdt).success(function(res){
				console.log(res);
				if(res.error === 0){
					for(var i=res.datas.length-1;i>=0;i--){
						var net_asset = liabilities = property = 0;
						for(var j=0,jlen=res.datas[i].length;j<jlen;j++){
							var balance = parseInt(res.datas[i][j].account_balance)+res.datas[i][j].flow_in-res.datas[i][j].flow_out;
							if(balance > 0)//总资产
								property += parseInt(balance);
							else if(balance < 0)liabilities += balance;
						}
						net_asset = (property+liabilities);
						
						$scope.property_trend_chart_options.series[0].data.push(property);
						$scope.property_trend_chart_options.series[1].data.push(liabilities);//负债资产
						$scope.property_trend_chart_options.series[2].data.push(net_asset);//净资产
						$scope.property_trend_chart_options.xAxis[0].data.push(res.dates[i].slice(0,res.dates[i].lastIndexOf('-')));
					}
					
					$scope.charts_property_trend_tip = '';
					$scope.property_trend_chart.setOption($scope.property_trend_chart_options);
				}else ;
			});
			
		}

		$scope.query();
	});
});
//本月预算图
note.controller('c_chart_budget',function($scope,$rootScope,$http,Charts,$state){
	$scope.budget_num = null;
	$scope.budget = {budget_num:0,outcome_num:0,budget_id:null};
	$scope.modified_budget_num = 0;
	$scope.proportion = 0;
	$scope.charts_budget_tip = "";

	$scope.updateBudget =  function(){
		$scope.charts_budget_tip = '<i class="uk-icon-spinner"></i> 正在获取数据...';
		//获取数据
		Charts.getBudgetData().success(function(res){
			console.log(res);
			if(res.error === 0){
				$scope.budget.budget_num = parseFloat(res.budget_num);
				$scope.budget.outcome_num = parseFloat(res.outcome_num);
				$scope.budget.budget_id = res.budget_id;
				$scope.proportion = $scope.budget.outcome_num*100/$scope.budget.budget_num;
				$scope.charts_budget_tip = "";
			}else $scope.charts_budget_tip = res.msg;
		}).error(function(data,state){
			console.log(data);
		});
	}

	$scope.updateBudget();
	//修改预算
	$scope.modifyBudget = function(){
		if($scope.modified_budget_num > 0){
			var cdt = {'budget_id':$scope.budget.budget_id,'budget_num':$scope.modified_budget_num}
			console.log(cdt);
			Charts.modifyBudget(cdt).success(function(res){
				console.log(res);
				if(res.error === 0){
					hMessage('修改成功！');
					//更新预算
					$scope.updateBudget();
				}else hMessage(res.msg);
			});
		}else hMessage("预算数目必须为正数！");
	}
});
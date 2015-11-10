//----------------------账单控制器-------------------------------
//|-+c_bill
//|---c_add_bill_modal
//|---+c_bill_details_modal
//|---|---c_modify_bill

//c_bill
m_index.controller('c_bill',function($scope,$rootScope,$state,$http,BillOutcomeCategory,BillIncomeCategory){
	//更新账户分类
	BillOutcomeCategory.updateBillOutcomeCategory();
	BillIncomeCategory.updateBillIncomeCategory();

	setTitle("随手记-记账");
	$rootScope.bill_operation_trigger = 0;//触发器变量
	$rootScope.current_operation = "add_bill";//当前操作
	$rootScope.account_items = $rootScope.child_accounts = $rootScope.bill_category_items = $rootScope.child_bill_categories = {};
	$rootScope.bill_tip_show = true;
	$rootScope.bill_tip = '今天还没有账单信息，快去记一笔吧！';
	//获取当日账单列表，bill_list
	$http.get(home_path+"/Bill/get_today_bills.html").success(function(res){
		console.log(res);
		if(res.error === 0){
			$rootScope.today_bills = res.bills;
			$rootScope.bill_tip_show = false;
		}
		else if(res.error === 2){//查询为空
			$rootScope.bill_tip_show = true;
		}
		else hMessage(res.msg);
	}).error(function(data,state){
		console.log(data);
	});
	//显示新增账单模态框
	$scope.showAddBillModal = function(){
		$rootScope.current_operation = "add_bill";//当前操作
		$rootScope.bill_operation_trigger = $rootScope.bill_operation_trigger==0?1:0;//触发
		var bill_modal = UIkit.modal("#add-bill-modal");
		bill_modal.show();
		$state.go('bill_outcome');
	}
	//显示账单详情模态框
	$scope.showBillDetail = function(index){
		$rootScope.current_bill = $rootScope.today_bills[index];//设置当前账单
		var bill_detail_modal = UIkit.modal("#bill-detail-modal");
		bill_detail_modal.show();
		$state.go('bill_details');
	}
});

//c_add_bill_modal
m_index.controller('c_add_bill_modal',function($scope,$rootScope,$state,$http,BillOutcomeCategory,BillIncomeCategory,Accounts){
	$scope.bill_category = {};
	$scope.current_bill_view = $scope.previous_view = 'outcome';
	//------------------------设置账单默认值----------------------------
	$scope.bill = {};
	$scope.bill.time = {};

	
	//监听触发变量,进而确定是新增还是修改账单
	$rootScope.$watch('bill_operation_trigger',function(newValue,oldValue){
		if($rootScope.current_operation == "modify_bill"){//修改操作
			console.log("触发器被触发了！");
			console.log("newValue:"+newValue+",oldValue:"+oldValue);
			console.log("当前是修改操作");

			$scope.bill_type = $rootScope.current_bill.bill_type==1?1:2;
			$scope.bill_type_text = $rootScope.current_bill.bill_type==1?'记账-支出':'记账-收入';
			console.log("bill_type:"+$scope.bill_type);

			//更新用户账单分类
			var type = $scope.bill_type==1?'outcome':'income';
			if(type == 'outcome'){
				BillOutcomeCategory.getBillOutcomeCategory(true).success(function(res){
					$rootScope.bill_category_items = res.bill_category_items;
					for(var i=0;i<$rootScope.bill_category_items.length;i++){
						if($rootScope.bill_category_items[i].bill_category.bill_category_id == $rootScope.current_bill.bill_category_id)break;
					}
					$rootScope.child_bill_categories = $rootScope.bill_category_items[i].child_bill_categories;
				});
			}else{
				BillIncomeCategory.getBillIncomeCategory(true).success(function(res){
					$rootScope.bill_category_items = res.bill_category_items;
					//$rootScope.child_bill_categories = $rootScope.bill_category_items[0].child_bill_categories;
					for(var i=0;i<$rootScope.bill_category_items.length;i++){
						if($rootScope.bill_category_items[i].bill_category.bill_category_id == $rootScope.current_bill.bill_category_id)break;
					}
					$rootScope.child_bill_categories = $rootScope.bill_category_items[i].child_bill_categories;
				});
			}
			
			$scope.bill.category = $rootScope.current_bill.bill_category_id;
			$scope.bill.child_category = $rootScope.current_bill.child_bill_category_id;
			console.log("category:"+$scope.bill.category+",child_category:"+$scope.bill.child_category)

			//时间
			$scope.hours = [];
			$scope.minutes = [];
			for(var i=0;i<24;i++)$scope.hours.push(i);
			for(var i=0;i<60;i++)$scope.minutes.push(i);
			$scope.bill.date = $rootScope.current_bill.bill_time.split(' ')[0];
			$scope.bill.time.hour = parseInt($rootScope.current_bill.bill_time.split(' ')[1].split(':')[0]);
			$scope.bill.time.minute = parseInt($rootScope.current_bill.bill_time.split(' ')[1].split(':')[1]);

			//更新账户分类
			for(var i=0;i<$rootScope.account_items.length;i++){
				if($rootScope.account_items[i].account.account_id == $rootScope.current_bill.account_id)break;
			}
			$rootScope.child_accounts = $rootScope.account_items[i].child_accounts;
			$scope.bill.account = $rootScope.current_bill.account_id;
			$scope.bill.child_account = $rootScope.current_bill.child_account_id;
			
			
			$scope.bill.location = $rootScope.current_bill.bill_location;
			$scope.bill.sum = parseFloat($rootScope.current_bill.bill_sum);
			$scope.bill.remarks = $rootScope.current_bill.bill_remarks;
			
		}else{//是新增操作

			console.log("当前是新增操作");
			//设置账单的类型
			$scope.bill_type = 1;//支出
			$scope.bill_type_text = '记账-支出';

			//获取账单分类(默认是支出分类)
			BillOutcomeCategory.getBillOutcomeCategory(true).success(function(res){
				$rootScope.bill_category_items = res.bill_category_items;
				$rootScope.child_bill_categories = $rootScope.bill_category_items[0].child_bill_categories;

				$scope.bill.category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
				$scope.bill.child_category = $rootScope.bill_category_items[0].child_bill_categories[0].child_bill_category_id;
			});
			//获取账户分类
			Accounts.getAccounts(true).success(function(res){
				console.log(res);
				$rootScope.account_items = res.account_items;
				$rootScope.child_accounts = $rootScope.account_items[0].child_accounts;

				$scope.bill.account = $rootScope.account_items[0].account.account_id;
				$scope.bill.child_account = $rootScope.account_items[0].child_accounts[0].child_account_id;
				//设置添加账户的默认值
				$scope.added_account = $rootScope.account_items[0].account.account_id;
				$scope.added_child_account_name = "";
				$scope.added_child_account_balance = $scope.added_child_account_remarks = "";
			});

			
			//设置账单默认的时间
			var date = new Date();
			//设置账单默认时间
			$scope.bill.date = date.getFullYear()+"-"+(parseInt(date.getMonth())+1)+"-"+date.getDate();
			$scope.bill.time.hour = parseInt(date.getHours());
			$scope.bill.time.minute = parseInt(date.getMinutes());
			$scope.hours = [];
			$scope.minutes = [];
			for(var i=0;i<parseInt($scope.bill.time.hour)+1;i++)$scope.hours.push(i);
			console.log($scope.hours);
			for(var i=0;i<parseInt($scope.bill.time.minute)+1;i++)$scope.minutes.push(i);
			//其它值恢复默认
			$scope.bill.location = $scope.bill.sum = $scope.bill.remarks = null;

			
		}
	});
	//---------------------监听账单变化-----------------------
	//监听账户选项变化
	$scope.billAccountTypeChange = function(){
		//遍历获取当前一级分类的数组下标
		var index = 0;
		for (var i=0; i<$rootScope.account_items.length; i++) {
			if($scope.bill.account == $rootScope.account_items[i].account.account_id){
				index = i;
				break;
			}
		};
		console.log("index:"+index);
		$rootScope.child_accounts = $rootScope.account_items[index].child_accounts;
		$scope.bill.child_account = $rootScope.child_accounts[0].child_account_id;
	}
	//监听分类选项变化
	$scope.billCategoryTypeChange = function(){
		//遍历获取当前一级分类的数组下标
		var index = 0;
		for (var i=0; i<$rootScope.bill_category_items.length; i++) {
			if($scope.bill.category == $rootScope.bill_category_items[i].bill_category.bill_category_id){
				index = i;
				break;
			}
		};
		console.log("index:"+index);
		$rootScope.child_bill_categories = $rootScope.bill_category_items[index].child_bill_categories;
		$scope.bill.child_category = $rootScope.child_bill_categories[0].child_bill_category_id;
	}

	//----------------------定位---------------------------
	$scope.location_options_show = false;//是否显示建议选项
	//点击模态框建议选项消失
	$scope.add_bill_modal_click = function(){$scope.location_options_show = false;}
	var url = "http://api.map.baidu.com/location/ip?ak="+baidu_ak+"&callback=JSON_CALLBACK";
	var city_code = 131;//默认城市编码
	//获取城市码
	$http.jsonp(url).success(function(res){
		city_code = res.content.address_detail.city_code;
	});	
	//监听input内容
	$scope.location_options = [];
	var baidu_suggestion_api_url = "http://api.map.baidu.com/place/v2/suggestion";
	$scope.locationInputChange = function(){
		var url = baidu_suggestion_api_url+"?query="+$scope.bill.location+"&region="+city_code+"&ak="+baidu_ak+"&output=json&callback=JSON_CALLBACK";
		$http.jsonp(url).success(function(res){
			if(res.status == 0){
				$scope.location_options_show = true;//显示建议选项
				$scope.location_options = res.result;
			}else{console.log("获取位置列表失败！");}
		});
	}
	//选择某个建议项后将账单位置设为该位置，隐藏建议选项
	$scope.selectLocation = function(location){
		$scope.bill.location = location;
		$scope.location_options_show = false;
	}

	//---------------------添加账单-------------------
	$scope.addBill = function(){
		var data = [$scope.bill_type,$scope.bill.category,$scope.bill.child_category,$scope.bill.account,$scope.bill.child_account,$scope.bill.date+" "+
		$scope.bill.time.hour+":"+$scope.bill.time.minute,$scope.bill.location,$scope.bill.sum,$scope.bill.remarks];
		if($scope.bill.sum < 0){hMessage("金额不能为负！");return;}
		console.log(data);
		$http({
          method:'POST',
          url:home_path+"/Bill/add_bill.html",
          data:{'bill_type':$scope.bill_type,'bill_category_id':$scope.bill.child_category,'bill_account_id':$scope.bill.child_account,
          'bill_time':$scope.bill.date+" "+$scope.bill.time.hour+":"+$scope.bill.time.minute,'bill_location':$scope.bill.location,
          'bill_sum':$scope.bill.sum,'bill_remarks':$scope.bill.remarks}
        }).success(function(res){
        	console.log(res);
			if(res.error === 0){
				var bill_modal = UIkit.modal("#add-bill-modal");
				if ( bill_modal.isActive() ) {
				    bill_modal.hide();
				}
				hMessage("账单添加成功！",2000);
				//更新今日账单列表
				//获取当日账单列表，bill_list
				$http.get(home_path+"/Bill/get_today_bills.html").success(function(res){
					if(res.error === 0){
						$rootScope.today_bills = res.bills;
						$rootScope.bill_tip_show = false;
					}
					else if(res.error === 2){//查询为空
						$rootScope.bill_tip_show = true;
						$rootScope.bill_tip = '今天还没有账单信息，快去记一笔吧！';
					}
					else console.log(res.msg);
				}).error(function(data,state){
					console.log(data);
				});
			}
			else hMessage(res.msg,2000);
		});
	}
	//------------------修改账单-------------------------
	$scope.modifyBill = function(){
		if($rootScope.current_operation == 'modify_bill'){
			if($scope.bill.sum < 0){hMessage("金额不能为负！");return;}
			$http({
	          method:'POST',
	          url:home_path+"/Bill/modify_bill.html",
	          data:{'bill_id':$rootScope.current_bill.bill_id,'bill_type':$scope.bill_type,'bill_category_id':$scope.bill.child_category,
	          'bill_account_id':$scope.bill.child_account,
	          'bill_time':$scope.bill.date+" "+$scope.bill.time.hour+":"+$scope.bill.time.minute,'bill_location':$scope.bill.location,
	          'bill_sum':$scope.bill.sum,'bill_remarks':$scope.bill.remarks}
	        }).success(function(res){
	        	console.log(res);
				if(res.error === 0){
					var bill_modal = UIkit.modal("#add-bill-modal");
					bill_modal.hide();
					hMessage("账单修改成功！",2000);
					//更新今日账单列表
					//获取当日账单列表，bill_list
					$http.get(home_path+"/Bill/get_today_bills.html").success(function(res){
						if(res.error === 0){
							$rootScope.today_bills = res.bills;
							$rootScope.bill_tip_show = false;
						}
						else if(res.error === 2){//查询为空
							$rootScope.bill_tip_show = true;
							$rootScope.bill_tip = '今天还没有账单信息，快去记一笔吧！';
						}
						else console.log(res.msg);
					}).error(function(data,state){
						console.log(data);
					});
				}
				else hMessage(res.msg,2000);
			});
		}
	}
	//------------------切换账单类型----------------------
	$scope.switchBillType = function(){
		//重置账户选项
		$rootScope.child_accounts = $rootScope.account_items[0].child_accounts;
		$scope.bill.account = $rootScope.account_items[0].account.account_id;
		$scope.bill.child_account = $rootScope.child_accounts[0].child_account_id;
		//更新并重置账单分类选项
		if($scope.current_bill_view == 'outcome'){
			//获取账单分类
			BillIncomeCategory.getBillIncomeCategory(true).success(function(res){
				$rootScope.bill_category_items = res.bill_category_items;
				$rootScope.child_bill_categories = $rootScope.bill_category_items[0].child_bill_categories;

				$scope.bill.category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
				$scope.bill.child_category = $rootScope.bill_category_items[0].child_bill_categories[0].child_bill_category_id;
			});
			$scope.bill_type = 2;
			$state.go('bill_income');
			$scope.current_bill_view = $scope.previous_view = 'income';
			$scope.bill_type_text = '记账-收入';
		}
		else {
			//获取账单分类
			BillOutcomeCategory.getBillOutcomeCategory(true).success(function(res){
				$rootScope.bill_category_items = res.bill_category_items;
				$rootScope.child_bill_categories = $rootScope.bill_category_items[0].child_bill_categories;

				$scope.bill.category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
				$scope.bill.child_category = $rootScope.bill_category_items[0].child_bill_categories[0].child_bill_category_id;
			});
			$scope.bill_type = 1;
			$state.go('bill_outcome');
			$scope.current_bill_view = $scope.previous_view = 'outcome';
			$scope.bill_type_text = '记账-支出';
		}
	}
	//-----------------返回账单详情--------------------------------
	$scope.backToDetail = function(){
		$state.go('bill_details');
		var bill_detail_modal = UIkit.modal("#bill-detail-modal");
		bill_detail_modal.show();
	}
	//------------------添加账单分类------------------------------------
	$scope.showAddCategory = function(previous_view){
		$scope.ifAddSelfCategory = false;
		$scope.previous_view = previous_view;
		$scope.add_self_category_btn_icon = '<i class="uk-icon-toggle-off uk-icon-medium"></i>';
		if(previous_view == 'outcome')
			$scope.add_category_title = "支出";
		else $scope.add_category_title = "收入";
		//console.log($rootScope.bill_category_items);
		$scope.bill_category.bill_category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
		$state.go('add_category');
	}
	//添加自定义一级分类
	$scope.switchAddSelfCategory = function(){
		$scope.ifAddSelfCategory = $scope.ifAddSelfCategory?false:true;
		if($scope.ifAddSelfCategory){
			$scope.bill_category.bill_category = "";
			$scope.add_self_category_btn_icon = '<i class="uk-icon-toggle-on uk-icon-medium"></i>';
		}
		else{
			$scope.bill_category.bill_category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
			$scope.add_self_category_btn_icon = '<i class="uk-icon-toggle-off uk-icon-medium"></i>';
		}
	}
	//提交添加分类
	$scope.addCategory = function(){
		var bill_type = $scope.previous_view == 'outcome'?1:2;
		var is_self_defined = $scope.ifAddSelfCategory?"1":"0";
		$http({
          method:'POST',
          url:home_path+"/Bill/add_bill_category.html",
          data:{'is_self_defined':is_self_defined,'bill_type':bill_type,
          'bill_category':$scope.bill_category.bill_category,'child_bill_category':$scope.bill_category.child_bill_category}
        }).success(function(res){
        	console.log(res);
			if(res.error === 0){
				hMessage("添加分类成功！",2000);
				//刷新一下分类信息
				//获取用户账单分类-默认outcome支出
				if($scope.previous_view == 'outcome'){
					$rootScope.bill_category_items = BillOutcomeCategory.getBillOutcomeCategory(true).success(function(res){
						$rootScope.bill_category_items = res.bill_category_items;
						$rootScope.child_bill_categories = $rootScope.bill_category_items[0].child_bill_categories;
						$scope.bill_category.bill_category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
						$scope.bill.category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
						$scope.bill.child_category = $rootScope.bill_category_items[0].child_bill_categories[0].child_bill_category_id;
					});
				}else{
					$rootScope.bill_category_items = BillIncomeCategory.getBillIncomeCategory(true).success(function(res){
						$rootScope.bill_category_items = res.bill_category_items;
						$rootScope.child_bill_categories = $rootScope.bill_category_items[0].child_bill_categories;
						$scope.bill_category.bill_category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
						$scope.bill.category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
						$scope.bill.child_category = $rootScope.bill_category_items[0].child_bill_categories[0].child_bill_category_id;
					});
				}
			}
			else hMessage(res.msg,2000);
		});
	}
	//------------------添加账户------------------------
	

	$scope.showAddAccount = function(){
		$scope.add_self_account_btn_icon = '<i class="uk-icon-toggle-off uk-icon-medium"></i>';
		$scope.ifAddSelfAccount = false;
		
		$state.go('add_account');
	}
	//添加自定义类型
	$scope.addSelfAccount = function(){
		$scope.ifAddSelfAccount = $scope.ifAddSelfAccount?false:true;
		if($scope.ifAddSelfAccount){
			$scope.added_account = "";
			$scope.add_self_account_btn_icon = '<i class="uk-icon-toggle-on uk-icon-medium"></i>';
		}
		else{
			$scope.added_account = $rootScope.account_items[0].account.account_id;
			$scope.add_self_account_btn_icon = '<i class="uk-icon-toggle-off uk-icon-medium"></i>';
		}
	}
	//提交添加账户
	$scope.addAccount = function(){
		var is_self_defined = $scope.ifAddSelfAccount?"1":"0";
		var data = {'is_self_defined':is_self_defined,'account':$scope.added_account,'child_account_name':$scope.added_child_account_name,
			'child_account_balance':$scope.added_child_account_balance,'child_account_remarks':$scope.added_child_account_remarks};
		console.log(data);
		/*$http({
			method:'POST',
			url:home_path+"/Account/add_account.html",
			data:{'is_self_defined':is_self_defined,'account':$scope.added_account,'child_account_name':$scope.added_child_account_name,
			'child_account_balance':$scope.added_child_account_balance,'child_account_remarks':$scope.added_child_account_remarks}
		}).success(function(res){
			if(res.error === 0){
				//刷新账户分类信息
				Accounts.getAccounts(true).success(function(res){
					$rootScope.account_items = res.account_items;
					$rootScope.child_accounts = $rootScope.account_items[0].child_accounts;
					$scope.added_account = $rootScope.account_items[0].account.account_id;
					$scope.bill.account = $rootScope.account_items[0].account.account_id;
					$scope.bill.child_account = $rootScope.account_items[0].child_accounts[0].child_account_id;
				});
				hMessage("添加成功！");
			}
		});*/
	}
	$scope.backward = function(){
		$state.go('bill_'+$scope.previous_view);
	}
});
//c_bill_details_modal
m_index.controller('c_bill_details_modal',function($scope,$rootScope,$state,$http){
	$scope.deleteBill = function(){//删除账单
		var bill_id = arguments[0] == null ? $rootScope.current_bill.bill_id:arguments[0];//如果有带参数
		if(confirm('你确定要删除该账单['+bill_id+']？本操作不可撤销！')){
			$http({
	          method:'POST',
	          url:home_path+"/Bill/delete_bill.html",
	          data:{'bill_id':bill_id}
	        }).success(function(res){
	        	console.log(res);
				if(res.error === 0){
					var bill_detail_modal = UIkit.modal("#bill-detail-modal");
					bill_detail_modal.hide();
					hMessage("账单删除成功！",2000);
					$("#bill_"+bill_id).remove();
				}
				else hMessage(res.msg,2000);
			});
		}else return;
	}
	$scope.modifyBill = function(){//修改账单
		$state.go('bill_outcome');
		var bill_modal = UIkit.modal("#add-bill-modal");
		bill_modal.show();
		$rootScope.current_operation = "modify_bill";
		$rootScope.bill_operation_trigger = $rootScope.bill_operation_trigger==0?1:0;//触发器
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
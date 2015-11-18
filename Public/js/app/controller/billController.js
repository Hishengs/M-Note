//----------------------账单控制器-------------------------------
//账单 c_bill
note.controller('c_bill',function($scope,$rootScope,$state){
	//默认设置
	setTitle("随手记-记账");
	$rootScope.bill_operation_trigger = 0;//触发器变量
	$rootScope.current_operation = "add_bill";//当前操作
	$rootScope.account_items = $rootScope.child_accounts = $rootScope.bill_category_items = $rootScope.child_bill_categories = {};
	//默认的state
	$state.go("today_bills");
	//模板路径
	$rootScope.templates = {};
	//$scope.templates.templates_path = templates_path;
	$rootScope.templates.bill = templates_path+"/bill";
	$rootScope.templates.bill_add = $rootScope.templates.bill+"/bill_add_outcome.html";//添加账单的模板路径
	$rootScope.templates.bill_view = $rootScope.templates.bill+"/bill_details.html";//查看账单的模板路径
	$rootScope.templates.add_category = $rootScope.templates.bill+"/add_category.html";//添加分类
	$rootScope.templates.add_account = $rootScope.templates.bill+"/add_account.html";//添加账户
	//tab选项切换
	$scope.current_bill_tab = "today_bills"; //当前tab选项
	$scope.switchBillTab = function(tab){
		$scope.current_bill_tab = tab;
		$state.go(tab);
	}
});
//c_today_bills 今日账单
note.controller('c_today_bills',function($scope,$rootScope,$state,$http,Bill){
	$rootScope.bill_tip_show = true;
	$rootScope.bill_tip = '今天还没有账单信息，快去记一笔吧！';
	//获取当日账单列表，bill_list
	Bill.getTodayBills().success(function(res){
		if(res.error === 0){
			$rootScope.bills = res.bills;
			$rootScope.bill_tip_show = false;
		}
		else if(res.error === 2){//查询为空
			$rootScope.bills = {};
			$rootScope.bill_tip_show = true;
		}
		else hMessage(res.msg);
	}).error(function(data,state){
		console.log(data);
	});
	//显示新增账单template
	$scope.vAddBill = function(){
		$rootScope.templates.bill_add = $rootScope.templates.bill+"/bill_add_outcome.html";
		$rootScope.current_operation = "add_bill";//当前操作
		$rootScope.bill_operation_trigger = $rootScope.bill_operation_trigger==0?1:0;//触发
		//显示modal
		var add_bill_modal = UIkit.modal("#add-bill-modal");
		add_bill_modal.show();
		//$state.go('bill_add_outcome');//默认是支出
	}
	//显示账单详情模态框
	$scope.showBillDetail = function(index){
		$rootScope.current_bill = $rootScope.bills[index];//设置当前账单
		var bill_detail_modal = UIkit.modal("#bill-detail-modal");
		bill_detail_modal.show();
		//$state.go('bill_details',{billId:$rootScope.current_bill.bill_id});
	}
});

//c_add_bill_modal 添加账单的模态框
note.controller('c_bill_add',function($scope,$rootScope,$state,$http,$timeout,Bill,Account){
	
	$scope.bill_category = {};
	$scope.current_bill_view = $rootScope.previous_view = 'outcome';
	//------------------------设置账单默认值----------------------------
	$scope.bill = {};
	$scope.bill.time = {};

	//监听日期变化来更改时间
	$scope.$watch('bill.date',function(newValue,oldValue){
		$scope.hours = [];
		$scope.minutes = [];
		//是否是当天
		var today = new Date().getDate();
		var bill_date = new Date(newValue).getDate();
		console.log("bill_date:"+bill_date);
		if(today == bill_date){
			//时间设为当前之间之前
			for(var i=0;i<parseInt(new Date().getHours())+1;i++)$scope.hours.push(i);
			for(var i=0;i<parseInt(new Date().getMinutes())+1;i++)$scope.minutes.push(i);
		}else{
			for(var i=0;i<24;i++)$scope.hours.push(i);
			for(var i=0;i<60;i++)$scope.minutes.push(i);
		}
		$scope.bill.time.hour = parseInt(new Date().getHours());
		$scope.bill.time.minute = parseInt(new Date().getMinutes());
	});

	//获取账户分类
	Account.getAccountInfo().success(function(res){
		console.log(res);
		$rootScope.account_items = res.account_items;
		$rootScope.child_accounts = $rootScope.account_items[0].child_accounts;

		$scope.bill.account = $rootScope.account_items[0].account.account_id;
		$scope.bill.child_account = $rootScope.account_items[0].child_accounts[0].child_account_id;
		
	});

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
				Bill.getCategoryInfo(1).success(function(res){
					console.log(res);
					$rootScope.bill_category_items = res.bill_category_items;
					for(var i=0;i<$rootScope.bill_category_items.length;i++){
						if($rootScope.bill_category_items[i].bill_category.bill_category_id == $rootScope.current_bill.bill_category_id)break;
					}
					$rootScope.child_bill_categories = $rootScope.bill_category_items[i].child_bill_categories;
				});
			}else{
				Bill.getCategoryInfo(2).success(function(res){
					console.log(res);
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
			Bill.getCategoryInfo(1).success(function(res){
				$rootScope.bill_category_items = res.bill_category_items;
				$rootScope.child_bill_categories = $rootScope.bill_category_items[0].child_bill_categories;

				$scope.bill.category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
				$scope.bill.child_category = $rootScope.bill_category_items[0].child_bill_categories[0].child_bill_category_id;
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
		var bill = {'bill_type':$scope.bill_type,'bill_category_id':$scope.bill.child_category,'bill_account_id':$scope.bill.child_account,
          'bill_time':$scope.bill.date+" "+$scope.bill.time.hour+":"+$scope.bill.time.minute,'bill_location':$scope.bill.location,
          'bill_sum':$scope.bill.sum,'bill_remarks':$scope.bill.remarks};

		if($scope.bill.sum < 0){hMessage("金额不能为负！");return;}
		console.log(bill);

		Bill.add(bill).success(function(res){
        	console.log(res);
			if(res.error === 0){
				var bill_modal = UIkit.modal("#add-bill-modal");
				if ( bill_modal.isActive() ) {
				    bill_modal.hide();
				}
				hMessage("账单添加成功！",2000);
				//把新增加的账单push到bills
				Bill.getBillById(res.bill.bill_id).success(function(result){
					if(result.error === 0){
						$rootScope.bills.push(result.bill);
					}else hMessage(result.msg);
				});
			}
			else hMessage(res.msg,2000);
		});
	}
	//------------------修改账单-------------------------
	$scope.modifyBill = function(){
		if($rootScope.current_operation == 'modify_bill'){
			var bill = {'bill_id':$rootScope.current_bill.bill_id,'bill_type':$scope.bill_type,'bill_category_id':$scope.bill.child_category,
	          'bill_account_id':$scope.bill.child_account,
	          'bill_time':$scope.bill.date+" "+$scope.bill.time.hour+":"+$scope.bill.time.minute,'bill_location':$scope.bill.location,
	          'bill_sum':$scope.bill.sum,'bill_remarks':$scope.bill.remarks};

			if($scope.bill.sum < 0){hMessage("金额不能为负！");return;}

			Bill.modify(bill).success(function(res){
	        	console.log(res);
				if(res.error === 0){
					var bill_modal = UIkit.modal("#add-bill-modal");
					bill_modal.hide();
					hMessage("账单修改成功！",2000);
					//其实只需要更新修改的那条账单就行，不用全部更新
					for(var i=0;i<$rootScope.bills.length;i++){
						if($rootScope.bills[i].bill_id == $rootScope.current_bill.bill_id){
							//更新
							Bill.getBillById($rootScope.current_bill.bill_id).success(function(res){
								if(res.error === 0){
									$rootScope.bills[i] = res.bill;
								}else hMessage(res.msg);
							});
							break;
						}
					}
				}
				else hMessage(res.msg,2000);
			});
		}
	}
	//------------------切换账单类型----------------------
	$scope.bill_type_switch_tip_show = false;
	$scope.switchBillType = function(){
		if($rootScope.current_operation == 'modify_bill'){
			$scope.bill_type_switch_tip_show = true;
			$scope.bill_type_switch_tip = '切换类型后账单<b>类别</b>可能需要修改！';
			$timeout(function(){$scope.bill_type_switch_tip_show = false;},4000);//2秒后提示消失
		}
		
		//重置账户选项
		$rootScope.child_accounts = $rootScope.account_items[0].child_accounts;
		$scope.bill.account = $rootScope.account_items[0].account.account_id;
		$scope.bill.child_account = $rootScope.child_accounts[0].child_account_id;
		//更新并重置账单分类选项
		if($scope.current_bill_view == 'outcome'){
			//获取账单分类
			Bill.getCategoryInfo(2).success(function(res){
				$rootScope.bill_category_items = res.bill_category_items;
				$rootScope.child_bill_categories = $rootScope.bill_category_items[0].child_bill_categories;

				$scope.bill.category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
				$scope.bill.child_category = $rootScope.bill_category_items[0].child_bill_categories[0].child_bill_category_id;
			});
			$scope.bill_type = 2;
			//$state.go('bill_add_income');
			$rootScope.templates.bill_add = $rootScope.templates.bill+"/bill_add_income.html";
			$scope.current_bill_view = $rootScope.previous_view = 'income';
			$scope.bill_type_text = '记账-收入';
		}
		else {
			//获取账单分类
			Bill.getCategoryInfo(1).success(function(res){
				$rootScope.bill_category_items = res.bill_category_items;
				$rootScope.child_bill_categories = $rootScope.bill_category_items[0].child_bill_categories;

				$scope.bill.category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
				$scope.bill.child_category = $rootScope.bill_category_items[0].child_bill_categories[0].child_bill_category_id;
			});
			$scope.bill_type = 1;
			//$state.go('bill_add_outcome');
			$rootScope.templates.bill_add = $rootScope.templates.bill+"/bill_add_outcome.html";
			$scope.current_bill_view = $rootScope.previous_view = 'outcome';
			$scope.bill_type_text = '记账-支出';
		}
	}
	//-----------------返回账单详情--------------------------------
	$scope.backToDetail = function(){
		var bill_detail_modal = UIkit.modal("#bill-detail-modal");
		bill_detail_modal.show();
		//$state.go('bill_details');
		$rootScope.templates.bill_add = $rootScope.templates.bill+"/bill_details.html";
	}
	//------------------添加账单分类------------------------------------
	$scope.vAddCategory = function(previous_view){
		$rootScope.previous_view = previous_view;
		//$state.go('add_category');
		$rootScope.templates.bill_add = $rootScope.templates.add_category;
	}
	//------------------添加账户------------------------
	$scope.vAddAccount = function(){
		//$state.go('add_account');
		$rootScope.templates.bill_add = $rootScope.templates.add_account;
	}
});
//添加账单分类
note.controller('c_add_bill_category',function($scope,$rootScope,$state,$http,Bill){
	//默认设置
	$scope.ifAddSelfCategory = false;
	$scope.add_self_category_btn_icon = '<i class="uk-icon-toggle-off uk-icon-medium"></i>';
	if($rootScope.previous_view == 'outcome')
		$scope.add_category_title = "支出";
	else $scope.add_category_title = "收入";
	$scope.bill_category.bill_category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
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
		var bill_type = $rootScope.previous_view == 'outcome'?1:2;
		var is_self_defined = $scope.ifAddSelfCategory?1:0;
		var categoryItem = {'is_self_defined':is_self_defined,'bill_type':bill_type,
          'bill_category':$scope.bill_category.bill_category,'child_bill_category':$scope.bill_category.child_bill_category};
		Bill.addCategory(categoryItem).success(function(res){
        	console.log(res);
			if(res.error === 0){
				hMessage("添加分类成功！",2000);
				//刷新一下分类信息
				//获取用户账单分类-默认outcome支出
				if($rootScope.previous_view == 'outcome'){
					$rootScope.bill_category_items = Bill.getCategoryInfo(1).success(function(res){
						$rootScope.bill_category_items = res.bill_category_items;
						$rootScope.child_bill_categories = $rootScope.bill_category_items[0].child_bill_categories;
						$scope.bill_category.bill_category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
						$scope.bill.category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
						$scope.bill.child_category = $rootScope.bill_category_items[0].child_bill_categories[0].child_bill_category_id;
					});
				}else{
					$rootScope.bill_category_items = Bill.getCategoryInfo(2).success(function(res){
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
	$scope.backward = function(){
		//$state.go('bill_add_'+$rootScope.previous_view);
		$rootScope.templates.bill_add = $rootScope.templates.bill + "/bill_add_"+$rootScope.previous_view+".html";
	}
});
//添加账户
note.controller('c_add_account',function($scope,$rootScope,$state,$http,Account){
	//设置添加账户的默认值
	$scope.added_account = $rootScope.account_items[0].account.account_id;
	$scope.added_child_account_name = "";
	$scope.added_child_account_balance = $scope.added_child_account_remarks = "";
	$scope.add_self_account_btn_icon = '<i class="uk-icon-toggle-off uk-icon-medium"></i>';
	$scope.ifAddSelfAccount = false;
	
	//添加自定义类型
	$scope.switchSelfAccount = function(){
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
		var is_self_defined = $scope.ifAddSelfAccount?1:0;
		var data = {'is_self_defined':is_self_defined,'account':$scope.added_account,'child_account_name':$scope.added_child_account_name,
			'child_account_balance':$scope.added_child_account_balance,'child_account_remarks':$scope.added_child_account_remarks};
		console.log(data);
		$http({
			method:'POST',
			url:home_path+"/Account/add_account.html",
			data:{'is_self_defined':is_self_defined,'account':$scope.added_account,'child_account_name':$scope.added_child_account_name,
			'child_account_balance':$scope.added_child_account_balance,'child_account_remarks':$scope.added_child_account_remarks}
		}).success(function(res){
			if(res.error === 0){
				//刷新账户分类信息
				Account.getAccountInfo().success(function(res){
					$rootScope.account_items = res.account_items;
					$rootScope.child_accounts = $rootScope.account_items[0].child_accounts;
					$scope.added_account = $rootScope.account_items[0].account.account_id;
					$scope.bill.account = $rootScope.account_items[0].account.account_id;
					$scope.bill.child_account = $rootScope.account_items[0].child_accounts[0].child_account_id;
				});
				hMessage("添加成功！");
			}
		});
	}
	$scope.backward = function(){
		//$state.go('bill_add_'+$rootScope.previous_view);
		$rootScope.templates.bill_add = $rootScope.templates.bill + "/bill_add_"+$rootScope.previous_view+".html";
	}
});

//c_bill_details  查看账单详情
note.controller('c_bill_details',function($scope,$rootScope,$state,$http,Bill){
	//删除账单
	$scope.deleteBill = function(){
		var bill_id = arguments[0] == null ? $rootScope.current_bill.bill_id:arguments[0];//如果有带参数
		if(confirm('你确定要删除该账单['+bill_id+']？本操作不可撤销！')){
			Bill.delete(bill_id).success(function(res){
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
	//修改账单
	$scope.vModifyBill = function(){
		var add_bill_modal = UIkit.modal("#add-bill-modal");
		add_bill_modal.show();
		//$state.go('bill_add_outcome');//默认是支出
		$rootScope.templates.bill_add = $rootScope.templates.bill + "/bill_add_outcome.html";
		$rootScope.current_operation = "modify_bill";
		$rootScope.bill_operation_trigger = $rootScope.bill_operation_trigger==0?1:0;//触发器
	}
});
//账单查询
note.controller('c_bill_query',function($scope,$rootScope,$state,Bill){
	$scope.bill_query_tip_show = false;
	$scope.bill_query_tip = "";
	$scope.bill_type = 3;
	$scope.start_date = $scope.end_date = null;
	$rootScope.bills = {};
	//查询
	$scope.query = function(){
		$scope.bill_query_tip_show = true;
		$scope.bill_query_tip = "<i class='uk-icon-spinner'></i> 拼命查询中...";
		var queryCdt = {'start_date':$scope.start_date,'end_date':$scope.end_date,'bill_type':$scope.bill_type};
		console.log(queryCdt);
		Bill.query(queryCdt).success(function(res){
			console.log(res);
			if(res.error === 0){
				$rootScope.bills = res.bills;
				if(!$rootScope.bills.length){
					$scope.bill_query_tip = "<i class='uk-icon-warning'></i> 查询不到符合条件的记录！";
				}
				else $scope.bill_query_tip_show = false;
			}else $scope.bill_query_tip = "<i class='uk-icon-warning'></i> "+res.msg;
		});
	}
	//查看账单
	$scope.billView = function(index){
		$rootScope.current_bill = $rootScope.bills[index];
		var bill_detail_modal = UIkit.modal("#bill-detail-modal");
		bill_detail_modal.show();
	}
});

//账单分类
note.controller('c_bill_category',function($scope,$rootScope,$state,Bill){
	$scope.bill_category_type = 1;
	$scope.bill_category_title = "支出分类";
	$scope.bill_category_items = {};
	$scope.is_self_defined = false;
	$scope.toggle_type = "off";
	$scope.added_bill_category = "";//待添加的一级分类
	$scope.added_child_bill_category = "";//待添加的二级分类
	$scope.current_bill_category = {};
	$scope.current_child_bill_category = {};//当前二级分类
	$scope.modified_bill_category = $scope.modified_child_bill_category_name = 
	$scope.modified_child_bill_category_balance = $scope.modified_child_bill_category_remarks = "";

	Bill.getCategoryInfo(1).success(function(res){
		if(res.error === 0){
			$scope.bill_category_items = res.bill_category_items;
			$scope.added_bill_category = $scope.bill_category_items[0].bill_category.bill_category_id;
		}
	});
	//切换分类
	$scope.switchCategoryType = function(){
		$scope.bill_category_type = $scope.bill_category_type==1?2:1;
		$scope.bill_category_title =  $scope.bill_category_title=="支出分类"?"收入分类":"支出分类";
		Bill.getCategoryInfo($scope.bill_category_type).success(function(res){
			if(res.error === 0){
				$scope.bill_category_items = res.bill_category_items;
				$scope.added_bill_category = $scope.bill_category_items[0].bill_category.bill_category_id;
			}
		});
	}
	//更新分类信息
	$scope.updateCategory = function(){
		Bill.getCategoryInfo($scope.bill_category_type).success(function(res){
			if(res.error === 0){
				$scope.bill_category_items = res.bill_category_items;
				$scope.added_bill_category = $scope.bill_category_items[0].bill_category.bill_category_id;
			}
		});
	}
	//添加分类
	$scope.vAddCategory = function(){
		UIkit.modal("#bill_category_add_modal").show();
	}
	//提交添加分类
	$scope.addCategory = function(){
		var is_self_defined = $scope.is_self_defined?1:0;
		var categoryItem = {'is_self_defined':is_self_defined,'bill_type':$scope.bill_category_type,'bill_category':$scope.added_bill_category,'child_bill_category':$scope.added_child_bill_category}
		console.log(categoryItem);
		Bill.addCategory(categoryItem).success(function(res){
			if(res.error === 0){
				//更新一下分类信息
				$scope.updateCategory();
				hMessage("添加分类成功！");
			}else hMessage(res.msg);
		});
	}
	$scope.switchAddSelfCategory = function(){
		if($scope.is_self_defined){
			$scope.toggle_type = "off";
			$scope.added_bill_category = $scope.bill_category_items[0].bill_category.bill_category_id;
		}
		else {
			$scope.toggle_type = "on";
			$scope.added_bill_category = "";
		}
		$scope.is_self_defined = $scope.is_self_defined?false:true;
	}
	
	//修改一级分类
	$scope.vModifyBillCategory = function(index){
		$scope.current_bill_category = $scope.bill_category_items[index].bill_category;
		UIkit.modal("#bill_category_modify_modal").show();
	}
	//提交修改
	$scope.modifyBillCategory = function(){
		console.log("修改一级分类：");
		console.log($scope.current_bill_category);
		Bill.modifyCategory($scope.current_bill_category.bill_category_id,$scope.current_bill_category.bill_category_name).success(function(res){
			console.log(res);
			if(res.error === 0){
				//更新一下分类信息
				$scope.updateCategory();
				hMessage("修改成功！");
			}else hMessage(res.msg);
		});
	}
	//删除一级分类
	$scope.deleteBillCategory = function(bill_category_id){
		if(confirm("你确定要删除该一级分类-"+bill_category_id+"(该分类下的所有二级分类和所有账单也将被删除！！)??")){
			Bill.deleteCategory(bill_category_id).success(function(res){
				if(res.error === 0){
					//更新一下分类信息
					$scope.updateCategory();
					hMessage("删除分类成功！");
				}else hMessage(res.msg);
			});
		}
	}
	//修改二级分类
	$scope.vModifyChildBillCategory = function(index){
		var current_child_bill_category_select = document.querySelector("#bill_category_item_"+index+" select");
		var current_child_bill_category_id = current_child_bill_category_select.options[current_child_bill_category_select.selectedIndex].value.split(":")[1];
		
		for(var i=0;i<$scope.bill_category_items[index].child_bill_categories.length;i++){
			if($scope.bill_category_items[index].child_bill_categories[i].child_bill_category_id == current_child_bill_category_id){
				$scope.current_child_bill_category = $scope.bill_category_items[index].child_bill_categories[i];
			}
		}
		UIkit.modal("#child_bill_category_modify_modal").show();
	}
	//提交修改
	$scope.modifyChildBillCategory = function(){
		console.log("修改二级分类：");
		console.log($scope.current_child_bill_category);
		Bill.modifyChildCategory($scope.current_child_bill_category.child_bill_category_id,$scope.current_child_bill_category.child_bill_category_name).success(function(res){
			console.log(res);
			if(res.error === 0){
				//更新一下分类信息
				$scope.updateCategory();
				hMessage("修改成功！");
			}else hMessage(res.msg);
		});
	}
	//删除二级分类
	$scope.deleteChildBillCategory = function(index){
		if(confirm("你确定要删除该二级分类(属于该分类的账单也会被一并删除！)??")){
			var current_child_bill_category_select = document.querySelector("#bill_category_item_"+index+" select");
			var current_child_bill_category_id = current_child_bill_category_select.options[current_child_bill_category_select.selectedIndex].value.split(":")[1];

			Bill.deleteChildCategory(current_child_bill_category_id).success(function(res){
				if(res.error === 0){
					//更新一下分类信息
					$scope.updateCategory();
					hMessage("删除分类成功！");
				}else hMessage(res.msg);
			});
		}
	}
});
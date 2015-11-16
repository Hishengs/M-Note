//------------------共有的控制器----------------
var site_prefix = "http://localhost/note2/"
//var controller_path = '';
//----------------------------------------主页------------------------------------------------
m_index.controller('c_index',function($scope,$rootScope,$state,$http,$location,$log,ipCookie){
	//对所有的url跳转作权限验证
	$rootScope.$on('$locationChangeStart', function(event){
		//$log.log('locationChangeStart');  
        //$log.log(arguments);
        if(!ipCookie('is_logined')){
        	//除了注册登陆不允许跳转到别的地方
        	console.log(arguments[2].split('#')[1]);
        	if(arguments[2].split('#')[1] != "/login" && arguments[2].split('#')[1] != "/register"){
				$state.go('login');
				hMessage("请登录后再操作！");
			}
		} 
	});
	$state.go('home');
	//获取用户的账单分类,账户信息
	/*$rootScope.user_categories = ;
	$rootScope.user_accounts = ;*/
});
//----------------------------------------导航栏------------------------------------------------
m_index.controller('c_nav',function($scope,$state,$rootScope,$http,ipCookie){
	//在这之前向服务器请求用户的登陆状态
	/*$http.get(home_path+"/User/is_logined.html").success(function(){
		if(res.error === 0){
			if(res.is_logined)
				$rootScope.user.is_logined = true;//登陆状态
			else $rootScope.user.is_logined = false;
		}else $rootScope.user.is_logined = false;
	});*/
	$scope.current_tab = 'home';
	$scope.switchTab = function(tab){
		$scope.current_tab = tab;
		$state.go(tab);
	}
	if(!ipCookie('is_logined'))
	{
		$rootScope.login_register_show = true;
		$rootScope.user_show = false;
		$rootScope.username_text = '';
	}else{
		$rootScope.login_register_show = false;
		$rootScope.user_show = true;
		$rootScope.username_text = '<i class="uk-icon-user"></i> ' + ipCookie('username');
	}
});
//-------------------登陆注册控制器----------------------
m_index.controller('c_login',function($scope,$state,$http,$rootScope,ipCookie){
	setTitle("随手记-登陆");
	$scope.username = $scope.password = '';
	$scope.login = function(){
		//格式验证
		if($scope.username.length < 1 || $scope.password.length < 1){hMessage("用户名或密码不能为空！",2000);return;}
		else if($scope.password.length >= 1 && $scope.password.length < 6){hMessage("请输入6位以上的密码！",2000);return;}
		//post
		$http({
          method:'POST',
          url:home_path+"/User/login.html",
          data:{'username':$scope.username,'password':$scope.password}
        }).success(function(res){
			if(res.error === 0){
				hMessage("登陆成功！",1500);
				$rootScope.login_register_show = false;
				$rootScope.user_show = true;
				
				//信息记录
				$rootScope.user = {};//记录所有用户相关的信息
				$rootScope.user.is_logined = true;//登陆状态
				console.log("已登陆");
				ipCookie('is_logined',1);
				ipCookie('username',$scope.username);
				$rootScope.user.name = $scope.username;
				$rootScope.username_text = '<i class="uk-icon-user"></i> ' + $scope.username;
				$rootScope.user.email = "819537918@qq.com";
				$rootScope.user.id = 1000;
				$rootScope.user.avatar = "https://dn-lanbaidiao.qbox.me/avatar_1000_a645761e1fc399f5be08308eacead7ce?imageView2/1/w/80/h/80";
				/*$rootScope.user.email = res.userInfo.email;
				$rootScope.user.id = res.userInfo.id;
				$rootScope.user.avatar = res.userInfo.avatar;*/

				setTimeout(function(){$state.go('home');},1500);
			}else if(res.error === 2){hMessage("该用户不存在！",1500);}
			else hMessage(res.msg,2000);
		}).error(function(data,state){
			console.log(data);
			console.log(state);
		});
	}
});
m_index.controller('c_register',function($scope,$state,$http){
	setTitle("随手记-注册");
	$scope.username = $scope.email = $scope.password = $scope.password_confirm = '';
	$scope.register = function(){
		//格式验证
		console.log($scope.username+","+$scope.email+","+$scope.password+","+$scope.password_confirm);
		//格式验证
		if($scope.username.length < 1){hMessage("用户名不能为空！",2000);return;}
		else if(!usernameVerify($scope.username)){hMessage("用户名只能以英文字母或中文开头,包含数字，下划线，字母，中文！",3000);return;}
		else if($scope.email.length < 1){hMessage("邮箱不能为空！",2000);return;}//邮箱这里要作进一步正则验证
		else if(!emailVerify($scope.email)){hMessage("请输入正确的邮箱格式！",2000);return;}
		else if(checkEmpty($scope.password)){hMessage("密码不能为空！",2000);return;}
		else if($scope.password.length > 1 && $scope.password.length < 6){hMessage("请输入6位以上的密码！",2000);return;}
		else if($scope.password !== $scope.password_confirm){hMessage("两次输入的密码不一致！",2000);return;}
		//将按钮设为不可用状态
		$("#register-btn").html("注册中...");
		$("#register-btn").attr("disabled","disabled");
		//post
		$http({
          method:'POST',
          url:home_path+"/User/register.html",
          data:{'username':$scope.username,'email':$scope.email,'password':$scope.password,'password_confirm':$scope.password_confirm}
        }).success(function(res){
        	console.log(res);
			if(res.error === 0){
				hMessage("注册成功，请登陆！",2000);
				$state.go('login');
			}
			else hMessage(res.msg,2000);
			//恢复按钮状态
			$("#register-btn").html("注册");
			$("#register-btn").attr("disabled",false);
		});
	}
});
//----------------------账单控制器-------------------------------
//账单 c_bill
m_index.controller('c_bill',function($scope,$rootScope,$state){
	//默认的state
	$state.go("today_bills");
	//tab选项切换
	$scope.current_bill_tab = "today_bills"; //当前tab选项
	$scope.switchBillTab = function(tab){
		$scope.current_bill_tab = tab;
		$state.go(tab);
	}
});
//c_today_bills 今日账单
m_index.controller('c_today_bills',function($scope,$rootScope,$state,$http,BillOutcomeCategory,BillIncomeCategory){
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
	//显示新增账单template
	$scope.vAddBill = function(){
		$rootScope.current_operation = "add_bill";//当前操作
		$rootScope.bill_operation_trigger = $rootScope.bill_operation_trigger==0?1:0;//触发
		//显示modal
		var add_bill_modal = UIkit.modal("#add-bill-modal");
		add_bill_modal.show();
		$("#add-bill-modal").on({
		    'show.uk.modal': function(){
		        console.log("Modal is visible.");
		    },
		    'hide.uk.modal': function(){
		        $state.go("today_bills");
		    }
		});
		$state.go('bill_add_outcome');//默认是支出
	}
	//显示账单详情模态框
	$scope.showBillDetail = function(index){
		$rootScope.current_bill = $rootScope.today_bills[index];//设置当前账单
		var bill_detail_modal = UIkit.modal("#bill-detail-modal");
		bill_detail_modal.show();
		$("#bill-detail-modal").on({
		    'show.uk.modal': function(){
		        console.log("Modal is visible.");
		    },
		    'hide.uk.modal': function(){
		        $state.go("today_bills");
		    }
		});
		$state.go('bill_details');
	}
});

//c_add_bill_modal 添加账单的模态框
m_index.controller('c_bill_add',function($scope,$rootScope,$state,$http,$timeout,BillOutcomeCategory,BillIncomeCategory,Accounts){
	
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
			BillIncomeCategory.getBillIncomeCategory(true).success(function(res){
				$rootScope.bill_category_items = res.bill_category_items;
				$rootScope.child_bill_categories = $rootScope.bill_category_items[0].child_bill_categories;

				$scope.bill.category = $rootScope.bill_category_items[0].bill_category.bill_category_id;
				$scope.bill.child_category = $rootScope.bill_category_items[0].child_bill_categories[0].child_bill_category_id;
			});
			$scope.bill_type = 2;
			$state.go('bill_add_income');
			$scope.current_bill_view = $rootScope.previous_view = 'income';
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
			$state.go('bill_add_outcome');
			$scope.current_bill_view = $rootScope.previous_view = 'outcome';
			$scope.bill_type_text = '记账-支出';
		}
	}
	//-----------------返回账单详情--------------------------------
	$scope.backToDetail = function(){
		var bill_detail_modal = UIkit.modal("#bill-detail-modal");
		bill_detail_modal.show();
		$("#bill-detail-modal").on({
		    'show.uk.modal': function(){
		        console.log("Modal is visible.");
		    },
		    'hide.uk.modal': function(){
		        $state.go("today_bills");
		    }
		});
		$state.go('bill_details');
	}
	//------------------添加账单分类------------------------------------
	$scope.vAddCategory = function(previous_view){
		$rootScope.previous_view = previous_view;
		$state.go('add_category');
	}
	//------------------添加账户------------------------
	$scope.vAddAccount = function(){
		$state.go('add_account');
	}
});
//添加账单分类
m_index.controller('c_add_bill_category',function($scope,$rootScope,$state,$http,BillOutcomeCategory,BillIncomeCategory){
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
		console.log({'is_self_defined':is_self_defined,'bill_type':bill_type,
          'bill_category':$scope.bill_category.bill_category,'child_bill_category':$scope.bill_category.child_bill_category});
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
				if($rootScope.previous_view == 'outcome'){
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
	$scope.backward = function(){
		$state.go('bill_add_'+$rootScope.previous_view);
	}
});
//添加账户
m_index.controller('c_add_account',function($scope,$rootScope,$state,$http,Accounts){
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
				Accounts.getAccounts(true).success(function(res){
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
		$state.go('bill_add_'+$rootScope.previous_view);
	}
});

//c_bill_details  查看账单详情
m_index.controller('c_bill_details',function($scope,$rootScope,$state,$http){
	//删除账单
	$scope.deleteBill = function(){
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
	//修改账单
	$scope.modifyBill = function(){
		var add_bill_modal = UIkit.modal("#add-bill-modal");
		add_bill_modal.show();
		$("#add-bill-modal").on({
		    'show.uk.modal': function(){
		        console.log("Modal is visible.");
		    },
		    'hide.uk.modal': function(){
		        $state.go("today_bills");
		    }
		});
		$state.go('bill_add_outcome');//默认是支出
		$rootScope.current_operation = "modify_bill";
		$rootScope.bill_operation_trigger = $rootScope.bill_operation_trigger==0?1:0;//触发器
	}
});

//---------------------账户控制器-------------------------
//----------------------------------------账户页面----------------------------------------------
//---+c_accounts
//---|---c_account 单个账户详情
//---|---c_cash

//c_accounts
m_index.controller('c_accounts',function($scope,$rootScope,$state,$http,Accounts){
	//获取账户分类
	Accounts.getAccounts(true).success(function(res){
		$rootScope.account_items = res.account_items;
		$rootScope.child_accounts = $rootScope.account_items[0].child_accounts;
	});
	setTitle("随手记-账户");
	$state.go('accounts_sum');
	$scope.current_accounts_tab = 'cash';
	//显示单个账户信息
	$scope.showAccount = function(account_id){
		console.log("account_id:"+account_id);
		//$rootScope.account_id = account_id;
		//请求该账户的信息
		$http.get(home_path+"/Account/get_account_info.html?account_id="+account_id).success(function(res){
			if(res.error === 0){
				$rootScope.account = res.account;
			}
		});
		$state.go('account');
	}
	//添加账户
	$scope.addAccount = function(){
		var add_account_modal = UIkit.modal("#add-account-modal");
		if ( add_account_modal.isActive() ) {
		    add_account_modal.hide();
		} else {
		    add_account_modal.show();
		}
	}
	//切换账户
	$scope.switchAccountsTab = function(tab){
		$scope.current_accounts_tab = tab;
	}
});
//添加账户
m_index.controller('c_add_account_modal',function($scope,$state){
	$scope.add_self_account_btn_icon = '<i class="uk-icon-toggle-off uk-icon-medium"></i>';
	$scope.ifAddSelfAccount = false;
	//添加自定义类型
	$scope.addSelfAccount = function(){
		$scope.ifAddSelfAccount = $scope.ifAddSelfAccount?false:true;
		if($scope.ifAddSelfAccount)
			$scope.add_self_account_btn_icon = '<i class="uk-icon-toggle-on uk-icon-medium"></i>';
		else $scope.add_self_account_btn_icon = '<i class="uk-icon-toggle-off uk-icon-medium"></i>';
	}
})
//c_accounts_sum
m_index.controller('c_accounts_sum',function($scope,$state){
	//modify-account-modal
	$scope.modifyAccount = function(){
		var modify_account_modal = UIkit.modal("#modify-account-modal");
		if ( modify_account_modal.isActive() ) {
		    modify_account_modal.hide();
		} else {
		    modify_account_modal.show();
		}
	}
});
//c_account 
m_index.controller('c_account',function($scope,$rootScope,$state,$http){
	//
});
//----------------------用户控制器------------------------
m_index.controller('c_user',function($scope,$state,$http,$rootScope){
	$state.go('basicInfo');
	$rootScope.current_user_tab = 'basicInfo';
	$scope.switchUserTab = function(tab){
		$rootScope.current_user_tab = tab;
		$state.go(tab);
	}
});
m_index.controller('c_user_basicInfo',function($scope,$state,$rootScope,$interval,$http,ipCookie){
	$rootScope.current_user_tab = 'basicInfo';
	//获取用户的基本信息
	$http.get(home_path+"/User/get_user_basic_info.html").success(function(res){
		console.log(res);
		if(res.error === 0){
			$rootScope.user = {};
			$rootScope.user.name = res.user.user_name;
			$rootScope.username_text = '<i class="uk-icon-user"></i> ' + res.user.user_name;
			$rootScope.user.email = res.user.user_email;
			//判断是相对路径还是绝对路径
			var pattern = /^(https|http|www)/g;
			if(pattern.test(res.user.user_avatar))
				$rootScope.user.avatar = res.user.user_avatar;
			else $rootScope.user.avatar = public_path+ "/img/avatar/" + res.user.user_avatar;
		}
	});
	//注销
	$scope.logout = function(){
		$http.get(home_path+"/User/logout.html").success(function(res){
			if(res.error === 0){
				hMessage("退出登陆成功！",1200);
				ipCookie('is_logined',0);
				$rootScope.login_register_show = true;
				$rootScope.user_show = false;
				$rootScope.username_text = '';
				setTimeout(function(){$state.go('login');},1200);
			}else hMessage(res.msg);
		});
	}
	//修改用户信息
	$scope.modifyUserInfo = function(){
		var userInfo_modal = UIkit.modal("#modify-userInfo-modal");
		if ( userInfo_modal.isActive() ) {
		    userInfo_modal.hide();
		} else {
		    userInfo_modal.show();
		}
	}
});
//修改密码
m_index.controller('c_user_modifyPasswd',function($scope,$state,$rootScope,$interval,$http){
	$rootScope.current_user_tab = 'modifyPasswd';
	$scope.old_password = $scope.new_password = $scope.password_confirm = '';
	$scope.resetPassword = function(){
		//console.log('old_password:'+$scope.old_password+',new_password:'+$scope.new_password+',password_confirm:'+$scope.password_confirm);
		//post
		if(checkEmpty($scope.old_password) || checkEmpty($scope.new_password) || checkEmpty($scope.password_confirm)){
			hMessage("密码不能为空(不能包含空格等非显示字符)！");
			return;
		}
		if($scope.new_password.length < 6 && $scope.new_password.length > 0){
			hMessage("请输入六位以上的密码！");
			return;
		}
		if($scope.new_password !== $scope.password_confirm){
			hMessage("新密码与确认密码不相等！");
			return;
		}
		$http({
	      method:'POST',
	      url:home_path+"/User/modify_user_password.html",
	      data:{'old_password':$scope.old_password,'new_password':$scope.new_password,'password_confirm':$scope.password_confirm}
	    }).success(function(res){
	    	console.log(res);
			if(res.error === 0){
				hMessage("密码修改成功，请使用新的密码登陆！",2000);
				$interval(function(){$state.go('login');},2000);
			}else hMessage(res.msg,2000);
		});
	}
});
//修改用户的基本信息
m_index.controller('c_modify_userInfo_modal',function($scope,$state,$rootScope,$interval,$http,ipCookie){
	$scope.avatar_upload_url = "http://localhost/M-Note/index.php/Home/User/upload_user_avatar.html";
	$scope.user_name = $scope.user_email = "";
	$scope.uploadAvatarBtn = "上传头像";

	//上传用户头像
	$scope.uploadUserAvatar = function(){
		var uploadable = true;
		var checkTime=200;
		//先检查文件，判空，类型和大小
	    var imgFile = document.getElementById("user_avatar_img").files[0];
	    if(imgFile == null){hMessage('请先选择图片！');uploadable = false;}
	    else{
	        if(imgFile.type != "image/jpeg" && imgFile.type != "image/jpg" && imgFile.type != "image/png" && uploadable)
	        {hMessage('请选择正确的图片格式：jpeg,jpg,png！'); uploadable = false;}
	        var imgSize = imgFile.size / (1024*1024);
	        if(imgSize > 2 && uploadable){hMessage('上传图片请限制在2M以内！'); uploadable = false;}
	    }
	    //执行上传操作
	    if(uploadable){
	        $("form.upload-avatar-form").submit();
	        $scope.uploadAvatarBtn = "上传中...";
	        var stop = $interval(function(){
	            if($(window.frames["upload_avatar_iframe"].document).find('pre').html() != undefined)
	            {
		            var callback = JSON.parse($(window.frames["upload_avatar_iframe"].document).find('pre').html());
		            console.log(callback);
		            if(callback.error == 0){
		            	//判断是相对路径还是绝对路径
						var pattern = /^(https|http|www)/g;
						if(pattern.test(callback.url))
							$rootScope.user.avatar = callback.url;
						else $rootScope.user.avatar = public_path+ "/img/avatar/" + callback.url;
		              	$scope.uploadAvatarBtn = "上传成功！";
		              	hMessage("上传成功！");
		              	$interval(function(){$scope.uploadAvatarBtn = "上传头像";},2000);
		            }else hMessage(callback.msg);
		            $(window.frames["upload_avatar_iframe"].document).find('pre').html('');
		            $interval.cancel(stop);
	            }
	      	},checkTime);
	    }
	}
	//修改用户基本信息
	$scope.modifyUserInfo = function(){
		//判空，格式检测
		if($scope.user_name.length < 1 && $scope.user_email.length < 1){hMessage("不能提交空信息，请至少修改一项！");return;}
		else if($scope.user_name.length > 0 && !usernameVerify($scope.user_name)){hMessage("用户名只能以英文字母或中文开头,包含数字，下划线，字母，中文！",3000);return;}
		else if($scope.user_email.length > 0 && !emailVerify($scope.user_email)){hMessage("请输入正确的邮箱格式！");return;}
		console.log('username:'+$scope.user_name+',email:'+$scope.user_email);
		$http({
	      method:'POST',
	      url:home_path+"/User/modify_user_basic_info.html",
	      data:{'username':$scope.user_name,'user_email':$scope.user_email}
	    }).success(function(res){
	    	console.log(res);
			if(res.error === 0){
				//这里更新一下页面的用户信息
				$rootScope.user.name = res.user.user_name;
				$rootScope.username_text = '<i class="uk-icon-user"></i> ' + res.user.user_name;
				$rootScope.user.email = res.user.user_email;
				ipCookie('username',$scope.user_name)
				hMessage("用户信息修改成功！",2000);
				setTimeout(function(){
					var user_info_modal = UIkit.modal("#modify-userInfo-modal");
					user_info_modal.hide();
				},1000);
			}else hMessage(res.msg,2000);
		});
	}
});

//----------------路由控制器---------------
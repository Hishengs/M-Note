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
//----------------------------------------登陆/注册---------------------------------------------
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
		});
	}
});
//----------------------------------------记账页面----------------------------------------------
//|-+c_bill
//|---c_add_bill_modal
//|---+c_bill_details_modal
//|---|---c_modify_bill

//c_bill
m_index.controller('c_bill',function($scope,$rootScope,$state,$http){
	setTitle("随手记-记账");
	//获取当日账单列表，bill_list
	$http.get(home_path+"/Bill/get_today_bills.html").success(function(res){
		console.log(res);
		if(res.error === 0){
			$scope.today_bills = res.bills;
			$scope.bill_tip_show = false;
		}
		else if(res.error === 2){//查询为空
			$scope.bill_tip_show = true;
			$scope.bill_tip = '今天还没有账单信息，快去记一笔吧！';
		}
		else console.log(res.msg);
	}).error(function(data,state){
		console.log(data);
	});
	$scope.bill_tip_show = true;
	$scope.bill_tip = '今天还没有账单信息，快去记一笔吧！';
	$scope.showAddBillModal = function(){//显示新增账单模态框
		var bill_modal = UIkit.modal("#add-bill-modal");
		if ( bill_modal.isActive() ) {
		    bill_modal.hide();
		} else {
		    bill_modal.show();
		}
		$state.go('bill_outcome');
	}
	$scope.showBillDetail = function(index){//显示账单详情模态框
		console.log("index:"+index);
		$rootScope.current_bill = $scope.today_bills[index];
		var bill_detail_modal = UIkit.modal("#bill-detail-modal");
		if ( bill_detail_modal.isActive() ) {
		    bill_detail_modal.hide();
		} else {
		    bill_detail_modal.show();
		}
		$state.go('bill_details');
	}
});
//c_add_bill_modal
m_index.controller('c_add_bill_modal',function($scope,$state,$http,$interval){
	//设置账单的默认值
	$scope.bill_type = 1;//支出
	$scope.bill = {};
	$scope.bill.time = {};
	//设置账单默认时间
	var date = new Date();
	$scope.bill.date = date.getFullYear()+"-"+(parseInt(date.getMonth())+1)+"-"+date.getDate();
	$scope.bill.time.hour = date.getHours()+"";
	$scope.bill.time.minute = date.getMinutes()+"";
	$scope.hours = [];
	$scope.minutes = [];
	for(var i=0;i<parseInt($scope.bill.time.hour)+1;i++)$scope.hours.push(i);
	console.log($scope.hours);
	for(var i=0;i<parseInt($scope.bill.time.minute)+1;i++)$scope.minutes.push(i);
	$scope.bill_type_text = '记账-支出';
	$scope.current_bill_view = $scope.previous_view = 'outcome';

	$scope.bill_accounts = {};
	$scope.bill_child_accounts = {};
	$scope.bill.first_category = $scope.bill.second_category = $scope.bill.account_type = $scope.bill.account_name = "1";
	//获取用户账户信息
	$http.get(home_path+"/Account/get_user_accounts.html").success(function(res){
		console.log(res);
		if(res.error === 0){
			$scope.bill_accounts = res.accounts;
			$scope.bill_child_accounts = res.accounts[0].child_accounts;
			console.log($scope.bill_child_accounts);
		}
	});
	//获取用户账单分类-默认outcome支出
	$http.get(home_path+"/Bill/get_user_bill_categories.html?type=outcome").success(function(res){
		console.log(res);
		if(res.error === 0){
			$scope.bill_categories = res.bill_categories;
			$scope.child_bill_categories = res.bill_categories[0].child_bill_categories;
		}
	});
	//监听账户选项变化
	$scope.billAccountTypeChange = function(){
		console.log("index:"+($scope.bill.account_type-$scope.bill_accounts[0].account_type.account_type_id));
		$scope.bill_child_accounts = $scope.bill_accounts[$scope.bill.account_type-$scope.bill_accounts[0].account_type.account_type_id].child_accounts;
		$scope.bill.account_name = $scope.bill_child_accounts[0].account_id;
	}
	//监听分类选项变化
	$scope.billCategoryTypeChange = function(){
		console.log("index:"+($scope.bill.first_category-$scope.bill_categories[0].bill_category_type.bill_category_type_id));
		$scope.child_bill_categories = $scope.bill_categories[$scope.bill.first_category-$scope.bill_categories[0].bill_category_type.bill_category_type_id].child_bill_categories;
		$scope.bill.second_category = $scope.child_bill_categories[0].bill_category_id;
	}
	
	//定位
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

	//添加账单
	$scope.addBill = function(){
		var data = [$scope.bill_type,$scope.bill.first_category,$scope.bill.second_category,$scope.bill.account_type,$scope.bill.account_name,$scope.bill.date+" "+
		$scope.bill.time.hour+":"+$scope.bill.time.minute,$scope.bill.location,$scope.bill.sum,$scope.bill.remarks];
		if($scope.bill.sum < 0){hMessage("金额不能为负！");return;}
		console.log(data);
		$http({
          method:'POST',
          url:home_path+"/Bill/add_bill.html",
          data:{'bill_type':$scope.bill_type,'bill_category_id':$scope.bill.second_category,'bill_account_id':$scope.bill.account_name,
          'bill_time':$scope.bill.date+" "+$scope.bill.time.hour+":"+$scope.bill.time.minute,'bill_location':$scope.bill.location,
          'bill_sum':$scope.bill.sum,'bill_remarks':$scope.bill.remarks}
        }).success(function(res){
        	console.log(res);
			if(res.error === 0){
				hMessage("账单添加成功成功！",2000);
			}
			else hMessage(res.msg,2000);
		});
	}

	//切换账单类型
	$scope.switchBillType = function(){
		//重置账户选项
		$scope.bill_child_accounts = $scope.bill_accounts[0].child_accounts;
		$scope.bill.account_type = $scope.bill_accounts[0].account_type.account_type_id;
		$scope.bill.account_name = $scope.bill_child_accounts[0].account_id;
		
		if($scope.current_bill_view == 'outcome'){
			//分类选项切换
			$http.get(home_path+"/Bill/get_user_bill_categories.html?type=income").success(function(res){
				console.log(res);
				if(res.error === 0){
					$scope.bill_categories = res.bill_categories;
					$scope.child_bill_categories = res.bill_categories[0].child_bill_categories;
					//重置分类选项
					$scope.bill.first_category = $scope.bill_categories[0].bill_category_type.bill_category_type_id;
					$scope.bill.second_category = $scope.child_bill_categories[0].bill_category_id;
				}
			});
			$scope.bill_type = 2;
			$state.go('bill_income');
			$scope.current_bill_view = $scope.previous_view = 'income';
			$scope.bill_type_text = '记账-收入';
		}
		else {
			//分类选项切换
			$http.get(home_path+"/Bill/get_user_bill_categories.html?type=outcome").success(function(res){
				console.log(res);
				if(res.error === 0){
					$scope.bill_categories = res.bill_categories;
					$scope.child_bill_categories = res.bill_categories[0].child_bill_categories;
					//重置分类选项
					$scope.bill.first_category = $scope.bill_categories[0].bill_category_type.bill_category_type_id;
					$scope.bill.second_category = $scope.child_bill_categories[0].bill_category_id;
				}
			});
			$scope.bill_type = 1;
			$state.go('bill_outcome');$scope.current_bill_view = $scope.previous_view = 'outcome';$scope.bill_type_text = '记账-支出';
		}
	}
	//账单post
	//添加分类
	$scope.addCategory = function(previous_view){
		$scope.ifAddSelfCategory = false;
		$scope.previous_view = previous_view;
		$scope.add_self_category_btn_icon = '<i class="uk-icon-toggle-off uk-icon-medium"></i>';
		if(previous_view == 'outcome')
			$scope.add_category_title = "支出";
		else $scope.add_category_title = "收入";
		$state.go('add_category');
	}
	//添加自定义一级分类
	$scope.AddSelfCategory = function(){
		$scope.ifAddSelfCategory = $scope.ifAddSelfCategory?false:true;
		if($scope.ifAddSelfCategory)
			$scope.add_self_category_btn_icon = '<i class="uk-icon-toggle-on uk-icon-medium"></i>';
		else $scope.add_self_category_btn_icon = '<i class="uk-icon-toggle-off uk-icon-medium"></i>';
	}
	//添加账户
	$scope.addAccount = function(){
		$scope.add_self_account_btn_icon = '<i class="uk-icon-toggle-off uk-icon-medium"></i>';
		$scope.ifAddSelfAccount = false;
		$state.go('add_account');
	}
	//添加自定义类型
	$scope.addSelfAccount = function(){
		$scope.ifAddSelfAccount = $scope.ifAddSelfAccount?false:true;
		if($scope.ifAddSelfAccount)
			$scope.add_self_account_btn_icon = '<i class="uk-icon-toggle-on uk-icon-medium"></i>';
		else $scope.add_self_account_btn_icon = '<i class="uk-icon-toggle-off uk-icon-medium"></i>';
	}
	$scope.backward = function(){
		$state.go('bill_'+$scope.previous_view);
	}
});
//c_bill_details_modal
m_index.controller('c_bill_details_modal',function($scope,$state,$http){
	$scope.deleteBill = function(){//删除账单
		confirm('你确定要删除该账单？本操作不可撤销！');
	}
	$scope.modifyBill = function(){//修改账单
		$state.go('modify_bill');
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

//----------------------------------------报表页面----------------------------------------------
//---+c_charts
//---|---c_budget

//c_charts
m_index.controller('c_charts',function($scope,$state){
	setTitle("随手记-报表");
	$state.go('budget');
	$scope.current_charts_tab = 'budget';
	$scope.switchChartsTab = function(tab){
		$scope.current_charts_tab = tab;
	}
});
//c_budget
m_index.controller('c_budget',function($scope,$state){});

//----------------------------------------账户页面----------------------------------------------
//---+c_accounts
//---|---c_account 单个账户详情
//---|---c_cash

//c_accounts
m_index.controller('c_accounts',function($scope,$rootScope,$state,$http){
	//获取用户的账户列表信息
	$scope.accounts = {};
	$http.get(home_path+"/Account/get_user_accounts.html").success(function(res){
		console.log(res);
		if(res.error === 0){
			$scope.accounts = res.accounts;
		}
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

//----------------------------------------用户中心页面----------------------------------------------
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
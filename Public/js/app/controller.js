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
		if(ipCookie('is_logined')){
				$scope.current_tab = tab;
				$state.go(tab);
		}
		else {//未登录
			hMessage("请登陆后再操作！",1500);
			$state.go('login');
		}
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
				$rootScope.username_text = '<i class="uk-icon-user"></i> ' + $scope.username;
				//信息记录
				$rootScope.user = {};//记录所有用户相关的信息
				$rootScope.user.is_logined = true;//登陆状态
				console.log("已登陆");
				ipCookie('is_logined',1);
				ipCookie('username',$scope.username);
				$rootScope.user.name = $scope.username;
				$rootScope.user.email = "819537918@qq.com";
				$rootScope.user.id = 1000;
				$rootScope.user.avatar = "https://dn-lanbaidiao.qbox.me/avatar_1000_a645761e1fc399f5be08308eacead7ce?imageView2/1/w/80/h/80";
				/*$rootScope.user.email = res.userInfo.email;
				$rootScope.user.id = res.userInfo.id;
				$rootScope.user.avatar = res.userInfo.avatar;*/

				setTimeout(function(){$state.go('home');},1500);
			}else if(res.error === 2){hMessage("该用户不存在！",1500);}
			else hMessage(res.msg,2000);
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
m_index.controller('c_bill',function($scope,$state,$http){
	setTitle("随手记-记账");
	//获取当日账单列表，bill_list
	/*$http.get(controller_path+'').success(function(res){
		if(res.error === 0)
			$scope.bill_list = res.data;
			$scope.bill_tip_show = false;
		else if(res.error === 2){//查询为空
			$scope.bill_tip_show = true;
			$scope.bill_tip = '今天还没有账单信息，快去记一笔吧！';
		}
		else console.log(res.msg);
	});*/
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
	$scope.showBillDetail = function(){//显示账单详情模态框
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
	$scope.bill = {};
	$scope.bill.time = {};
	
	$scope.bill.first_category = $scope.bill.second_category = $scope.bill.account_type = $scope.bill.account_name = "1";
	var date = new Date();
	$scope.bill.date = date.getFullYear()+"-"+(parseInt(date.getMonth())+1)+"-"+date.getDate();
	$scope.bill.time.hour = date.getHours()+"";
	$scope.bill.time.minute = date.getMinutes()+"";
	//$scope.bill.time = date.getHours()+":"+date.getMinutes();
	$scope.hours = [];
	$scope.minutes = [];
	for(var i=0;i<parseInt($scope.bill.time.hour)+1;i++)$scope.hours.push(i);
	console.log($scope.hours);
	for(var i=0;i<parseInt($scope.bill.time.minute)+1;i++)$scope.minutes.push(i);

	$scope.bill_type = '记账-支出';
	$scope.current_bill_view = $scope.previous_view = 'outcome';

	//定位
	$scope.location_options_show = false;
	//点击模态框提示消失
	$scope.add_bill_modal_click = function(){$scope.location_options_show = false;}
	var url = "http://api.map.baidu.com/location/ip?ak="+baidu_ak+"&callback=JSON_CALLBACK";
	var city_code = 131;
	//获取城市码
	$http.jsonp(url).success(function(res){
		city_code = res.content.address_detail.city_code;
		console.log("当前城市编码:"+city_code);
	});
	$scope.locate = function(){
		$http.jsonp(url).success(function(res){
			console.log(res);
			$scope.bill.location = res.content.address;
		});
	}	
	//监听input内容
	$scope.location_options = [];
	var baidu_suggestion_api_url = "http://api.map.baidu.com/place/v2/suggestion";
	$scope.locationInputChange = function(){
		console.log("监听到input改变...");
		var url = baidu_suggestion_api_url+"?query="+$scope.bill.location+"&region="+city_code+"&ak="+baidu_ak+"&output=json&callback=JSON_CALLBACK";
		console.log(url);
		$http.jsonp(url).success(function(res){
			console.log(res);
			if(res.status == 0){
				$scope.location_options_show = true;
				$scope.location_options = res.result;
			}else{console.log("获取位置列表失败！");}
		});
	}
	//选择某个建议项后
	$scope.selectLocation = function(location){
		$scope.bill.location = location;
		$scope.location_options_show = false;
	}
	//添加账单
	$scope.addBill = function(){
		var data = [$scope.bill.first_category,$scope.bill.second_category,$scope.bill.account_type,$scope.bill.account_name,$scope.bill.date,
		$scope.bill.time,$scope.bill.location,$scope.bill.sum,$scope.bill.remarks];
		if($scope.bill.sum < 0){hMessage("金额不能为负！");return;}
		console.log(data);
	}
	$scope.switchBillType = function(){
		if($scope.current_bill_view == 'outcome'){
			$state.go('bill_income');
			$scope.current_bill_view = $scope.previous_view = 'income';
			$scope.bill_type = '记账-收入';
		}
		else {$state.go('bill_outcome');$scope.current_bill_view = $scope.previous_view = 'outcome';$scope.bill_type = '记账-支出';}
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
//---|---c_cash

//c_accounts
m_index.controller('c_accounts',function($scope,$state){
	setTitle("随手记-账户");
	$state.go('cash');
	$scope.current_accounts_tab = 'cash';
	$scope.addAccount = function(){
		var add_account_modal = UIkit.modal("#add-account-modal");
		if ( add_account_modal.isActive() ) {
		    add_account_modal.hide();
		} else {
		    add_account_modal.show();
		}
	}
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
//c_cash
m_index.controller('c_cash',function($scope,$state){
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
		//对密码进行检查
		/*if($scope.old_password.length < 1 || $scope.new_password.length < 1 || $scope.password_confirm.length < 1){
			hMessage("密码不能为空！");
			return;
		}*/
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
	$scope.user_name = ipCookie('username');
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
		            if(callback.error == 0){
		              $rootScope.user_avatar = callback.url;
		              $scope.uploadAvatarBtn = "上传成功！";
		              hMessage("上传成功！");
		              $interval(function(){$scope.uploadAvatarBtn = "上传头像";},2000);
		            }else hMessage('头像修改失败，请稍后重试！');
		            $(window.frames["upload_avatar_iframe"].document).find('pre').html('');
		            $interval.cancel(stop);
	            }
	      	},checkTime);
	    }
	}
	//修改用户基本信息
	$scope.modifyUserInfo = function(){
		//判空，格式检测
		if($scope.user_name == ipCookie('username') && $scope.user_email == $rootScope.user_email){
			hMessage("您未作任何修改！");
			return;
		}else if($scope.user_name.length < 1){hMessage("用户名不能为空！");return;}
		else if(!usernameVerify($scope.user_name)){hMessage("用户名只能以英文字母或中文开头,包含数字，下划线，字母，中文！",3000);return;}
		else if($scope.user_email.length < 1){hMessage("邮箱不能为空！");return;}
		else if(!emailVerify($scope.user_email)){hMessage("请输入正确的邮箱格式！");return;}
		console.log('username:'+$scope.user_name+',email:'+$scope.user_email);
		$http({
	      method:'POST',
	      url:home_path+"/User/modify_user_basic_info.html",
	      data:{'username':$scope.user_name,'user_email':$scope.user_email}
	    }).success(function(res){
	    	console.log(res);
			if(res.error === 0){
				ipCookie('username',$scope.user_name)
				hMessage("用户信息修改成功！",2000);
				$interval(function(){
					var user_info_modal = UIkit.modal("#modify-userInfo-modal");
					user_info_modal.hide();
				},1000);
				//这里更新一下页面的用户信息
				/*$rootScope.user.name = $scope.user_name;
				$rootScope.user_email = $scope.user_email;*/
			}else hMessage(res.msg,2000);
		});
	}
});
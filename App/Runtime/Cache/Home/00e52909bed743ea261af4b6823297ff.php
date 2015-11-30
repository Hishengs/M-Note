<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html ng-app="M_NOTE" ng-controller="c_index">
<head>
	<base href="/M-Note/">
	<meta charset="utf-8"/>
	<meta name="viewport" content="width=device-width,initial-scale=1.0">
	<link rel="stylesheet" type="text/css" href="/M-Note/Public/plugins/uikit/css/uikit.almost-flat.min.css">
	<link rel="stylesheet" type="text/css" href="/M-Note/Public/plugins/uikit/css/components/datepicker.min.css"><!-- 日期选择控件样式 -->
	<link rel="stylesheet" type="text/css" href="/M-Note/Public/plugins/uikit/css/components/form-select.min.css">
	<link rel="stylesheet" type="text/css" href="/M-Note/Public/plugins/uikit/css/components/progress.min.css"><!-- 进度条样式 -->
	<link rel="stylesheet" type="text/css" href="/M-Note/Public/plugins/uikit/css/components/notify.min.css"><!-- 顶部通知样式 -->
	<link rel="stylesheet" type="text/css" href="/M-Note/Public/css/common.css">
	<script type="text/javascript">
    	var templates_path = "/M-Note/Public"+"/templates";
    	var home_path = "/M-Note/index.php/Home";
    	var public_path = "/M-Note/Public";
    </script>
	<script type="text/javascript" src="/M-Note/Public/js/jquery/dist/jquery.min.js"></script>
	<script type="text/javascript" src="/M-Note/Public/js/index.js"></script>
	<script type="text/javascript" src="/M-Note/Public/js/dist/angular.js"></script>
	<script type="text/javascript" src="/M-Note/Public/js/app/init.js"></script>
	<script type="text/javascript" src="/M-Note/Public/js/app/config.js"></script>
	<script type="text/javascript" src="/M-Note/Public/js/app/state.js"></script>
	<script type="text/javascript" src="/M-Note/Public/js/app/filter.js"></script>
	<script type="text/javascript" src="/M-Note/Public/js/app/service.js"></script>
	<script type="text/javascript" src="/M-Note/Public/js/app/controller.js"></script>
	<!--<script type="text/javascript" src="./js/dist/app.js"></script>-->
	<script type="text/javascript" src="/M-Note/Public/plugins/uikit/js/uikit.min.js"></script>
	<script type="text/javascript" src="/M-Note/Public/plugins/uikit/js/components/form-password.min.js"></script>
	<script type="text/javascript" src="/M-Note/Public/plugins/uikit/js/components/datepicker.js"></script><!-- 日期选择控件 -->
	<script type="text/javascript" src="/M-Note/Public/plugins/uikit/js/components/form-select.min.js"></script><!-- 选择表单控件 -->
	<script type="text/javascript" src="/M-Note/Public/plugins/uikit/js/components/notify.min.js"></script><!-- 顶部通知控件 -->
	<!-- ECharts -->
    <script src="/M-Note/Public/plugins/echarts/dist/echarts-all.js"></script>
	<title>随手记-首页</title>
</head>
<body>
<!-- 导航栏 -->
<div class="nav-wrapper" ng-controller="c_nav">
	<nav class="nav uk-navbar">
		<ul class="nav-items uk-navbar-nav">
	        <li ng-class="{'uk-active': current_tab=='home'}" ng-click="switchTab('home')">
		        <a href="javascript:void(0);">
		        M-NOTE
		        </a></li>
	        <li ng-class="{'uk-active': current_tab=='bill'}" ng-click="switchTab('bill')"><a href="javascript:void(0);">记账</a></li>
	        <li ng-class="{'uk-active': current_tab=='charts'}" ng-click="switchTab('charts')"><a href="javascript:void(0);">报表</a></li>
	        <li ng-class="{'uk-active': current_tab=='accounts'}" ng-click="switchTab('accounts')"><a href="javascript:void(0);">账户</a></li>
	    </ul>
	    <div class="uk-navbar-flip">
	        <ul class="uk-navbar-nav login_register" ng-show="login_register_show">
	            <li ng-class="{'uk-active': current_tab=='login'}" ng-click="switchTab('login')">
	            	<a href="javascript:void(0);" ui-sref="login">登陆</a>
	            </li>
	            <li ng-class="{'uk-active': current_tab=='register'}" ng-click="switchTab('register')">
	            	<a href="javascript:void(0);" ui-sref="register">注册</a>
	            </li>
	        </ul>
	        <ul class="uk-navbar-nav user" ng-show="user_show">
	        	<li ng-class="{'uk-active': current_tab=='user'}" ng-click="switchTab('user')">
	        		<a href="javascript:void(0);" ui-sref="basicInfo" ng-bind-html="username_text | trustHtml"></a>
	        	</li>
	        </ul>
	    </div>
	</nav>
</div>
<div class="main">
	<!-- 主体 -->
	<div class="container" ui-view="content"></div>
	<!-- 页脚 -->
	<div class="footer-wrapper">
		<div class="footer">
			<hr>
			<div class="site-info">
				<p>M-Note @ 2015 Design By Hisheng</p>
			</div>
		</div> 
	</div>
</div>
</body>
<script type="text/javascript">
	//获取当前日期
	var date = new Date();
	var minDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + (parseInt(date.getDate())-7);//前一周
	var maxDate = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
</script>
</html>
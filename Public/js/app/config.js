m_index.config(['$locationProvider', '$urlRouterProvider', '$compileProvider',function($locationProvider, $urlRouterProvider,$compileProvider) {
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise("");
    //deal unsafe:javascript:...
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
}]);

//deal post issue
m_index.config(['$httpProvider',function($httpProvider){
   // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  $httpProvider.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
  //The workhorse; converts an object to x-www-form-urlencoded serialization.
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
    for(name in obj) {
      value = obj[name];
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
    return query.length ? query.substr(0, query.length - 1) : query;
  };
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
}]);

//state
m_index.config(['$stateProvider',function($stateProvider){
	$stateProvider.state('home',{  //首页
		url:'',
		views:{'content':{templateUrl:templates_path+'/home.html'}}
	}).state('login',{  //登陆
		url:'/login',
		views:{'content':{templateUrl:templates_path+'/login.html'}}
	}).state('register',{ //注册
		url:'/register',
		views:{'content':{templateUrl:templates_path+'/register.html'}}
	}).state('bill',{ //--------------------------------------记账-----------------------------------------------
		url:'/bill',
		views:{'content':{templateUrl:templates_path+'/bill/bill.html'}}
	}).state('bill_details',{ //记账-账单详情
		url:'/bill_details',
		parent:'bill',
		views:{'bill_details_view':{templateUrl:templates_path+'/bill/bill_details.html'}}
	}).state('modify_bill',{ //记账-账单修改
		url:'/modify_bill',
		parent:'bill',
		views:{'bill_details_view':{templateUrl:templates_path+'/bill/modify_bill.html'}}
	}).state('modify_bill_outcome',{ //记账-账单修改-outcome
		url:'/modify_bill_outcome',
		parent:'modify_bill',
		views:{'modify_bill_view':{templateUrl:templates_path+'/bill/modify_bill_outcome.html'}}
	}).state('modify_bill_income',{ //记账-账单修改-income
		url:'/modify_bill_income',
		parent:'modify_bill',
		views:{'modify_bill_view':{templateUrl:templates_path+'/bill/modify_bill_income.html'}}
	}).state('bill_outcome',{ //支出
		url:'/outcome',
		parent:'bill',
		views:{'bill_view':{templateUrl:templates_path+'/bill/outcome.html'}}
	}).state('bill_income',{ //收入
		url:'/income',
		parent:'bill',
		views:{'bill_view':{templateUrl:templates_path+'/bill/income.html'}}
	}).state('add_category',{ //添加分类
		url:'/add_category',
		parent:'bill',
		views:{'bill_view':{templateUrl:templates_path+'/bill/add_category.html'}}
	}).state('add_account',{ //添加账户
		url:'/add_account',
		parent:'bill',
		views:{'bill_view':{templateUrl:templates_path+'/bill/add_account.html'}}
	}).state('charts',{ //------------------------------------报表----------------------------------------------------
		url:'/charts',
		views:{'content':{templateUrl:templates_path+'/charts/charts.html'}}
	}).state('budget',{ //报表-预算
		url:'/budget',
		parent:'charts',
		views:{'charts_view':{templateUrl:templates_path+'/charts/budget.html'}}
	}).state('accounts',{ //----------------------------------账户-----------------------------------------------------
		url:'/accounts',
		views:{'content':{templateUrl:templates_path+'/accounts/accounts.html'}}
	}).state('cash',{ //账户-现金
		url:'/cash',
		parent:'accounts',
		views:{'accounts_view':{templateUrl:templates_path+'/accounts/cash.html'}}
	}).state('user',{ //----------------------------------用户中心-----------------------------------------------------
		url:'/user',
		views:{'content':{templateUrl:templates_path+'/user/user.html'}}
	}).state('basicInfo',{ //用户-基本信息
		url:'/basicInfo',
		parent:'user',
		views:{'user_view':{templateUrl:templates_path+'/user/basicInfo.html'}}
	}).state('modifyPasswd',{ //用户-修改密码
		url:'/modifyPasswd',
		parent:'user',
		views:{'user_view':{templateUrl:templates_path+'/user/modifyPasswd.html'}}
	});
}]);

/*m_index.run(['$rootScope', '$window', '$location', '$log', function ($rootScope, $window, $location, $log) {  
    var locationChangeStartOff = $rootScope.$on('$locationChangeStart', locationChangeStart);  
    var locationChangeSuccessOff = $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);  
  
    var routeChangeStartOff = $rootScope.$on('$routeChangeStart', routeChangeStart);  
    var routeChangeSuccessOff = $rootScope.$on('$routeChangeSuccess', routeChangeSuccess);  
  
    function locationChangeStart(event) {  
        $log.log('locationChangeStart');  
        $log.log(arguments);  
    }  
  
    function locationChangeSuccess(event) {  
        $log.log('locationChangeSuccess');  
        $log.log(arguments);  
    }  
  
    function routeChangeStart(event) {  
        $log.log('routeChangeStart');  
        $log.log(arguments);  
    }  
  
    function routeChangeSuccess(event) {  
        $log.log('routeChangeSuccess');  
        $log.log(arguments);  
    }  
}]); */ 
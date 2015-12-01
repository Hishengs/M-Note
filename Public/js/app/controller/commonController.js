//------------------共有的控制器----------------
var site_prefix = "http://localhost/note2/"
//var controller_path = '';
//----------------------------------------主页------------------------------------------------
note.controller('c_index',function($scope,$rootScope,$state,$http,$location,$log,ipCookie){
	/*$rootScope.$on('$viewContentLoaded', function(event){
		console.log('content loaded: ', event);
		if(!ipCookie('is_logined')){
        	$state.go('welcome');
		}else $state.go('home');
	});*/
	$state.go('home');
	//对所有的url跳转作权限验证
	$rootScope.$on('$locationChangeStart', function(event){
        if(!ipCookie('is_logined')){
        	//如果未登录，除了注册登陆不允许跳转到别的地方
        	console.log(arguments);
        	var url_suffix = arguments[1].split('#')[1];
        	url_suffix = url_suffix==undefined?'/#':url_suffix;
        	console.log(url_suffix);
        	if(url_suffix != "/login" && url_suffix != "/register" && url_suffix != "/welcome"){
				$state.go('welcome');
				//$state.go('login');
				//hMessage("请登录后再操作！");
			}
		}
	});

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
	//折线图
	$rootScope.line_options = {};
	$rootScope.line_options.title= {text:"",subtext:""};
	$rootScope.line_options.tooltip = {trigger: 'axis'};
	$rootScope.line_options.legend = {data:[]};
	$rootScope.line_options.calculable = true;
	$rootScope.line_options.xAxis = [{type : 'category',boundaryGap : false,data:[]}];
	$rootScope.line_options.yAxis = [{type : 'value',axisLabel:{formatter:'{value}'}}];
	$rootScope.line_options.series = [];

	var date = new Date();
	var last_day = new Date(date.getFullYear(),date.getMonth()+1,0).getDate();
	$rootScope.sdate = date.getFullYear()+"-"+(date.getMonth()+1)+"-1";//一个月的第一天
	$rootScope.edate = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+last_day;//一个月的最后一天
});
//----------------------------------------导航栏------------------------------------------------
note.controller('c_nav',function($scope,$state,$rootScope,$http,ipCookie){

	$scope.current_tab = 'home';
	$scope.switchTab = function(tab){
		$scope.current_tab = tab;
		if(!ipCookie('is_logined') && tab !== 'welcome'){console.log('nothing');return;}
		if(!ipCookie('is_logined') && tab === 'welcome'){console.log('welcome');$state.go('welcome');return;}
		if(ipCookie('is_logined') && tab === 'welcome'){console.log('home');$state.go('home');return;}
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
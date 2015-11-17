//var templates_path = 'http://localhost/note2/templates';
var baidu_ak = "Zam5C9aBBGepyAEvTLN566X4";
var bar_option = {
        tooltip: {
            show: true
        },
        legend: {
            data:['销量']
        },
        xAxis : [
            {
                type : 'category',
                data : ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                "name":"销量",
                "type":"bar",
                "data":[5, 20, 40, 10, 10, 20]
            }
        ]
    };
var pip_option = {
    title : {
        text: '某站点用户访问来源',
        subtext: '纯属虚构',
        x:'center'
    },
    tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        orient : 'vertical',
        x : 'left',
        data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            magicType : {
                show: true, 
                type: ['pie', 'funnel'],
                option: {
                    funnel: {
                        x: '25%',
                        width: '50%',
                        funnelAlign: 'left',
                        max: 1548
                    }
                }
            },
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : true,
    series : [
        {
            name:'访问来源',
            type:'pie',
            radius : '55%',
            center: ['50%', '60%'],
            data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
            ]
        }
    ]
};

//弹出框
//timeout为空则设为默认timeout，为false或0则返回modal自己处理
function hMessage(msg){
	var timeout = arguments[1] == null ? 2000:arguments[1];
	/*var modal = UIkit.modal.blockUI(msg);
	modal.show();
	if(timeout)
		setTimeout(function(){modal.hide();},timeout);
	else 
		return modal;*/
    UIkit.notify(msg,{timeout:timeout});
}
//邮箱验证
function emailVerify(email){
	//支持中文邮箱
	var re = /^[\u4e00-\u9fa5a-zA-Z\d]+([-_.][\u4e00-\u9fa5A-Za-z\d]+)*@([\u4e00-\u9fa5A-Za-z\d]+[-.]){1,2}[\u4e00-\u9fa5A-Za-z\d]{2,5}$/g;
	//var c_re = re.compile();
	return re.test(email);
}
//用户名验证
//以英文字母或中文开头,只能包含数字，下划线，字母，中文
function usernameVerify(username){
	var re = /^([a-z,A-Z,\u4e00-\u9fa5])([\w,\d,\u4e00-\u9fa5,_])*$/g;
	return re.test(username);
}
//
function setTitle(title){
	$("title").html(title);
	//document.getElementByTagName("title");
}
//check if empty
function checkEmpty(value){
	var re = /^[\s,\n,\t]*$/g;
	return re.test(value);
}
/**
验证服务
by Hisheng
at 2015-11-16
*/
note.service('validator',function(){
	//邮箱验证
	this.checkEmail = function(email){
		//支持中文邮箱
		var re = /^[\u4e00-\u9fa5a-zA-Z\d]+([-_.][\u4e00-\u9fa5A-Za-z\d]+)*@([\u4e00-\u9fa5A-Za-z\d]+[-.]){1,2}[\u4e00-\u9fa5A-Za-z\d]{2,5}$/g;
		//var c_re = re.compile();
		return re.test(email);
	}
	//用户名验证
	//以英文字母或中文开头,只能包含数字，下划线，字母，中文
	this.checkUsername = function(username){
		var re = /^([a-z,A-Z,\u4e00-\u9fa5])([\w,\d,\u4e00-\u9fa5,_])*$/g;
		return re.test(username);
	}
	//check if empty
	this.isEmpty = function(value){
		var re = /^[\s,\n,\t]*$/g;
		return re.test(value);
	}
});
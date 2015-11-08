<?php
namespace Home\Model;
use Think\Model;
class UserModel extends Model {
    // 定义自动验证
    // array(field,rule,message,condition,type,when,params)
    protected $_validate = array(
        array('name','require','用户名必须填写'),
        array('name','','用户名已存在',1,'unique',1),
        array('password','require','密码必须填写'),
        array('rePassword','password','两次密码不一致',0,confirm),
        array('email','email','邮箱格式错误',2),
        array('email','','邮箱已注册',2,'unique',3)
    );
    // 定义自动完成
    protected $_auto = array(
        array('password','md5',3,'function'),
        array('create_time','time',1,'function'),
    );
}
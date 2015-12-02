<?php
return array(
    //'配置项'=>'配置值'
    'DB_TYPE'=>'mysql',// 数据库类型
    'DB_HOST'=>'127.0.0.1',// 服务器地址
    'DB_NAME'=>'m_note',// 数据库名
    'DB_USER'=>'root',// 用户名
    'DB_PWD'=>'8355189',// 密码
    'DB_PORT'=>3306,// 端口
    'DB_PREFIX'=>'',// 数据库表前缀
    'DB_CHARSET'=>'utf8',// 数据库字符集
    'URL_ROUTER_ON' => true, //开启路由
    'URL_ROUTE_RULES' => array(
    	//管理前端路由
    	'/^bill\/[\w,\d,\_]+$/' => 'Home/Index/index', //账单
    	'/^accounts\/[\w,\d,\_]+$/' => 'Home/Index/index', //账户
    	'/^charts(\/[\w,\d,\_]+)+$/' => 'Home/Index/index', //报表
    	'/^user\/[\w,\d,\_]+$/' => 'Home/Index/index', //用户中心
    ),
);
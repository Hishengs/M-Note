<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>登录</title>
</head>
<body>

<form method="post" action="/postPracticeTest/index.php/Home/User/login_validate">
    用户名：<input type="text" name="name"/><br/>
    密码：<input type="password" name="password"/><br/>
    <input type="submit" value="提交">
</form>
</body>
</html>
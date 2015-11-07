<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title>注册</title>
</head>
<body>
<form method="post" action="/note2/index.php/Home/User/insert">
    用户名：<input type="text" name="name"/><br/>
    密码：<input type="password" name="password"/><br/>
    确认密码：<input type="password" name="rePassword"/><br/>
    邮箱：<input type="text" name="email"/><br/>
    <input type="submit" value="提交">
</form>
</body>
</html>
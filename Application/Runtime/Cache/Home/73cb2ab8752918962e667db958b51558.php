<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
<form method="post" action="/postPractice/index.php/Home/User/update">
    用户名：<input type="text" name="name" value="<?php echo ($now_user["name"]); ?>"/><br/>
    密码：<input type="password" name="password"/><br/>
    确认密码：<input type="password" name="rePassword"/><br/>
    邮箱：<input type="text" name="email" value="<?php echo ($now_user["email"]); ?>"/><br/>
    <input type="submit" value="提交">
</form>
</body>
</html>
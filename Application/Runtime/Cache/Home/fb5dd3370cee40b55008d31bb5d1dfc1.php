<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head lang="en">
    <meta charset="UTF-8">
    <title></title>
</head>
<body>
    <table>
        <tr>
            <td>用户名：</td>
            <td><input type="text" name="name" value="<?php echo ($user_info["name"]); ?>"/></td>
        </tr>
        <tr>
            <td>邮箱：</td>
            <td><input type="text" name="email" value="<?php echo ($user_info["email"]); ?>"/></td>
        </tr>
        <tr>
            <td><a href="edit">修改信息</a></td>
        </tr>
    </table>
</body>
</html>
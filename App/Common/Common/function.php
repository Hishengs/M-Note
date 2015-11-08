<?php
/**
*一些常用的工具函数
*Created by Hisheng 2015/11/7
*/
//get random str of $bit bits 生成特定位数的随机字符串
function get_random_str($bit){
    $str="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $key = "";
    for($i=0;$i<$bit;$i++)
      $key .= $str{mt_rand(0,32)};    
    return $key;
}
//check email format
function check_email_format($email){
  $patten="/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/";
  if(preg_match($patten,$email))return true;
  else return false;
}
//check username format
function check_username_format($username){
  $patten="/^([a-z,A-Z,\x{4e00}-\x{9fa5}])([\w,\d,\x{4e00}-\x{9fa5},_])*$/u";
  if(preg_match($patten,$username))return true;
  else return false;
}
<?php
namespace Home\Controller;
use Think\Controller;
class UserController extends Controller {

    //注册
    public function register(){
        $User = D('User');
        if($User->create()) {
            $result = $User->add();
            if($result) {
                    $this->ajaxReturn(array('error'=>0),json);
                }else{
                    $this->ajaxReturn(array('error'=>1,'msg'=>'注册失败！请稍候重试！'),json);
            }
        }else{
            $this->error($User->getError());
        }
    }

    //登录
    public function login(){
        /*$User = M('User');

        $name = I('post.name');
        $password = I('post.password','','md5');

        $condition = array(
            'name' => $name,
            'password' => $password
        );

        $user = $User->where($condition)->limit(1)->select()[0];

        if($user){
            session('uid',$user['id']);
            //$this->success('登录成功！','uinfo',2);
            $this->ajaxReturn(array('error'=>0),json);
        }else{
            //$this->error('登录失败！请检查用户名或者密码！');
            $this->ajaxReturn(array('error'=>1,'msg'=>'登录失败！请检查用户名或者密码！'),json);
        }*/
        $this->ajaxReturn(array('error'=>0),json);
    }

    //修改信息
    public function edit(){
        $User = M('User');
        $this->assign('now_user',$User->find(session('uid')));
        $this->display("edit");
    }
    //
    public function update(){
        $User = D('User');
        if($User->create()) {
            $result = $User->save();
            if($result) {
                $this->success('操作成功！');
            }else{
                $this->error('写入错误！');
            }
        }else{
            $this->error($User->getError());
        }
    }

    //个人信息显示
    public function uinfo(){
        $User = M('User');
        $this->assign('user_info',$User->find(session('uid')));
        $this->display();
    }

    public function upload_user_avatar(){
    	$this->ajaxReturn(array('error'=>0,url=>'https://dn-lanbaidiao.qbox.me/avatar_1000_a645761e1fc399f5be08308eacead7ce?imageView2/1/w/80/h/80'),json);
    }

    public function modify_user_basic_info(){
    	$username = I('post.username');
    	$email = I('post.user_email');
    	if(empty($username))$this->ajaxReturn(array('error'=>1,'msg'=>'用户名不能为空！'),json);
    	if(empty($email))$this->ajaxReturn(array('error'=>1,'msg'=>'邮箱不能为空！'),json);
    	$this->ajaxReturn(array('error'=>0,'data'=>array('username'=>$username,'email'=>$email)),json);
    }
    public function modify_user_password(){
    	$old_password = I('post.old_password');
    	$new_password = I('post.new_password');
    	$password_confirm = I('post.password_confirm');
    	$this->ajaxReturn(array('error'=>0,'data'=>array('old_password'=>$old_password,'new_password'=>$new_password,'password_confirm'=>$password_confirm)),json);
    }
    public function logout(){
    	$this->ajaxReturn(array('error'=>0),json);
    }
   	public function get_location(){
   		$curl = curl_init();
   		$url = "http://api.map.baidu.com/location/ip?ak=Zam5C9aBBGepyAEvTLN566X4";
   		curl_setopt($curl, CURLOPT_URL, $url);
   		curl_setopt($curl, CURLOPT_HEADER, 1);
   		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
   		$data = curl_exec($curl);
   		$this->ajaxReturn(array('error'=>0,'location'=>$data),json);
   	}
}
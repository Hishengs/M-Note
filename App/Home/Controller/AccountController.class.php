<?php
namespace Home\Controller;
use Think\Controller;

class AccountController extends Controller {

    private $account_model;
    private $account_type_model;

    function __construct(){
        parent::__construct();
        $this->account_model = D('Account');
        $this->account_type_model = D('AccountType');
    }

    //获取用户相关的账户信息
    public function get_user_accounts(){
        $user_id = session('user_id');
        $accounts = array();
        //选择所有的账户类型(共有的账户类型+该用户创建的账户类型)
        $sql = "SELECT * FROM account_type WHERE account_type_creater_id=0 OR account_type_creater_id=".$user_id;
        $account_types = $this->account_type_model->query($sql);
        //根据账户类型遍历子账户
        foreach ($account_types as $key => $account_type) {
        	$cdt['account_type_id'] = $account_type['account_type_id'];
        	$cdt['account_user_id'] = $user_id;
        	$result = $this->account_model->where($cdt)->select();
        	if($result != false){
        		$account = array('account_type'=>$account_type,'child_accounts'=>$result);
        		array_push($accounts, $account);
        	}
        }
        $this->ajaxReturn(array('error'=>0,'accounts'=>$accounts));
    }
    //获取单个账户的信息
    public function get_account_info(){
    	$account_id = I('get.account_id');
    	$cdt['account_id'] = $account_id;
    	$cdt['account_user_id'] = session('user_id');
    	$account = $this->account_model->where($cdt)->find();
    	if($account != false)$this->ajaxReturn(array('error'=>0,'account'=>$account));
    	else $this->ajaxReturn(array('error'=>1,'msg'=>'账户信息获取失败！'));
    }

}
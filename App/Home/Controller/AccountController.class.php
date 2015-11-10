<?php
namespace Home\Controller;
use Think\Controller;

class AccountController extends Controller {

    private $child_account_model;
    private $account_model;

    function __construct(){
        parent::__construct();
        $this->child_account_model = D('ChildAccount');
        $this->account_model = D('Account');
        $this->user_id = session('user_id');
    }

    //获取用户相关的账户信息
    public function get_user_accounts(){
        $user_id = session('user_id');
        $account_items = array();
        //选择所有的账户类型
        $sql = "SELECT * FROM account WHERE account_user_id=".$user_id;
        $accounts = $this->account_model->query($sql);
        //根据账户类型遍历子账户
        foreach ($accounts as $key => $account) {
        	$cdt['account_id'] = $account['account_id'];
        	$cdt['account_user_id'] = $user_id;
        	$child_accounts = $this->child_account_model->where($cdt)->select();
        	if($child_accounts){
        		$account_item = array('account'=>$account,'child_accounts'=>$child_accounts);
        		array_push($account_items, $account_item);
        	}
        }
        $this->ajaxReturn(array('error'=>0,'account_items'=>$account_items));
    }
    //获取单个账户的信息
    public function get_account_info(){
    	$account_id = I('get.account_id');
    	$cdt['child_account_id'] = $account_id;
    	$cdt['child_account_user_id'] = session('user_id');
    	$child_account = $this->child_account_model->where($cdt)->find();
    	if($child_account)$this->ajaxReturn(array('error'=>0,'child_account'=>$child_account));
    	else $this->ajaxReturn(array('error'=>1,'msg'=>'账户信息获取失败！'));
    }
    //添加账户
    public function add_account(){
        $is_self_defined = I('post.is_self_defined');
        $account = I('post.account');
        $child_account_name = I('post.child_account_name');
        $child_account_balance = I('post.added_child_account_balance');
        $child_account_remarks = I('post.child_account_remarks');
        //查询是否存在属于该用户的同名二级账户
        $cdt = array('child_account_name'=>$child_account_name,'child_account_user_id'=>$this->user_id);
        if(!$this->child_account_model->where($cdt)->find()){
            if($is_self_defined){//自定义的一级账户
                //查询是否存在属于该用户的同名一级账户
                $cdt = array('account_name'=>$account,'account_user_id'=>$this->user_id);
                if(!$this->account_model->where($cdt)->find()){
                    //添加一级账户
                    $account_id = $this->account_model->add($cdt);
                    if($account_id){
                        //添加子账户
                        $child_account = array('child_account_user_id'=>$this->user_id,'account_id'=>$account_id,'child_account_name'=>$child_account_name,
                            'child_account_balance'=>$child_account_balance,'child_account_remarks'=>$child_account_remarks);
                        if($this->child_account_model->add($child_account))$this->ajaxReturn(array('error'=>0,'msg'=>'账户添加成功！'));
                        else $this->ajaxReturn(array('error'=>1,'msg'=>'账户添加失败！'));
                    }else $this->ajaxReturn(array('error'=>1,'msg'=>'账户添加失败！'));
                }else $this->ajaxReturn(array('error'=>1,'msg'=>'已存在同名的一级账户！'));
            }else{
                //添加子账户
                $child_account = array('child_account_user_id'=>$this->user_id,'account_id'=>$account,'child_account_name'=>$child_account_name,
                    'child_account_balance'=>$child_account_balance,'child_account_remarks'=>$child_account_remarks);
                if($this->child_account_model->add($child_account))$this->ajaxReturn(array('error'=>0,'msg'=>'账户添加成功！'));
                else $this->ajaxReturn(array('error'=>1,'msg'=>'账户添加失败！'));
            }
        }else $this->ajaxReturn(array('error'=>1,'msg'=>'已存在同名的二级账户！'));
    }

}
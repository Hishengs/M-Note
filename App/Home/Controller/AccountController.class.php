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
    //获取单个账户的信息，联表查询流入流出信息
    /**
    *S余额,b账户开始金额(即account_balance),in流入,out流出
    *S = b - (in-out)
    *最终返回的是S,in,out
    **/
    public function get_account(){
    	$account_id = I('post.account_id');
        $cdt = array('child_account_user_id'=>$this->user_id,'child_account_id'=>$account_id);
        $child_account = $this->child_account_model->relation('bills')->where($cdt)->find();
    	if($child_account !== false)$this->ajaxReturn(array('error'=>0,'account'=>$child_account));
    	else $this->ajaxReturn(array('error'=>1,'msg'=>'账户信息获取失败！'));
    }
    //添加账户
    public function add_account(){
        $is_self_defined = I('post.is_self_defined');
        $account = I('post.account');
        $child_account_name = I('post.child_account_name');
        $child_account_balance = I('post.child_account_balance');
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
    //获取账户列表
    public function get_account_list(){
        $cdt = array('account_user_id'=>$this->user_id);
        $accounts = $this->account_model->relation('child_accounts')->where($cdt)->select();
        foreach ($accounts as $key => $account) {
            foreach ($account['child_accounts'] as $key2 => $child_account) {
                $cdt = array('child_account_user_id'=>$this->user_id,'child_account_id'=>$child_account['child_account_id']);
                $child_account_bills = $this->child_account_model->relation('bills')->where($cdt)->find()['bills'];
                //计算该账户的流入流出
                $out = $in = 0;
                foreach ($child_account_bills as $key3 => $child_account_bill) {
                    if($child_account_bill['bill_type'] == 1){//支出
                        $out += $child_account_bill['bill_sum'];
                    }else $in += $child_account_bill['bill_sum'];
                }
                $accounts[$key]['child_accounts'][$key2]['flow_out'] = $out;
                $accounts[$key]['child_accounts'][$key2]['flow_in'] = $in;
            }
        }
        $this->ajaxReturn(array('error'=>0,'account_list'=>$accounts));
    }
    //修改一级账户
    public function modify_account(){
        $account_name = I('post.account_name');
        $account_id = I('post.account_id');
        $account = array('account_name'=>$account_name);
        $cdt['account_id'] = $account_id;
        if($this->account_model->where($cdt)->save($account))$this->ajaxReturn(array('error'=>0,'msg'=>'账户修改成功！'));
        else $this->ajaxReturn(array('error'=>1,'msg'=>'账户修改失败！'));
    }
    //修改二级账户
    public function modify_child_account(){
        $child_account_name = I('post.child_account_name');
        $child_account_id = I('post.child_account_id');
        $child_account_balance = I('post.child_account_balance');
        $child_account_remarks = I('post.child_account_remarks');
        $account = array('child_account_name'=>$child_account_name,'child_account_balance'=>$child_account_balance,'child_account_remarks'=>$child_account_remarks);
        $cdt['child_account_id'] = $child_account_id;
        if($this->child_account_model->where($cdt)->save($account))$this->ajaxReturn(array('error'=>0,'msg'=>'账户修改成功！'));
        else $this->ajaxReturn(array('error'=>1,'msg'=>'账户修改失败！'));
    }
    //删除账户
    public function delete_account(){
        $account_id = I('post.account_id');
        $type = I('post.type');
        if($type == 1){//删除一级账户
            //先删除所有子账户
            $cdt = array('account_id'=>$account_id,'child_account_user_id'=>$this->user_id);
            if($this->child_account_model->where($cdt)->delete()){
                $cdt = array('account_id'=>$account_id,'account_user_id'=>$this->user_id);
                if($this->account_model->where($cdt)->delete())$this->ajaxReturn(array('error'=>0,'msg'=>'一级账户删除成功！'));
                else $this->ajaxReturn(array('error'=>1,'msg'=>'一级账户删除失败！'));
            }
            else $this->ajaxReturn(array('error'=>1,'msg'=>'账户删除失败！'));
        }else{//删除二级账户
            $cdt = array('child_account_id'=>$account_id,'child_account_user_id'=>$this->user_id);
            if($this->child_account_model->where($cdt)->delete())$this->ajaxReturn(array('error'=>0,'msg'=>'二级账户删除成功！'));
            else $this->ajaxReturn(array('error'=>1,'msg'=>'二级账户删除失败！'));
        }
    }
}



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
        $this->transfer_model = D('Transfer');
    }

    //获取用户相关的账户信息
    public function get_basic_account_items(){
        $user_id = session('user_id');
        $cdt = array('account_user_id'=>$user_id);
        $account_items = $this->account_model->where($cdt)->relation('child_accounts')->select();
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
        //$account_id = 1;
        $cdt = array('child_account_user_id'=>$this->user_id,'child_account_id'=>$account_id);
        $child_account = $this->child_account_model->relation('bills')->where($cdt)->find();
    	if($child_account !== false){
            //计算流入流出
            $child_account['flow_out'] = 0;
            $child_account['flow_in'] = 0;
            foreach($child_account['bills'] as $i => $bill){
                if($bill['bill_type'] == 1){
                    $child_account['flow_out'] += $bill['bill_sum'];
                }else  $child_account['flow_in'] += $bill['bill_sum'];
            }
            $this->ajaxReturn(array('error'=>0,'account'=>$child_account));
        }
    	else $this->ajaxReturn(array('error'=>1,'msg'=>'账户信息获取失败！'));
    }
    protected function _get_account($account_id){
        $cdt = array('child_account_user_id'=>$this->user_id,'child_account_id'=>$account_id);
        $child_account = $this->child_account_model->relation('bills')->where($cdt)->find();
        if($child_account !== false){
            //计算流入流出
            $child_account['flow_out'] = 0;
            $child_account['flow_in'] = 0;
            foreach($child_account['bills'] as $i => $bill){
                if($bill['bill_type'] == 1){
                    $child_account['flow_out'] += $bill['bill_sum'];
                }else  $child_account['flow_in'] += $bill['bill_sum'];
            }
            return $child_account;
        }
        else return false;
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
    public function get_detailed_account_items($param_date=null){
        //$start_date = I('post.start_date');
        $post_end_date = I('post.end_date');
        if(!empty($post_end_date))$end_date = $post_end_date;
        else if(!empty($param_date))$end_date = $param_date;
        
        $cdt = array('account_user_id'=>$this->user_id);
        $accounts = $this->account_model->relation('child_accounts')->where($cdt)->select();
        foreach ($accounts as $key => $account) {
            $accounts[$key]['account_balance'] = $accounts[$key]['flow_out'] = $accounts[$key]['flow_in'] = 0;
            foreach ($account['child_accounts'] as $key2 => $child_account) {
                $cdt = array('child_account_user_id'=>$this->user_id,'child_account_id'=>$child_account['child_account_id']);
                $child_account_bills = $this->child_account_model->relation('bills')->where($cdt)->find()['bills'];
                //计算该账户的流入流出
                $out = $in = 0;
                if($end_date){//如果有時間限制
                    foreach ($child_account_bills as $key3 => $child_account_bill) {
                        if($child_account_bill['bill_time'] <= $end_date){
                            if($child_account_bill['bill_type'] == 1){//支出
                                $out += $child_account_bill['bill_sum'];
                            }else $in += $child_account_bill['bill_sum'];
                        }else continue;
                    }
                }else{
                    foreach ($child_account_bills as $key3 => $child_account_bill) {
                        if($child_account_bill['bill_type'] == 1){//支出
                            $out += $child_account_bill['bill_sum'];
                        }else $in += $child_account_bill['bill_sum'];
                    }
                }
                
                $accounts[$key]['child_accounts'][$key2]['flow_out'] = $out;
                $accounts[$key]['child_accounts'][$key2]['flow_in'] = $in;
                //计算父账户的余额，流入流出
                $accounts[$key]['account_balance'] += $accounts[$key]['child_accounts'][$key2]['child_account_balance'];
                $accounts[$key]['flow_out'] += $accounts[$key]['child_accounts'][$key2]['flow_out'];
                $accounts[$key]['flow_in'] += $accounts[$key]['child_accounts'][$key2]['flow_in'];
            }
        }
        if($param_date!==null)return $accounts;
        else
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
        $child_account_remarks = I('post.child_account_remarks');
        $child_account_balance = I('post.child_account_balance');//这一部分应该是新增一条账单
        $bill_type = $child_account_balance<0?1:2;
        $bill = array('bill_user_id'=>$this->user_id,'bill_type'=>$bill_type,'bill_category_id'=>-$bill_type,
        'bill_account_id'=>$child_account_id,'bill_time'=>date("Y-m-d H:i:s"),
        'bill_location'=>'系统','bill_sum'=>abs($child_account_balance),
        'bill_remarks'=>$child_account_remarks);
        $bill_model = D('Bill');
        $res = $bill_model->add($bill);
        $account = array('child_account_name'=>$child_account_name,'child_account_remarks'=>$child_account_remarks);
        $cdt['child_account_id'] = $child_account_id;
        if($this->child_account_model->where($cdt)->save($account) && $res)$this->ajaxReturn(array('error'=>0,'msg'=>'账户修改成功！'));
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
    //转账
    public function transfer(){
        $out_account_id = I('post.out_account');
        $in_account_id = I('post.in_account');
        $transfer_num = I('post.transfer_num');//转账的数目
        $transfer_remarks = I('post.transfer_remarks');//转账备注
        //先判断是否有足够的转账余额
        $account = $this->_get_account($out_account_id);
        $balance = $account['balance'] + $account['flow_in'] - $account['flow_out'];
        if(empty($account) || $balance < $transfer_num)
            $this->ajaxReturn(array('error'=>1,'msg'=>'当前余额为 '.$balance.' 元，没有足够的转账余额！','balance'=>$balance,'transfer_num'=>$transfer_num));
        else{
            /*$cdt = array('child_account_user_id'=>$this->user_id,'child_account_id'=>$in_account_id);//转入
            $res1 = $this->child_account_model->where($cdt)->setInc('child_account_balance',$transfer_num);
            $cdt = array('child_account_user_id'=>$this->user_id,'child_account_id'=>$out_account_id);//转出
            $res2 = $this->child_account_model->where($cdt)->setDec('child_account_balance',$transfer_num);*/
            //生成2條賬單，1條是支出賬單，1條是收入賬單
            $bill_time = date("Y-m-d H:i:s");
            $bill_model = D('Bill');
            $outcome_bill = array('bill_user_id'=>$this->user_id,'bill_type'=>1,'bill_category_id'=>-1,
            'bill_account_id'=>$out_account_id,'bill_time'=>$bill_time,
            'bill_location'=>'系统','bill_sum'=>$transfer_num,
            'bill_remarks'=>$transfer_remarks);
            $res1 = $bill_model->add($outcome_bill);
            $income_bill = array('bill_user_id'=>$this->user_id,'bill_type'=>2,'bill_category_id'=>-2,
            'bill_account_id'=>$in_account_id,'bill_time'=>$bill_time,
            'bill_location'=>'系统','bill_sum'=>$transfer_num,
            'bill_remarks'=>$transfer_remarks);
            $res2 = $bill_model->add($income_bill);
            //同时生成一条轉賬記錄插入
            $transfer = array('out_account_id'=>$out_account_id,'in_account_id'=>$in_account_id,'transfer_num'=>$transfer_num,'transfer_remarks'=>$transfer_remarks);
            $this->transfer_model->add($transfer);
            if($res1 && $res2)$this->ajaxReturn(array('error'=>0,'msg'=>'转账成功！','balance'=>$balance,'transfer_num'=>$transfer_num));
            else $this->ajaxReturn(array('error'=>1,'msg'=>'转账失败！'));
        }
    }
}



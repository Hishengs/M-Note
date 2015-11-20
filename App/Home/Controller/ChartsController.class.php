<?php
namespace Home\Controller;
use Think\Controller;
class ChartsController extends Controller {

	private $bill_model;
    private $child_bill_category_model;
    private $bill_category_model;

    function __construct(){
        parent::__construct();
        $this->bill_model = D('Bill');
        $this->child_bill_category_model = D('ChildBillCategory');
        $this->bill_category_model = D('BillCategory');
        $this->user_id = session('user_id');
    }

    public function index(){
        echo "Hello";
    }
    //获取分布图数据
    public function get_distribute_data(){
    	$cdt = I('post.cdt');
    	if($cdt['distribute'] == '0'){
    		//账户
	    	$bills = $this->bill_model->alias("b")->field("b.bill_type,b.bill_account_id,sum(b.bill_sum) as bills_sum,ca.child_account_name")
	    	->JOIN("child_account as ca ON b.bill_account_id=ca.child_account_id AND b.bill_user_id=$this->user_id AND DATE_FORMAT(b.bill_time,'%Y-%m-%d') BETWEEN '".$cdt['start_date']."' AND '".$cdt['end_date']."'")
	    	->group("b.bill_type,b.bill_account_id")->select();
    	}else if($cdt['distribute'] == '1'){
    		//分类
	    	$bills = $this->bill_model->alias("b")->field("b.bill_type,sum(b.bill_sum) as bills_sum,cba.child_bill_category_name")
	    	->JOIN("child_bill_category as cba ON b.bill_category_id=cba.child_bill_category_id AND b.bill_user_id=$this->user_id AND DATE_FORMAT(b.bill_time,'%Y-%m-%d') BETWEEN '".$cdt['start_date']."' AND '".$cdt['end_date']."'")
	    	->group("b.bill_type,b.bill_category_id")->select();
    	}
    	if($bills!==false)
    		$this->ajaxReturn(array('error'=>0,'bills'=>$bills));
    	else $this->ajaxReturn(array('error'=>1,'msg'=>'查询失败！'));
    }
    //获取收支对比
    public function get_compare_data(){
    	$cdt = I('post.cdt');
    	$bills = $this->bill_model->alias('b')->field('b.bill_type,sum(b.bill_sum) as bills_sum')->where("DATE_FORMAT(b.bill_time,'%Y-%m-%d') BETWEEN '".$cdt['start_date']."' AND '".$cdt['end_date']."'")
    	->group("b.bill_type")->select();
    	if($bills!==false)
    		$this->ajaxReturn(array('error'=>0,'bills'=>$bills));
    	else $this->ajaxReturn(array('error'=>1,'msg'=>'查询失败！'));
    }
    //获取收支趋势数据
    public function get_trend_data(){
    	$cdt = I('post.cdt');
    	//获取支出数据
    	$outcome_bills = $this->bill_model->alias('b')->field("b.bill_type,b.bill_sum,DATE_FORMAT(b.bill_time,'%Y-%m-%d') as bill_time")
    	->where("DATE_FORMAT(b.bill_time,'%Y-%m-%d') BETWEEN '".$cdt['start_date']."' AND '".$cdt['end_date']."' AND b.bill_type=1")
    	->group("DATE_FORMAT(b.bill_time,'%Y-%m-%d')")->select();
    	//获取收入数据
    	$income_bills = $this->bill_model->alias('b')->field("b.bill_type,b.bill_sum,DATE_FORMAT(b.bill_time,'%Y-%m-%d') as bill_time")
    	->where("DATE_FORMAT(b.bill_time,'%Y-%m-%d') BETWEEN '".$cdt['start_date']."' AND '".$cdt['end_date']."' AND b.bill_type=2")
    	->group("DATE_FORMAT(b.bill_time,'%Y-%m-%d')")->select();
    	if($bills!==false)
    		$this->ajaxReturn(array('error'=>0,'outcome_bills'=>$outcome_bills,'income_bills'=>$income_bills));
    	else $this->ajaxReturn(array('error'=>1,'msg'=>'查询失败！'));
    }
}
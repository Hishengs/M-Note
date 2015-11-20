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
    	//$sql = "SELECT b.bill_account_id,sum(b.bill_sum) as account_sum,ca.child_account_name FROM `bill` as b JOIN child_account as ca ON b.bill_account_id=ca.child_account_id group by b.bill_account_id";
    	//$bills = $this->bill_model->query($sql);." AND DATE_FORMAT(b.bill_time,'Y%-%m-%d') BETWEEN ".$cdt['start_date']." AND ".$cdt['end_date']
    	$bills = $this->bill_model->alias("b")->field("b.bill_type,b.bill_account_id,sum(b.bill_sum) as account_sum,ca.child_account_name")
    	->JOIN("child_account as ca ON b.bill_account_id=ca.child_account_id AND b.bill_user_id=$this->user_id AND DATE_FORMAT(b.bill_time,'%Y-%m-%d') BETWEEN '".$cdt['start_date']."' AND '".$cdt['end_date']."'")
    	->group("b.bill_type,b.bill_account_id")->select();
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
}
<?php
namespace Home\Controller;
use Think\Controller;
class ChartsController extends Controller {

	private $bill_model;
    private $child_bill_category_model;
    private $bill_category_model;
    private $account_model;
    private $child_account_model;

    function __construct(){
        parent::__construct();
        $this->bill_model = D('Bill');
        $this->child_bill_category_model = D('ChildBillCategory');
        $this->bill_category_model = D('BillCategory');
        $this->account_model = D('Account');
        $this->child_account_model = D('ChildAccount');
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
        $date_of_start_date = getdate(strtotime($cdt['start_date']));
        $date_of_end_date = getdate(strtotime($cdt['end_date']));
        //条件
        switch ($cdt['time_unit']) {
            case 2://单位为月
                //$sql = " year(b.bill_time)=".$date_of_start_date['year']." and month(b.bill_time) between ".$date_of_start_date['mon']." and ".$date_of_end_date['mon']." group by month(b.bill_time) ";
                $groupby = "DATE_FORMAT(b.bill_time,'%Y-%m')";
                $field = "month(b.bill_time) as time_unit,";
                break;
            case 3://单位为年
                //$sql = " year(bill_time) between ".$date_of_start_date['year']." and ".$date_of_end_date['year']." ";
                $groupby = "DATE_FORMAT(b.bill_time,'%Y')";
                $field = "year(b.bill_time) as time_unit,";
                break;
            case 1://单位为天
            default:
                //$sql = "";
                $groupby = "DATE_FORMAT(b.bill_time,'%Y-%m-%d')";
                $field = "day(b.bill_time) as time_unit,";
                break;
        }
    	//获取支出数据
    	$outcome_bills = $this->bill_model->alias('b')->field($field."b.bill_type,b.bill_sum,DATE_FORMAT(b.bill_time,'%Y-%m-%d') as bill_time")
    	->where("DATE_FORMAT(b.bill_time,'%Y-%m-%d') BETWEEN '".$cdt['start_date']."' AND '".$cdt['end_date']."' AND b.bill_type=1")
    	->group($groupby)->select();
    	//获取收入数据
    	$income_bills = $this->bill_model->alias('b')->field($field."b.bill_type,b.bill_sum,DATE_FORMAT(b.bill_time,'%Y-%m-%d') as bill_time")
    	->where("DATE_FORMAT(b.bill_time,'%Y-%m-%d') BETWEEN '".$cdt['start_date']."' AND '".$cdt['end_date']."' AND b.bill_type=2")
    	->group($groupby)->select();
    	if($bills!==false)
    		$this->ajaxReturn(array('error'=>0,'outcome_bills'=>$outcome_bills,'income_bills'=>$income_bills));
    	else $this->ajaxReturn(array('error'=>1,'msg'=>'查询失败！'));
    }
    //获取资产分布数据
    public function get_property_distribute_data(){
        $end_date = I('post.end_date');
        if($accounts = A('Account')->get_detailed_account_items($end_date))
            $this->ajaxReturn(array('error'=>0,'account_items'=>$accounts,'end_date'=>$end_date));
        else $this->ajaxReturn(array('error'=>1,'msg'=>'资产分布数据获取失败！'));
    }
}
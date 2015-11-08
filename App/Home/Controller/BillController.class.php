<?php
namespace Home\Controller;
use Think\Controller;

class BillController extends Controller {

    private $bill_model;
    private $bill_category_model;
    private $bill_category_type_model;

    function __construct(){
        parent::__construct();
        $this->bill_model = D('Bill');
        $this->bill_category_model = D('BillCategory');
        $this->bill_category_type_model = D('BillCategoryType');
        $this->user_id = session('user_id');
    }

    //获取用户相关账单分类信息
    public function get_user_bill_categories(){
        $type = I('get.type');
        $type = $type=='outcome'?1:2;
        $user_id = session('user_id');
        $bill_categories = array();
        //选择所有的账户一级分类(共有的一级分类+该用户创建的一级分类)
        $sql = "SELECT * FROM bill_category_type WHERE bill_type=".$type." AND bill_category_type_creater_id=0 OR bill_category_type_creater_id=".$user_id;
        $bill_category_types = $this->bill_category_type_model->query($sql);
        //根据一级分类遍历二级分类
        foreach ($bill_category_types as $key => $bill_category_type) {
            $cdt['bill_category_type_id'] = $bill_category_type['bill_category_type_id'];
            $cdt['bill_category_user_id'] = $user_id;
            $cdt['bill_type'] = $type;
            $result = $this->bill_category_model->where($cdt)->select();
            if($result != false){
                $bill_category = array('bill_category_type'=>$bill_category_type,'child_bill_categories'=>$result);
                array_push($bill_categories, $bill_category);
            }
        }
        $this->ajaxReturn(array('error'=>0,'bill_categories'=>$bill_categories));
    }
    //新增账单
    public function add_bill(){
        $user_id = session('user_id');
        $bill_type = I('post.bill_type');//支出?收入
        $bill_category_id = I('post.bill_category_id');//分类ID
        $bill_account_id = I('post.bill_account_id');//账户ID
        $bill_time = I('post.bill_time');
        $bill_location = I('post.bill_location');
        $bill_sum = I('post.bill_sum');
        $bill_remarks = I('post.bill_remarks');
        $bill = array('bill_user_id'=>$user_id,'bill_type'=>$bill_type,'bill_category_id'=>$bill_category_id,
            'bill_account_id'=>$bill_account_id,'bill_time'=>$bill_time,
            'bill_location'=>$bill_location,'bill_sum'=>$bill_sum,
            'bill_remarks'=>$bill_remarks);
        $result = $this->bill_model->add($bill);
        if($result != false){
            $this->ajaxReturn(array('error'=>0,'bill'=>$bill));
        }else $this->ajaxReturn(array('error'=>0,'msg'=>'账单添加失败！'));
    }
    //获取今日账单
    public function get_today_bills(){
        //$cdt['bill.bill_user_id'] = $this->user_id;
        $bills = $this->bill_model->join("account on bill.bill_account_id = account.account_id")
        ->join("bill_category on bill.bill_category_id = bill_category.bill_category_id")->where("bill.bill_user_id=".$this->user_id)->select();
        //$bills = $this->bill_model->where($cdt)->select();
        if($bills !== false){
            $this->ajaxReturn(array('error'=>0,'bills'=>$bills));
        }else if($bills == NULL)$this->ajaxReturn(array('error'=>2,'msg'=>'今日没有产生账单！'));
        else $this->ajaxReturn(array('error'=>0,'msg'=>'账单获取失败！'));
    }

}
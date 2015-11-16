<?php
namespace Home\Controller;
use Think\Controller;

class BillController extends Controller {

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
    //获取今日账单
    public function get_today_bills(){
        //$cdt['bill.bill_user_id'] = $this->user_id;
        $bills = $this->bill_model->join("child_account on bill.bill_account_id = child_account.child_account_id")
        ->join("child_bill_category on bill.bill_category_id = child_bill_category.child_bill_category_id")->where("bill.bill_user_id=".$this->user_id)->select();
        //$bills = $this->bill_model->where($cdt)->select();
        if($bills){
            $this->ajaxReturn(array('error'=>0,'bills'=>$bills));
        }else if($bills == null)$this->ajaxReturn(array('error'=>2,'msg'=>'今日没有产生账单！'));
        else $this->ajaxReturn(array('error'=>1,'msg'=>'账单获取失败！'));
    }
    //获取用户相关账单分类信息
    public function get_user_bill_categories(){
        $type = I('get.type');
        //$type = $type=='outcome'?1:2;
        $user_id = session('user_id');
        $bill_category_items = array();
        //选择所有的账户一级分类
        $sql = "SELECT * FROM bill_category WHERE bill_type=".$type." AND bill_category_user_id=".$user_id;
        $bill_categories = $this->bill_category_model->query($sql);
        //根据一级分类遍历二级分类
        foreach ($bill_categories as $key => $bill_category) {
            $cdt['bill_category_id'] = $bill_category['bill_category_id'];
            $cdt['bill_category_user_id'] = $user_id;
            $cdt['bill_type'] = $type;
            $child_bill_categories = $this->child_bill_category_model->where($cdt)->select();
            if($child_bill_categories){
                $bill_category_item = array('bill_category'=>$bill_category,'child_bill_categories'=>$child_bill_categories);
                array_push($bill_category_items, $bill_category_item);
            }
        }
        $this->ajaxReturn(array('error'=>0,'bill_category_items'=>$bill_category_items));
    }
    //新增账单
    public function add_bill(){
        $user_id = session('user_id');
        $bill_type = I('post.bill_type');//支出1收入2
        $bill_category_id = I('post.bill_category_id');//子分类ID
        $bill_account_id = I('post.bill_account_id');//子账户ID
        $bill_time = I('post.bill_time');
        $bill_location = I('post.bill_location');
        $bill_sum = I('post.bill_sum');
        $bill_remarks = I('post.bill_remarks');
        //判空
        if(empty($bill_category_id) || empty($bill_account_id) || empty($bill_time) || empty($bill_sum))
            $this->ajaxReturn(array('error'=>1,'msg'=>'请填写完整的账单信息！'));
        $bill = array('bill_user_id'=>$user_id,'bill_type'=>$bill_type,'bill_category_id'=>$bill_category_id,
            'bill_account_id'=>$bill_account_id,'bill_time'=>$bill_time,
            'bill_location'=>$bill_location,'bill_sum'=>$bill_sum,
            'bill_remarks'=>$bill_remarks);
        //在这之前可能还要进行其他操作，例如从账户的余额中增加这笔账，添加流入/流出记录等
        $result = $this->bill_model->add($bill);
        if($result != false){
            $this->ajaxReturn(array('error'=>0,'bill'=>$bill));
        }else $this->ajaxReturn(array('error'=>1,'msg'=>'账单添加失败！'));
    }
    //修改账单
    public function modify_bill(){
        $user_id = session('user_id');
        $bill_id = I('post.bill_id');
        $cdt['bill_id'] = $bill_id;
        $bill_type = I('post.bill_type');//支出1收入2
        $bill_category_id = I('post.bill_category_id');//子分类ID
        $bill_account_id = I('post.bill_account_id');//子账户ID
        $bill_time = I('post.bill_time');
        $bill_location = I('post.bill_location');
        $bill_sum = I('post.bill_sum');
        $bill_remarks = I('post.bill_remarks');
        //判空
        if(empty($bill_category_id) || empty($bill_account_id) || empty($bill_time) || empty($bill_sum))
            $this->ajaxReturn(array('error'=>1,'msg'=>'请填写完整的账单信息！'));
        $bill = array('bill_type'=>$bill_type,'bill_category_id'=>$bill_category_id,
            'bill_account_id'=>$bill_account_id,'bill_time'=>$bill_time,
            'bill_location'=>$bill_location,'bill_sum'=>$bill_sum,
            'bill_remarks'=>$bill_remarks);
        $result = $this->bill_model->where($cdt)->save($bill);
        if($result){
            $this->ajaxReturn(array('error'=>0,'bill'=>$bill));
        }else $this->ajaxReturn(array('error'=>1,'msg'=>'账单修改失败！'));
    }

    //删除账单
    public function delete_bill(){
        $bill_id = I('post.bill_id');
        $cdt['bill_id'] = $bill_id;
        //在这之前可能还要进行其他操作，例如从账户的余额中减去这笔账，添加流入/流出记录等
        if($this->bill_model->where($cdt)->limit(1)->delete())$this->ajaxReturn(array('error'=>0,'msg'=>'删除成功！'));
        else $this->ajaxReturn(array('error'=>1,'msg'=>'删除失败！'));
    }
    //添加账单分类
    public function add_bill_category(){
        $is_self_defined = I("post.is_self_defined");//是否是自定义分类
        $is_self_defined = $is_self_defined=="1"?true:false;
        $bill_type = I("post.bill_type");//收入分类还是支出分类
        $bill_category = I("post.bill_category");//一级分类
        $child_bill_category = I("post.child_bill_category");//二级分类
        //判空
        if(empty($bill_category) || empty($child_bill_category))$this->ajaxReturn(array('error'=>1,'msg'=>'请填写完整的分类信息！'));
        //查询是否存在属于该用户的同名子分类
        $cdt['child_bill_category_name'] = $child_bill_category;
        $cdt['child_bill_category_user_id'] = $this->user_id;
        if($this->child_bill_category_model->where($cdt)->find())$this->ajaxReturn(array('error'=>1,'msg'=>'已存在同名分类！'));
        if(!$is_self_defined){
            $category = array('bill_type'=>$bill_type,'child_bill_category_name'=>$child_bill_category,'child_bill_category_user_id'=>$this->user_id,
                'bill_category_id'=>$bill_category);
            if($this->child_bill_category_model->add($category))$this->ajaxReturn(array('error'=>0,'msg'=>'添加分类成功！'));
            else $this->ajaxReturn(array('error'=>1,'msg'=>'添加分类失败！'));
        }else{//自定义的一级分类
            //查询是否存在属于该用户的同名的一级分类
            $cdt = array();
            $cdt['bill_category_name'] = $bill_category;
            $cdt['bill_category_user_id'] = $this->user_id;
            if($this->bill_category_model->where($cdt)->find())$this->ajaxReturn(array('error'=>1,'msg'=>'已存在同名一级分类！'));
            else{
                //添加一级分类
                $category = array('bill_type'=>$bill_type,'bill_category_name'=>$bill_category,'bill_category_user_id'=>$this->user_id);
                $bill_category_id = $this->bill_category_model->add($category);
                if($bill_category_id){
                    //继续添加二级分类
                    $category = array('bill_type'=>$bill_type,'child_bill_category_name'=>$child_bill_category,'child_bill_category_user_id'=>$this->user_id,
                        'bill_category_id'=>$bill_category_id);
                    if($this->child_bill_category_model->add($category))$this->ajaxReturn(array('error'=>0,'msg'=>'添加分类成功！'));
                    else $this->ajaxReturn(array('error'=>1,'msg'=>'添加分类失败！'));
                }else $this->ajaxReturn(array('error'=>1,'msg'=>'添加分类失败！'));
            }
        }
        
    }

}
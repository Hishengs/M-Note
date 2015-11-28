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
    public function index(){
        echo "Hello,My Friend!";
    }
    //获取今日账单
    public function get_today_bills(){
        //$cdt['bill.bill_user_id'] = $this->user_id;
        //$today = getdate();
        $today = date("Y-m-d");
        $bills = $this->bill_model->join("child_account on bill.bill_account_id = child_account.child_account_id")
        ->join("child_bill_category on bill.bill_category_id = child_bill_category.child_bill_category_id")
        ->where("bill.bill_user_id=".$this->user_id." AND DATE_FORMAT(bill.bill_time,'%Y-%m-%d')='".$today."'")->select();
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
        $cdt  = array('bill_type'=>$type,'bill_category_user_id'=>$user_id);
        $bill_category_items = $this->bill_category_model->where($cdt)->relation('child_bill_categories')->select();
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
        $bill = $this->bill_model->where("bill_id=".$result)->find();
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
    //根据条件查询账单
    public function bill_query(){
        $start_date = I('post.start_date');
        $end_date = I('post.end_date');
        $bill_type = I('post.bill_type');
        $bill_category_id = I('post.bill_category');
        $bill_account_id = I('post.bill_account');
        if(!empty($start_date) && !empty($end_date) && !empty($bill_type)){
            if(intval($bill_type)===3)
                $sql = " AND DATE_FORMAT(bill.bill_time,'%Y-%m-%d') BETWEEN '$start_date' AND '$end_date'";
            else 
                $sql = " AND DATE_FORMAT(bill.bill_time,'%Y-%m-%d') BETWEEN '".$start_date."' AND '".$end_date."' AND bill.bill_type=".$bill_type;
            if(!empty($bill_category_id))$sql = $sql." AND bill.bill_category_id=".$bill_category_id;
            if(!empty($bill_account_id))$sql = $sql." AND bill.bill_account_id=".$bill_account_id;
            $bills = $this->bill_model->join("child_account on bill.bill_account_id = child_account.child_account_id")
            ->join("child_bill_category on bill.bill_category_id = child_bill_category.child_bill_category_id")
            ->where("bill.bill_user_id=".$this->user_id.$sql)->select();
            if($bills !== false)$this->ajaxReturn(array('error'=>0,'bills'=>$bills));
            else $this->ajaxReturn(array('error'=>1,'msg'=>'查询失败！'));
        }else $this->ajaxReturn(array('error'=>1,'msg'=>'查询条件不能为空！'));
    }
    //根据id获取账单
    public function get_bill_by_id(){
        $bill_id = I('get.bill_id');
        $cdt = array('bill.bill_user_id'=>$this->user_id,'bill.bill_id'=>$bill_id);
        $bill = $this->bill_model->join("child_account on bill.bill_account_id = child_account.child_account_id")
                ->join("child_bill_category on bill.bill_category_id = child_bill_category.child_bill_category_id")
                ->where($cdt)->find();
        if($bill !== false){
            $this->ajaxReturn(array('error'=>0,'bill'=>$bill));
        }else $this->ajaxReturn(array('error'=>1,'msg'=>'账单获取失败！'));
    }
    //删除一级分类
    public function delete_bill_category(){
        $bill_category_id = I("post.bill_category_id");
        $cdt = array('bill_category_id'=>$bill_category_id,'child_bill_category_user_id'=>$this->user_id);
        $cdt2 = array('bill_category_id'=>$bill_category_id,'bill_category_user_id'=>$this->user_id);
        //先删除属于该一级分类的二级分类
        if($this->child_bill_category_model->where($cdt)->delete()){
            if($this->bill_category_model->where($cdt2)->delete())
                $this->ajaxReturn(array('error'=>0,'msg'=>'删除成功！'));
            else $this->ajaxReturn(array('error'=>1,'msg'=>'删除失败！'));
        }else $this->ajaxReturn(array('error'=>1,'msg'=>'删除失败！'));
        
    }
    //删除二级分类
    public function delete_child_bill_category(){
        $child_bill_category_id = I("post.child_bill_category_id");
        $cdt = array('child_bill_category_id'=>$child_bill_category_id,'child_bill_category_user_id'=>$this->user_id);
        if($this->child_bill_category_model->where($cdt)->delete())
            $this->ajaxReturn(array('error'=>0,'msg'=>'删除成功！'));
        else $this->ajaxReturn(array('error'=>1,'msg'=>'删除失败！'));
    }
    //修改一级分类
    public function modify_bill_category(){
        $bill_category_id = I("post.bill_category_id");
        $bill_category_name = I("post.bill_category_name");
        $cdt = array('bill_category_id'=>$bill_category_id,'bill_category_user_id'=>$this->user_id);
        $data = array('bill_category_name'=>$bill_category_name);
        if($this->bill_category_model->where($cdt)->save($data))$this->ajaxReturn(array('error'=>0,'msg'=>'修改成功！'));
        else $this->ajaxReturn(array('error'=>1,'msg'=>'修改失败！'));
    }
    //修改二级分类
    public function modify_child_bill_category(){
        $child_bill_category_id = I("post.child_bill_category_id");
        $child_bill_category_name = I("post.child_bill_category_name");
        if(empty($child_bill_category_id) || empty($child_bill_category_name))
            $this->ajaxReturn(array('error'=>1,'msg'=>'请提交完整的信息!','data'=>array('child_bill_category_id'=>$child_bill_category_id,'child_bill_category_name'=>$child_bill_category_name)));
        $cdt = array('child_bill_category_id'=>$child_bill_category_id,'child_bill_category_user_id'=>$this->user_id);
        $data = array('child_bill_category_name'=>$child_bill_category_name);
        if($this->child_bill_category_model->where($cdt)->save($data))$this->ajaxReturn(array('error'=>0,'msg'=>'修改成功！'));
        else $this->ajaxReturn(array('error'=>1,'msg'=>'修改失败！'));
    }
}
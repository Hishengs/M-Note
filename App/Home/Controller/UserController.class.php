<?php
namespace Home\Controller;
use Think\Controller;

class UserController extends Controller {

    private $user_model;

    function __construct(){
        parent::__construct();
        $this->user_model = D('User');
    }

    public function index(){
        echo "Hello World!";
        echo "My id is ".session('user_id');
        //echo getdate(strtotime('2015-11-29'))['year'];
    } 
    //登陆
    public function login(){
        $user_name = I('post.username');
        $user_password = I('post.password');
        //判空
        if(empty($user_name) || empty($user_password))$this->ajaxReturn(array('error'=>1,'msg'=>'用户名或密码不能为空！'));
        else{
            $cdt['user_name'] = $user_name;
            $user = $this->user_model->where($cdt)->find();
            if(!empty($user)){
                $user_salt = $user['user_salt'];//盐值
                $encrypt_times = $user['user_encrypt_times'];//加密次数
                for($i=0;$i<$encrypt_times;$i++)$user_password = md5($user_password.$user_salt);
                if($user_password === $user['user_password']){
                    //记录登陆状态
                    for($i=0;$i<$encrypt_times;$i++)$fingerprint = md5($user_name.$user_salt.time());
                    session('fingerprint',$fingerprint);
                    session('user_id',$user['user_id']);
                    session('username',$user_name);
                    setcookie("fingerprint",$fingerprint,time()+30*24*3600,"/");
                    $this->ajaxReturn(array('error'=>0,'msg'=>'登陆成功！'));
                }
                else $this->ajaxReturn(array('error'=>1,'msg'=>'用户名或密码错误！'));
            }else $this->ajaxReturn(array('error'=>1,'msg'=>'登陆失败，不存在该用户！'));
        }
    }
    //注册
    public function register(){
        $user_name = I('post.username');
        $user_email = I('post.email');
        $user_password = I('post.password');
        $user_password_confirm = I('post.password_confirm');
        //$data = array('user_name'=>$user_name,'user_email'=>$user_email,'user_password'=>$user_password,'user_password_confirm'=>$user_password_confirm);
        //条件判断
        if(empty($user_name)){$this->ajaxReturn(array('error'=>1,'msg'=>'用户名不能为空！'));return;}
        if(empty($user_email)){$this->ajaxReturn(array('error'=>1,'msg'=>'邮箱不能为空！'));return;}
        if(empty($user_password)){$this->ajaxReturn(array('error'=>1,'msg'=>'密码不能为空！'));return;}
        if(!check_username_format($user_name)){$this->ajaxReturn(array('error'=>1,'msg'=>'请检查你的用户名格式！'));return;}//用户名格式验证
        if(!check_email_format($user_email)){$this->ajaxReturn(array('error'=>1,'msg'=>'请检查你的邮箱格式！'));return;}//邮箱格式验证
        if(strlen($user_password) < 6){$this->ajaxReturn(array('error'=>1,'msg'=>'密码不能小于6位！'));return;}//密码长度验证
        if($user_password !== $user_password_confirm){$this->ajaxReturn(array('error'=>1,'msg'=>'两次输入的密码不一致！'));return;}
        //录入操作
        $user_salt = get_random_str(6);//盐值
        $encrypt_times = rand(1,10);//encrypy times 加密次数
        for($i=0;$i<$encrypt_times;$i++)$user_password = md5($user_password.$user_salt);//加密
        $user = array('user_name'=>$user_name,'user_email'=>$user_email,'user_password'=>$user_password,'user_salt'=>$user_salt,'user_encrypt_times'=>$encrypt_times);
        $result = $this->user_model->add($user);
        if($result !== false){
            //初始化用户数据
            $this->_init_user_data($result);
            $this->ajaxReturn(array('error'=>0,'msg'=>'注册成功！'));
        }else $this->ajaxReturn(array('error'=>1,'msg'=>'注册失败！'));
    }
    //判断是否已登陆
    public function is_logined(){
        if(!empty(session('fingerprint'))){
            if(session('fingerprint') === cookie('fingerprint'))return true;
            else return false;
        }else return false;
    }
    //获取用户的基本信息，包括用户名，邮箱，头像地址
    public function get_user_basic_info(){
        $user_id = session('user_id');
        $cdt['user_id'] = $user_id;
        $user = $this->user_model->where($cdt)->field('user_id,user_name,user_email,user_avatar')->find();
        if($user !== false){
            $this->ajaxReturn(array('error'=>0,'user'=>$user,'msg'=>''));
        }else $this->ajaxReturn(array('error'=>1,'msg'=>'用户信息获取失败！'));
    }
    protected function _get_user_basic_info($user_id){
        $cdt['user_id'] = $user_id;
        $user = $this->user_model->where($cdt)->field('user_id,user_name,user_email,user_avatar')->find();
        if($user !== false){
            return $user;
        }else return false;
    }
    //退出登陆/注销
    public function logout(){
        session('fingerprint',null);
        session('user_id',null);
        session('username',null);
        cookie("fingerprint",null);
        $this->ajaxReturn(array('error'=>0,'msg'=>'注销成功！'));
    }
    //上传(修改)用户头像
    public function upload_user_avatar(){
        /*$img = I('post.user_avatar');
        if(empty($img))$this->ajaxReturn(array('error'=>1,'msg'=>'请上传头像！'));*/
        $uploadable_types = array('image/jpg','image/jpeg','image/png','image/gif','image/bmp');//允许上传的图片类型
        $max_img_size = 2097152; //图片最大大小(2M)，单位BYTE
        $dest_path = str_replace("\\", "/", PUBLIC_PATH)."/img/avatar/";//上传路径
        if($_FILES['user_avatar']['error'] == 0){
            //类型验证
            if(!in_array($_FILES['user_avatar']['type'], $uploadable_types))
                $this->ajaxReturn(array('error'=>1,'img'=>$_FILES['user_avatar'],'msg'=>'请检查你上传的图片格式(只允许jpg,png,gif,bmp)！'));
            //大小验证
            if($_FILES['user_avatar']['size'] > $max_img_size)$this->ajaxReturn(array('error'=>1,'msg'=>'图片过大，请限制在2M以内！'));
            //文件后缀
            switch ($_FILES['user_avatar']['type']) {
                case 'image/jpg':
                case 'image/jpeg':
                    $img_ext = ".jpg";
                    break;
                case 'image/png':
                    $img_ext = ".png";
                    break;
                case 'image/gif':
                    $img_ext = ".gif";
                    break;
                case 'image/bmp':
                    $img_ext = ".bmp";
                    break;
                default:
                    $img_ext = ".jpg";
                    break;
            }
            $img_name = md5(time()).$img_ext;
            //保存头像
            if(is_uploaded_file($_FILES['user_avatar']['tmp_name'])){
                if(!move_uploaded_file($_FILES['user_avatar']['tmp_name'], $dest_path.$img_name)){
                    $this->ajaxReturn(array('error'=>1,'msg'=>'头像上传失败[move_uploaded_file]！'));
                }else{
                    //同步数据库
                    $data['user_avatar'] = $img_name;
                    $cdt['user_id'] = session('user_id');
                    if($this->user_model->where($cdt)->save($data) !== false)
                        $this->ajaxReturn(array('error'=>0,'url'=>$img_name,'msg'=>'头像上传成功！'));
                    else $this->ajaxReturn(array('error'=>1,'msg'=>'头像上传出错！[error]'));
                }
            }else $this->ajaxReturn(array('error'=>1,'msg'=>'头像上传失败[is_uploaded_file]！'));
        }else $this->ajaxReturn(array('error'=>1,'msg'=>'头像上传出错！[error]'));
    }
    //修改用户基本信息
    public function modify_user_basic_info(){
        $user_name = I('post.username');
        $user_email = I('post.user_email');
        $cdt['user_id'] = session('user_id');
        if(empty($user_name) && empty($user_email))$this->ajaxReturn(array('error'=>1,'msg'=>'不能提交空信息，请至少修改一项！'));
        if(!empty($user_name) && !empty($user_email))$data = array('user_name'=>$user_name,'user_email'=>$user_email);
        else if(!empty($user_name) && empty($user_email))$data = array('user_name'=>$user_name);
        else if(empty($user_name) && !empty($user_email))$data = array('user_email'=>$user_email);
        $result = $this->user_model->where($cdt)->save($data);
        if($result !== false){
            $this->ajaxReturn(array('error'=>0,'user'=>$this->_get_user_basic_info(session('user_id')),'msg'=>''));
        }else $this->ajaxReturn(array('error'=>1,'msg'=>'用户信息修改失败！'));
    }
    //修改用户密码
    public function modify_user_password(){
        $old_password = I('post.old_password');
        $new_password = I('post.new_password');
        $password_confirm = I('post.password_confirm');
        //$data = array('old_password'=>$old_password,'new_password'=>$new_password,'password_confirm'=>$password_confirm);
        if(empty($new_password) || empty($old_password)){$this->ajaxReturn(array('error'=>1,'msg'=>'密码不能为空！'));return;}
        if(strlen($new_password) < 6){$this->ajaxReturn(array('error'=>1,'msg'=>'密码不能小于6位！'));return;}//密码长度验证
        if($new_password !== $password_confirm){$this->ajaxReturn(array('error'=>1,'msg'=>'两次输入的密码不一致！'));return;}
        $cdt['user_id'] = session('user_id');
        $user = $this->user_model->where($cdt)->find();
        $user_salt = $user['user_salt'];//盐值
        $encrypt_times = $user['user_encrypt_times'];//加密次数
        for($i=0;$i<$encrypt_times;$i++)$old_password = md5($old_password.$user_salt);
        if($old_password !== $user['user_password']){$this->ajaxReturn(array('error'=>1,'msg'=>'旧密码错误！'));return;}
        for($i=0;$i<$encrypt_times;$i++)$new_password = md5($new_password.$user_salt);
        $data['user_password'] = $new_password;
        $result = $this->user_model->where($cdt)->save($data);
        if($result !== false){
            //密码修改后要注销登陆
            session('fingerprint',null);
            session('user_id',null);
            session('username',null);
            cookie("fingerprint",null);
            $this->ajaxReturn(array('error'=>0,'msg'=>'用户密码修改成功！'));
        }else $this->ajaxReturn(array('error'=>1,'msg'=>'用户密码修改失败！'));
    }
    //初始化用户数据
    public function _init_user_data($user_id){
        //$user_id = I("get.user_id");
        //添加默认的一级账单分类和账户类型
        $this->_init_outcome_category_type($user_id);
        $this->_init_income_category_type($user_id);
        $this->_init_account_type($user_id);
        //添加默认的账单分类和账户
        //获取新增的一级分类和账户类型
        $bill_category_type_model = D('BillCategoryType');
        $account_type_model = D('AccountType');
        $cdt = array('bill_category_type_creater_id'=>$user_id,'bill_type'=>1);//支出分类
        $outcome_category_types = $bill_category_type_model->where($cdt)->select();
        $cdt = array('bill_category_type_creater_id'=>$user_id,'bill_type'=>2);//收入分类
        $income_category_types = $bill_category_type_model->where($cdt)->select();
        $cdt = array('account_type_creater_id'=>$user_id);//账户分类
        $account_types = $account_type_model->where($cdt)->select();

        $bill_category_model = M('BillCategory');
        $outcome_category = array(array('衣服裤子','鞋帽包包','化妆饰品'),array('早午晚餐','烟酒茶','水果零食'),
            array('日常用品','水电煤气','房租','物业管理','维修保养'),array('公共交通','打车租车','私家车费用'),
            array('座机费','手机费','上网费','邮寄费'),array('运动健身','腐败聚会','休闲玩乐','宠物宝贝','旅游度假'),
            array('书报杂志','培训进修','数码装备'),array('送礼请客','孝敬家长','还人钱物','慈善捐助'),
            array('药品费','保健费','美容费','治疗费'),array('银行手续','投资亏损','按揭还款','消费税收','利息支出','赔偿罚款'),
            array('其它支出','意外丢失','烂账损失'));
        foreach ($outcome_category as $key => $value) {
            for($i=0;$i<count($value);$i++){
                $data = array('bill_type'=>1,'bill_category_name'=>$value[$i],'bill_category_user_id'=>$user_id,'bill_category_type_id'=>$outcome_category_types[$key]['bill_category_type_id']);
                $bill_category_model->add($data);
            }
        }
        $income_category = array(array('工资收入','利息收入','加班收入','奖金收入','投资收入','兼职收入'),array('礼金收入','中奖收入','意外收入','经营所得'));
        foreach ($income_category as $key => $value) {
            for($i=0;$i<count($value);$i++){
                $data = array('bill_type'=>2,'bill_category_name'=>$value[$i],'bill_category_user_id'=>$user_id,'bill_category_type_id'=>$income_category_types[$key]['bill_category_type_id']);
                $bill_category_model->add($data);
            }
        }
        //添加默认账户
        $account_model = M("Account");
        $account = array(array('现金'),array('信用卡'),array('银行卡'),array('饭卡','支付宝','公交卡'),array('应付款项'),array('公司报销','应收款项'),array('基金账户','余额宝','股票账户'));
        foreach ($account as $key => $value) {
            for($i=0;$i<count($value);$i++){
                $data = array('account_user_id'=>$user_id,'account_type_id'=>$account_types[$key]['account_type_id'],'account_name'=>$value[$i],'account_balance'=>0);
                $account_model->add($data);
            }
        }
    }
    protected function _init_outcome_category_type($user_id){
        $outcome_category_type = array('衣服服饰','食品酒水','居家物业','行车交通','交流通讯','休闲娱乐','学习进修','人情来往','医疗保健','金融保险','其它杂项');
        $bill_category_type_model = M('BillCategoryType');
        foreach ($outcome_category_type as $key => $value) {
            $data = array('bill_type'=>1,'bill_category_type_name'=>$value,'bill_category_type_creater_id'=>$user_id);
            $bill_category_type_model->add($data);
        }
        //echo "outcome_category_type init success!";
    }
    protected function _init_income_category_type($user_id){
        $income_category_type = array('职业收入','其它收入');
        $bill_category_type_model = M('BillCategoryType');
        foreach ($income_category_type as $key => $value) {
            $data = array('bill_type'=>2,'bill_category_type_name'=>$value,'bill_category_type_creater_id'=>$user_id);
            $bill_category_type_model->add($data);
        }
        //echo "income_category_type init success!";
    }
    protected function _init_account_type($user_id){
        $account_type = array('现金账户','信用卡','金融账户','虚拟账户','负债账户','债权账户','投资账户');
        $account_type_model = M('AccountType');
        foreach ($account_type as $key => $value) {
            $data = array('account_type_name'=>$value,'account_type_creater_id'=>$user_id);
            $account_type_model->add($data);
        }
        //echo "account_type init success!";
    }

}
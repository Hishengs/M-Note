表设计

1.用户表 user
user_id 用户ID int primary autoincrement
user_name 用户名 varchar(100) not null
user_email 用户邮箱 varchar(200) not null
user_avatar 用户头像 text null
user_password 用户密码 text not null
user_encrypt_times 加密次数 int not null
user_salt 用户加密的盐值 varchar(6) not null

2.账单 bill
bill_id 账单ID int primary autoincrement
bill_user_id 账单所属用户ID int not null
bill_type 账单类型 tinyint 支出0/收入1
bill_category_id 账单分类ID int not null
bill_account_id 账户ID int not null
bill_time 账单时间 datetime not null
bill_location 账单地点 text null
bill_sum 账单总额 float not null
bill_remarks 账单备注 text null

3.账单-分类 bill_category
bill_type 收入/支出 tinyint not null
bill_category_id 账单分类ID int primary autoincrement
bill_category_name 账单分类名称 varchar(100) not null
bill_category_user_id 账单分类拥有者ID int not null
bill_category_type_id 账单分类类型ID int not null


4.账单-分类-类型 bill_category_type
bill_type 收入/支出 tinyint not null
bill_category_type_id 分类类型ID int not null primary
bill_category_type_name 分类类型名称 varchar(200) not null
bill_category_type_creater_id 分类类型创建者ID int not null 默认0系统创建

5.账户 account
account_id 账户ID int primary autoincrement
account_user_id 账户拥有者ID int not null
account_type_id 账户类型ID int not null
account_name 账户名称 varchar(100) not null
account_balance 账户余额 int not null
account_flow_out 账户流出 int not null 0
account_flow_in 账户流入 int not null 0
account_remarks 账户备注 text null

6.账户-类型 account_type
account_type_id 账户类型ID int not null
account_type_name 账户类型名称 varchar(200) not null
account_type_creater_id 账户类型创建者ID int not null 默认0系统创建
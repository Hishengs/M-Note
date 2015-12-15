<?php
namespace Home\Model;
use Think\Model\RelationModel;
class BillModel extends RelationModel {
    protected $_link = array(
        'ChildBillCategory'=> array(
        	'mapping_type' => self::BELONGS_TO,
        	'class_name'    => 'ChildBillCategory',
        	'mapping_name' => 'child_bill_category',
        	'foreign_key' => 'bill_category_id',
        	//'condition' => 'bill_category_id = child_bill_category_id'
        	),
        'ChildAccount'=> array(
        	'mapping_type' => self::BELONGS_TO,
        	'class_name'    => 'ChildAccount',
        	'mapping_name' => 'child_account',
        	'foreign_key' => 'bill_account_id',
        	//'condition' => 'bill_account_id = child_account_id'
        	),
     );
}
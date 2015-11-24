<?php
namespace Home\Model;
use Think\Model\RelationModel;
class BillCategoryModel extends RelationModel {
    protected $_link = array(
        'ChildBillCategory'=> array(
        	'mapping_type' => self::HAS_MANY,
        	'mapping_name' => 'child_bill_categories',
        	'foreign_key' => 'bill_category_id'
        	)
     );
}
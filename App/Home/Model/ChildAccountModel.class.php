<?php
namespace Home\Model;
use Think\Model\RelationModel;
class ChildAccountModel extends RelationModel {
    protected $_link = array(
        'Bill'=> array(
        	'mapping_type' => self::HAS_MANY,
        	'mapping_name' => 'bills',
        	'foreign_key' => 'bill_account_id'
        	)
     );
}
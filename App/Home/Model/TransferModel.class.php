<?php
namespace Home\Model;
use Think\Model\RelationModel;
class TransferModel extends RelationModel {
    protected $_link = array(
        'ChildAccount'=> array(
        	'mapping_type' => self::HAS_MANY,
        	'mapping_name' => 'child_accounts',
        	'foreign_key' => 'account_id'
        	)
     );
}
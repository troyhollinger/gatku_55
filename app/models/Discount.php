<?php

Namespace Gatku;

use Illuminate\Database\Eloquent\Model;

class Discount extends Model {

    protected $table = 'discounts';

    /**
     * This is force for primary key be different then id
     *
     * @var string
     */
    protected $primaryKey = 'code';

    protected $fillable = [];
}
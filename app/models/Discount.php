<?php

Namespace Gatku;

use Illuminate\Database\Eloquent\Model;

class Discount extends Model {

    protected $table = 'discounts';
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [];
}
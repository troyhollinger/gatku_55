<?php

Namespace Gatku;

use Illuminate\Database\Eloquent\Model;

class Discount extends Model {

    protected $table = 'discounts';
    protected $primaryKey = 'code';
    protected $fillable = [];
}
<?php

Namespace Gatku\Model;

use Illuminate\Database\Eloquent\Model;

class SalesTax extends Model {

    protected $table = 'sales_taxes';
    protected $primaryKey = 'state';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [];
}
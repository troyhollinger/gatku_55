<?php

Namespace Gatku\Model;

use Illuminate\Database\Eloquent\Model;

class AvailabilityType extends Model {
	protected $table = 'availability_types';
	protected $fillable = ['name', 'slug'];
}
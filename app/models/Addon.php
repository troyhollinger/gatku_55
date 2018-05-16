<?php

Namespace Gatku;

use Illuminate\Database\Eloquent\Model;

class Addon extends Model {

	protected $fillable = [];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
	public function product()
    {
		return $this->belongsTo(Product::class, 'childId');
	}
}

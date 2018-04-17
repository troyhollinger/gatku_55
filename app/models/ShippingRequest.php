<?php

Namespace Gatku;

use Illuminate\Database\Eloquent\Model;

class ShippingRequest extends Model {
	
	protected $table = 'shipping_requests';

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
	public function order() {
		return $this->belongsTo(Order::class, 'orderId');
	}
}

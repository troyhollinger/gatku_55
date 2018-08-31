<?php

Namespace Gatku\Model;

use Illuminate\Database\Eloquent\Model;

class ShippingTrack extends Model {
    
	protected $table = 'shipping_tracks';

    /**
     * @return mixed
     */
	public function order() {
		return $this->belongsTo(Order::class, 'orderId');
	}
}

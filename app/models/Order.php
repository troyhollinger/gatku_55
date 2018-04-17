<?php

Namespace Gatku;

use Illuminate\Database\Eloquent\Model;

class Order extends Model {

    protected $fillable = [];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
	public function items()
    {
		return $this->hasMany(OrderItem::class, 'orderId');
	}

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
	public function customer()
    {
		return $this->belongsTo(Customer::class, 'customerId');
	}

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function tracking()
    {
        return $this->hasOne(ShippingTrack::class, 'orderId');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function shipping()
    {
        return $this->hasOne(ShippingRequest::class, 'orderId');
    }
}
<?php

Namespace Gatku;

use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model {

	protected $fillable = [];

	protected $table = 'order_items';

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
	public function addons()
    {
		return $this->hasMany(OrderItemAddon::class, 'orderItemId');
	}

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
	public function product() {
		return $this->belongsTo(Product::class, 'productId');
	}

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
	public function size() {
		return $this->hasOne(Size::class, 'id', 'sizeId');
	}
}

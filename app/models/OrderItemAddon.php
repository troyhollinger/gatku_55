<?php

Namespace Gatku;

use Illuminate\Database\Eloquent\Model;

class OrderItemAddon extends Model {

	protected $table = 'order_item_addons';

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
	public function product()
    {
		return $this->belongsTo(Product::class, 'productId');
	}

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
	public function size() {
		return $this->hasOne(Size::class, 'id', 'sizeId');
	}
}

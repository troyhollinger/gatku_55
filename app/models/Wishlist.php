<?php

Namespace Gatku;

use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model {

	protected $fillable = [];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough
     */
	public function items() {
		return $this->hasManyThrough(Product::class, 'WishlistItem', 'wishlistId', 'productId');
	}
}

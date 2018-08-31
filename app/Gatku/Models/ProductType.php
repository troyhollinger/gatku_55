<?php
Namespace Gatku\Model;

use Illuminate\Database\Eloquent\Model;

class ProductType extends Model {

	protected $table = 'product_types';

	protected $fillable = [];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
	public function products()
    {
		return $this->hasMany(Product::class, 'typeId');
	}
}
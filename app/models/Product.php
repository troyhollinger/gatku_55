<?php

Namespace Gatku;

use Illuminate\Database\Eloquent\Model;

class Product extends Model {

    protected $fillable = [];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function type()
    {
		return $this->belongsTo(ProductType::class, 'typeId');
	}

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
	public function addons()
    {
		return $this->hasMany(Addon::class, 'parentId');
	}

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
	public function orderitems()
    {
		return $this->hasMany(OrderItem::class, 'productId');
	}

    /**
     * @param $startDate
     * @param $endDate
     * @return \Closure
     */
    static public function orderItemsWithParams($startDate, $endDate) {
        return function ($query) use ($startDate, $endDate) {
            $query->whereBetween('created_at', array($startDate, $endDate));
        };
    }

    /**
     * @return $this
     */
	public function images()
    {
		return $this->hasMany(YouImage::class, 'productId', 'id')->orderBy('created_at', 'desc');
	}

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
	public function sizes()
    {
		return $this->hasMany(Size::class, 'productId', 'id');
	}

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
	public function availability()
    {
		return $this->belongsTo(AvailabilityType::class, 'availabilityTypeId');
	}
}
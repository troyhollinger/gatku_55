<?php

Namespace Gatku\Model;

use Illuminate\Database\Eloquent\Model;

class YouImage extends Model {
	protected $table = 'you_images';

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product()
    {
        return $this->belongsTo(Product::class, 'productId');
    }

}

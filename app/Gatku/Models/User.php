<?php

Namespace Gatku\Model;

use Illuminate\Database\Eloquent\Model;

class User extends Model {

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'users';

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = array('password', 'remember_token');

	protected $fillable = ['firstName', 'lastName', 'fullName', 'password', 'email', 'admin'];

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
	public function wishlist()
    {
		return $this->hasOne(Wishlist::class, 'userId');
	}
}

<?php

Namespace Gatku;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Auth\UserTrait;
use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableTrait;
use Illuminate\Auth\Reminders\RemindableInterface;

class User extends Model implements UserInterface, RemindableInterface {

	use UserTrait, RemindableTrait;

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

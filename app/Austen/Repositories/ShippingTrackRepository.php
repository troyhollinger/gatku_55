<?php

namespace Austen\Repositories;

use Gatku\ShippingTrack;
use Mail;
use Stripe_Charge;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;

class ShippingTrackRepository {

	public $blackFriday = false;

	public function store($input)
	{

		try {
			if(!empty($input['trackId'])){
				ShippingTrack::where('id', $input['trackId'])->update(array('track_id' => $input['track_id'], 'carrier' => $input['carrier']));
				$request = ShippingTrack::find($input['trackId']);

			}else{
				$request = new ShippingTrack;
				$request->track_id = $input['track_id'];
				$request->orderId = $input['orderId'];
				$request->carrier = $input['carrier'];
				$request->token = str_random(10);
				$request->save();
			}
			$request->load('order.customer');

			$discount = $this->calculateDiscount($request->order);
			$subtotal = $this->calculateSubTotal($request->order);
			$shipping = $this->calculateShipping($request->order);
			$total = $this->calculateTotal($request->order);

			$this->sendEmail($request, $discount, $subtotal, $shipping, $total);
		} catch (Exception $e) {
            Bugsnag::notifyException($e);
			Log::error($e);
			return false;
		}
		return $request;
	}

	private function calculateSubTotal($order)
	{
		$subtotal = 0;
		$discount = 0;

		$items = $order->items;

		foreach($items as $item) {
			if ($item->product->sizeable && $item->sizeId) {
				$price = $item->size->price;
			} else {
				$price = $item->product->price;
			}

			$price = $price * $item->quantity;

			$subtotal += $price;

			foreach($item->addons as $addon) {
				if ($addon->product->sizeable && $addon->sizeId) {
					$addonPrice = $addon->size->price;
				} else {
					$addonPrice = $addon->product->price;
				}
				$addonPrice = $addonPrice * $addon->quantity;
				$subtotal += $addonPrice;
			}
		}

		$discount = $this->calculateDiscount($order, $subtotal);

		return $subtotal - $discount;
	}

	private function calculateDiscount($order, $subtotal = false)
	{
		$amount = 0;
		$glassCheck = 0;
		$glassPrice = 0;

		if($subtotal && $this->blackFriday) {
			$amount = ($subtotal * 0.2) / 100;
			$amount = ceil($amount) * 100;

			return $amount;
		}

		$items = $order->items;

		foreach($items as $item) {
			if ($item->product->type->slug === 'glass') {
				$glassCheck += $item->quantity;
				$glassPrice = $item->product->price;
			}
			foreach($item->addons as $addon) {
				if ($addon->product->type->slug === 'glass') {
					$glassCheck += $addon->quantity;
				}
			}
		}

		if ($glassCheck >= 4) {
			$amount = ($glassPrice * 4) - 4000;
		}
		Log::info($amount);

		return $amount;
	}


	/**
	 * Calculate the shipping.
	 * There is a similar method in the CartController.js file. These two methods
	 * should produce identical results.
	 *
	 */
	private function calculateShipping($order)
	{
		$shippingPrice = 0;
		$poles = [];
		$heads = [];
		$others = [];

		$items = $order->items;

		if ($this->calculateSubTotal($order) >= 30000) return 0;
		if ($this->blackFriday) return 0;

		foreach($items as $item) {
			if ($item->product->type->slug === 'pole') {
				$poles[] = $item;
			} elseif ($item->product->type->slug === 'head') {
				$heads[] = $item;
			} else {
				$others[] = $item;
			}
		}

		if (count($poles) > 0) {
			$poleShippingPrice = $poles[0]->product->type->shippingPrice;
			if (count($poles) > 1) {
				$shippingPrice = $poleShippingPrice * count($poles);
			} else {
				$shippingPrice = $poleShippingPrice;
			}
		} elseif (count($heads) > 0) {
			$headShippingPrice = $heads[0]->product->type->shippingPrice;
			if (count($heads) > 1) {
				$shippingPrice = $headShippingPrice * ceil(count($heads) / 2);
			} else {
				$shippingPrice = $headShippingPrice;
			}
		} elseif (count($others) > 0) {
			$shippingPrice = $others[0]->product->type->shippingPrice;
		}
		return $shippingPrice;
	}

	private function calculateTotal($order)
	{
		$subtotal = $this->calculateSubTotal($order);
		$shipping = $this->calculateShipping($order);
		$total = $subtotal + $shipping;
		return $total;
	}


	private function sendEmail($request,$discount, $subtotal, $shipping, $total)
	{
		$date = Carbon::now()->timezone('America/Los_Angeles')->format('F jS Y | g:i A T');
		Mail::queue('emails.shipping-track', ['order' => $request->order, 'discount' => $discount, 'subtotal' => $subtotal, 'shipping' => $shipping, 'total' => $total, 'date' => $date, 'trackId' => $request->track_id], function($message) use ($request){
			$message->to($request->order->customer->email, $request->order->customer->email)->subject('GATKU | Here is your package tracking number!');
		});
	}



}
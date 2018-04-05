<?php

namespace Austen\Repositories;

use ShippingRequest;
use Log;
use Mail;
use Stripe_Charge;
use App;

class ShippingRequestRepository {


	public function store($input) 
	{	
		

		try {
		
			$request = new ShippingRequest;
			$request->price = $input['price'];
			$request->orderId = $input['orderId'];
			$request->token = str_random(10);
			$request->save();

			$request->load('order.customer');
			
			$this->sendEmail($request);


		} catch (Exception $e) {
			
			Log::error($e);

			return false;

		}

		return $request;

	}

	public function pay($input) {


		$shippingRequestId = $input['shippingRequestId'];

		$request = ShippingRequest::findOrFail($shippingRequestId);

		$request->load('order.customer');

		if ($request->paid === false) return false;

		try {
			
			Stripe_Charge::create([

				'source' => $input['token']['id'],
				'amount' => $request->price,
				'currency' => 'usd',
				'description' => 'Shipping for Order : ' . $request->order->number

			]);

		} catch (Stripe_CardError $e) {
			
			Log::error($e);

			return $e;

		}

		$request->paid = true;
		$request->save();

		$this->sendReceipt($request);

		return true;

	}


	private function sendEmail($request) {

		Mail::queue('emails.shipping-request', ['request' => $request], function($message) use ($request){

			$message->to($request->order->customer->email, $request->order->customer->fullName)->subject('GATKU | Shipping Request');
		  
		});

	}

	private function sendReceipt($request) {

		if (App::environment('production')) {

			Mail::queue('emails.shipping-request-payment-notification', ['request' => $request], function($message) use ($request){

				$message->to('dustin@gatku.com', 'Dustin McIntyre')->subject('GATKU | Shipping Payment');
			  
			});

		} else {

			Mail::queue('emails.shipping-request-payment-notification', ['request' => $request], function($message) use ($request){

				$message->to('austenpayan@gmail.com', 'Austen Payan')->subject('GATKU | Shipping Payment');
			  
			});

		}

		Mail::queue('emails.shipping-request-receipt', ['request' => $request], function($message) use ($request){

			$message->to($request->order->customer->email, $request->order->customer->fullName)->subject('GATKU | Shipping Payment Receipt');
		  
		});

	}

}
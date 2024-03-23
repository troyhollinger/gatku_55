<?php

namespace Gatku\Repositories;

use App\Mail\EmailsShippingRequest;
use App\Mail\EmailsShippingRequestPaymentNotification;
use App\Mail\EmailsShippingRequestReceipt;
use Gatku\Model\ShippingRequest;
use Illuminate\Support\Facades\Log;
use Stripe_Charge;
use Stripe_CardError;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;
use Gatku\Model\Order;
use Exception;

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
            Bugsnag::notifyException($e);
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
            Bugsnag::notifyException($e);
			Log::error($e);
			return $e;
		}

		//Update shipping_request table
		$request->paid = true;
		$request->save();

		//Update values in Order
        /** @var Order $order */
        $order = $request->order;

        //Update shipping cost
        $order->shipping_cost = $order->shipping_cost + $request->price;
        $order->total_sum = $order->total_sum + $request->price;

        $order->update();
        //Update values in Order - end

		$this->sendReceipt($request);

		return true;
	}

	private function sendEmail($request) {
        if (App::environment('production')) {
            Mail::to([
                [
                    'email' => $request->order->customer->email,
                    'name' => $request->order->customer->fullName
                ]
            ])->send(new EmailsShippingRequest($request));
        } else {
            //for dev and QA
            $email = env('DEV_QA_TEST_EMAIL', false);

            if ($email) {
                Mail::to([
                    [
                        'email' => $email,
                        'name' => 'past-recipient-name'
                    ]
                ])->send(new EmailsShippingRequest($request));
            }
        }

	}

    /**
     * @param $request
     */
	private function sendReceipt($request) {
		if (App::environment('production')) {

		    //admin
            Mail::to([
                [
                    'email' => 'dustin@gatku.com',
                    'name' => 'Dustin McIntyre'
                ],
                [
                    'email' => 'nathan@gatku.com',
                    'name' => 'Nathan'
                ],
                [
                    'email' => 'troy@gatku.com',
                    'name' => 'Troy Hollinger'
                ],
            ])->send(new EmailsShippingRequestPaymentNotification($request));

            //customer
            Mail::to([
                [
                    'email' => $request->order->customer->email,
                    'name' => $request->order->customer->fullName
                ]
            ])->send(new EmailsShippingRequestReceipt($request));
		} else {

		    //for dev and QA
            $email = env('DEV_QA_TEST_EMAIL', false);

            if ($email) {
                Mail::to([
                    [
                        'email' => $email,
                        'name' => 'past-recipient-name'
                    ]
                ])->send(new EmailsShippingRequestPaymentNotification($request));

                //customer
                Mail::to([
                    [
                        'email' => $email,
                        'name' => 'past-recipient-name'
                    ]
                ])->send(new EmailsShippingRequestReceipt($request));
            }
		}
	}
}

<?php

namespace App\Http\Controllers;

use Gatku\Model\Discount;
use Gatku\Model\Order;
use Gatku\Repositories\CustomerRepository;
use Gatku\Repositories\OrderRepository;

class ResendOrderEmailsController extends BaseController {

    /**
     * @var OrderRepository
     */
	protected $orderRepository;
    /**
     * @var CustomerRepository
     */
	protected $customerRepository;

	public function __construct(OrderRepository $order, CustomerRepository $customerRepository) {
		$this->orderRepository = $order;
		$this->customerRepository = $customerRepository;

        parent::__construct();
	}

    /**
     * @param $id
     * @return mixed
     */
	public function resend($id) {

	    //This allow to get all data from POST
        $emails = \Request::all();

        //Get order
        /** @var Order $order */
        $order = $this->orderRepository->get($id);

        //@TODO This is hack just to make it work. In future add relation to Discount and make it work.
        $discount = new Discount;

        $result = $this->orderRepository->sendEmailNotifications(
            $order,
            $discount,
            $order->order_sum,
            $order->shipping_cost,
            $order->tax_amount,
            $order->total_sum,
            $emails['emailListForEmailsOrderArray'],
            $emails['emailListForEmailsOrderAdminArray']
        );

		if (!$result) {
			return \Response::json(['message' => 'Sorry, there was an error'], 404);
		}
		return \Response::json('Sent', 200);
	}
}

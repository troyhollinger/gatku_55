<?php

namespace App\Http\Controllers;

use Austen\Repositories\OrderRepository;
use Austen\Repositories\MailchimpRepository;

class OrderController extends BaseController {

	protected $order;

	public function __construct(OrderRepository $order,MailchimpRepository $mailchimp) {
		$this->order = $order;
		$this->mailchimp = $mailchimp;

        parent::__construct();
	}

	/**
	 * get a listing of the resource.
	 * GET /order
	 *
	 * @return Response
	 */
	public function index() {
		$orders = $this->order->all();

		if (!$orders) {
			return Response::json(['message' => 'Sorry, there was an error'], 404);
		}
		$totalCount = DB::table('orders')->count();
		return Response::json(['data' => $orders, 'total_count' => $totalCount], 200);
	}


	public function orderall($itemsPerPage, $pagenumber, $startDate = null, $endDate = null){
		if(!empty($startDate )){
			if(empty($endDate)){
				$endDate = date('y-m-d');
			}
			$totalCount = DB::table('orders')->whereBetween('created_at', array($startDate, $endDate))->count();
			$orders = Order::with('items.addons.product', 'items.product', 'customer', 'items.size', 'tracking', 'shipping')->whereBetween('created_at', array($startDate, $endDate))->orderBy('created_at', 'desc')->take($itemsPerPage)->skip($itemsPerPage*($pagenumber-1))->get();
		}else{
			$totalCount = DB::table('orders')->count();
			$orders = Order::with('items.addons.product', 'items.product', 'customer', 'items.size', 'tracking', 'shipping')->orderBy('created_at', 'desc')->take($itemsPerPage)->skip($itemsPerPage*($pagenumber-1))->get();	
		}
		$orders = $this->assignHumanReadableTimestampsAndOrderAmount($orders);
		
		return Response::json(['data' => $orders, 'total_count' => $totalCount], 200);
	}
	
	/**
	 * Store a newly created resource in storage.
	 * POST /order
	 *
	 * @return Response
	 */
	public function store() {
		$allData = Input::all();
		$order = $this->order->process(Input::all());

		if ($order !== true) {
			if ($order !== false) {
				return Response::json(['message' => $order], 404);
			} else {
				return Response::json(['message' => 'Sorry, something went wrong on our end. We are fixing it.'], 404);
			}
		}
		$fname = $allData['form']['firstName'];
		$email = $allData['form']['email'];
		$country = $allData['form']['country'];
		$this->mailchimp->addSubscription($fname, $email, $country);
   
		return Response::json(['message' => 'Thank you for the order!'], 200);
	}

	/**
	 * Display the specified resource.
	 * GET /order/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function show($id)
	{
		//
	}

	/**
	 * Show the form for editing the specified resource.
	 * GET /order/{id}/edit
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function edit($id)
	{
		//
	}

	/**
	 * Update the specified resource in storage.
	 * PUT /order/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 * DELETE /order/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}
	private function assignHumanReadableTimestampsAndOrderAmount($collection) {

		foreach($collection as $model) {
			$orderAmount = 0;
			foreach ($model->items as $items) {
				foreach ($items->addons as $addons) {
					$orderAmount = $orderAmount + $addons->product->price;
				}
				$orderAmount = $orderAmount + $items->product->price;
				
			}
			
			$model->orderAmount = chop($orderAmount,"00");

			$model->createdAtHuman = $model->created_at->timezone('America/Los_Angeles')->format('F jS Y | g:i A');

		}

		return $collection;

	}

}
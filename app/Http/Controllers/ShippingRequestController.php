<?php

namespace App\Http\Controllers;

use Gatku\Model\HomeSetting;
use Gatku\Repositories\ShippingRequestRepository;
use Gatku\Model\ShippingRequest;
use Illuminate\Support\Facades\View;

class ShippingRequestController extends BaseController {

	protected $request;

    /**
     * @var HomeSetting
     */
    protected $homeSetting;

    public function __construct(
	    ShippingRequestRepository $request,
        HomeSetting $homeSetting
    )
	{
		$this->request = $request;
        $this->homeSetting = $homeSetting;

        parent::__construct();
    }

	/**
	 * Store a newly created resource in storage.
	 * POST /shipping-request
	 *
	 * @return Response
	 */
	public function store()
	{
		
		$input = \Request::all();

		$request = $this->request->store($input);

		if ($request === false) return \Response::json(['message' => 'Sorry, there was an error on our end'], 404);

		return \Response::json(['message' => 'request was created', "data" => $request], 200);

	}

    /**
     * @param $token
     * @return mixed
     */
	public function show($token)
	{
		$request = ShippingRequest::where('token','=', $token)->with('order.customer')->first();

		if ($request->paid) return \Redirect::route('home');

		return View::make('pages.shipping-request', ['request' => $request])->with('homeSetting',  $this->homeSetting);
	}

	public function pay() {

		$input = \Request::all();

		$payment = $this->request->pay($input);

		if ($payment !== true && $payment !== false) return \Response::json(['message' => $payment], 404);

		if ($payment === false) return \Response::json(['message' => 'This request is already paid!'], 404);

		return \Response::json(['message' => 'Payed!'], 200);

	}

	
	/**
	 * Remove the specified resource from storage.
	 * DELETE /shipping-request/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}

}
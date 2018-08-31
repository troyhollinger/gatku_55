<?php

namespace App\Http\Controllers;

use Gatku\Repositories\ShippingTrackRepository;

class ShippingTrackController extends BaseController {

	protected $request;

	public function __construct(ShippingTrackRepository $request) 
	{
		$this->request = $request;

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
	 * Display the specified resource.
	 * GET /shippingtrack/{id}
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
	 * GET /shippingtrack/{id}/edit
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
	 * PUT /shippingtrack/{id}
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
	 * DELETE /shippingtrack/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
		//
	}

}
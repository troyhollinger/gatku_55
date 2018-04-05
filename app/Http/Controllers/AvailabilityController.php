<?php

namespace App\Http\Controllers;

class AvailabilityController extends BaseController {

	public function index() {

		try {
		
			$availabilityTypes = AvailabilityType::all();

		} catch (Exception $e) {
			
			Log::error($e);

			return Response::json(['message' => 'Sorry, availability types could not be retrieved.'], 404);

		}

		return Response::json(['data' => $availabilityTypes], 200);		

	}

}
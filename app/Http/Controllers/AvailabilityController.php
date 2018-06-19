<?php

namespace App\Http\Controllers;

use Gatku\AvailabilityType;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
use Illuminate\Support\Facades\Log;

class AvailabilityController extends BaseController {

	public function index() {

		try {
			$availabilityTypes = AvailabilityType::all();
		} catch (Exception $e) {
            Bugsnag::notifyException($e);
			Log::error($e);
			return \Response::json(['message' => 'Sorry, availability types could not be retrieved.'], 404);
		}

		return \Response::json(['data' => $availabilityTypes], 200);
	}

}
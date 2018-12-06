<?php

namespace App\Http\Controllers;

use Gatku\Repositories\OrderRepository;
use Illuminate\Support\Facades\Input;


class QuantityReportController extends BaseController {

    /**
     * @var OrderRepository
     */
	protected $orderRepository;

    /**
     * QuantityReportController constructor.
     * @param OrderRepository $orderRepository
     */
	public function __construct(OrderRepository $orderRepository) {
		$this->orderRepository = $orderRepository;
        parent::__construct();
	}

	/**
	 * get a listing of the resource.
	 * GET /order
	 *
	 * @return Response
	 */
	public function index() {
	    //Get dates form url path
        $start = Input::get("start");
        $end = Input::get("end");

        $report = $this->orderRepository->quantityReport($start, $end);
		return \Response::json($report, 200);
	}
}

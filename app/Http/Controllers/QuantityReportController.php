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
     * @return mixed
     * @throws \Exception
     */
	public function index() {
	    //Get dates form url path
        $startInput = Input::get("start");
        $endInput = Input::get("end");

        if ($startInput) {
            $start = new \DateTime($startInput);
            $startInput = $start->format('Y-m-d');
        }

        if ($startInput) {
            $end = new \DateTime($endInput);
            $endInput = $end->format('Y-m-d');
        }

        $report = $this->orderRepository->quantityReport($startInput, $endInput);
		return \Response::json($report, 200);
	}
}

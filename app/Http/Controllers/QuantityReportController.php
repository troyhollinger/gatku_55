<?php

namespace App\Http\Controllers;

use Gatku\Repositories\OrderRepository;


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
		return \Response::json($this->orderRepository->quantityReport(), 200);
	}

}

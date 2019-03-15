<?php

namespace App\Http\Controllers;

use Gatku\Service\CalculateOrdersService;

class CartCalculationsController extends BaseController {

    /**
     * @var CalculateOrdersService
     */
    private $calculateOrdersService;

    /**
     * CartCalculationsController constructor.
     * @param CalculateOrdersService $calculateOrdersService
     */
    public function __construct(CalculateOrdersService $calculateOrdersService)
    {
        $this->calculateOrdersService = $calculateOrdersService;

        parent::__construct();
    }

    /**
     * @return mixed
     */
    public function getCalculationsForCart()
    {
        return \Response::json([ 'response' => 'OK'], 200);
    }
}
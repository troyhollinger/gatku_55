<?php

namespace App\Http\Controllers;

use Gatku\Model\Order;
use Gatku\Repositories\OrderRepository;
use Gatku\Service\CalculateOrdersService;

class CartCalculationsController extends BaseController {

    /**
     * @var CalculateOrdersService
     */
    private $calculateOrdersService;
    /**
     * @var OrderRepository
     */
    private $orderRepository;

    /**
     * CartCalculationsController constructor.
     * @param CalculateOrdersService $calculateOrdersService
     * @param OrderRepository $orderRepository
     */
    public function __construct(
        CalculateOrdersService $calculateOrdersService,
        OrderRepository $orderRepository
    )
    {
        $this->calculateOrdersService = $calculateOrdersService;

        parent::__construct();
        $this->orderRepository = $orderRepository;
    }

    /**
     * @return mixed
     */
    public function getCalculationsForCart()
    {
        $requestData = \Request::all();

        $order = new Order;

        [$items, $addons] = $this->orderRepository->assignOrderItems($order, $requestData['items']);

        $discount = $requestData['discount'];

print_r($discount);

print_r($items);
print_r($addons);

        return \Response::json([ 'response' => 'OK'], 200);
    }
}
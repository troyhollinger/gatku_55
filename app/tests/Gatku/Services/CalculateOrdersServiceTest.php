<?php

use Gatku\Model\Discount;
use Gatku\Model\Order;
use Gatku\Repositories\OrderRepository;
use Tests\TestCase;
use Gatku\Service\CalculateOrdersService;

class CalculateOrdersServiceTest extends TestCase {

    /**
     * @var CalculateOrdersService
     */
    private $calculateOrdersService;
    /**
     * @var OrderRepository
     */
    private $orderRepository;
    /**
     * @var Order
     */
    private $order;
    /**
     * @var Discount
     */
    private $discount;

    public function setUp()
    {
        parent::setUp();

        //Set variables
        $this->calculateOrdersService = $this->app->make(CalculateOrdersService::class);
        $this->orderRepository = $this->app->make(OrderRepository::class);

        $this->getOrder();
        $this->setNoDiscount();
    }

    public function testCalculateSubtotal()
    {
        $result = $this->calculateOrdersService->getOrderCalculations($this->order, $this->discount);

        $this->assertInternalType('array', $result);

        $expectedValue = 4900;
        $this->assertEquals($expectedValue, $result['subtotal']);
    }

    private function getOrder()
    {
        $this->order = $this->orderRepository->get(2136);
    }

    private function setNoDiscount()
    {
        $this->discount = null;
    }

    private function setDiscount()
    {
        $this->discount = new Discount;
        $this->discount->code = 'test_code_10';
        $this->discount->discount = 10;
    }
}

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
        $this->setDiscount();
    }

    public function testCalculateSubtotal()
    {
        $this->setDiscount();

        $result = $this->calculateOrdersService->getOrderCalculations($this->order, $this->discount);

        $this->assertInternalType('array', $result);

        //subtotal
        $expectedValue = $this->order->order_sum;
        $this->assertEquals($expectedValue, $result['subtotal']);

        //discount
        //@TODO We need to add discount amount to Order. There is only: 'discount_percentage'. So discount can't be calculated.
        //$this->order->discount_percentage
        //$expectedValue = $this->order->discount;
        //$this->assertEquals($expectedValue, $result['discount']);

        //shipping cost
        $expectedValue = $this->order->shipping_cost;
        $this->assertEquals($expectedValue, $result['shipping']);

        //tax
        $expectedValue = $this->order->tax_amount;
        $this->assertEquals($expectedValue, $result['tax']);

        //tax
        $expectedValue = $this->order->total_sum;
        $this->assertEquals($expectedValue, $result['total']);
    }

    private function getOrder()
    {
        //This is how to get record from database
        $this->order = $this->orderRepository->get(2136);

        //Keep this for future use
//        $this->order = new Order();
//        $this->order->id = '1234';
//        $this->order->customerId = '4321';
//        $this->order->address = '1234 Jefferson St.';
//        $this->order->city = 'Los Angeles';
//        $this->order->state = 'California';
//        $this->order->country = 'USA';
//        $this->order->zip = '93120';
//        $this->order->number = '1234567890';
//        $this->order->comments = 'test comment';
//        $this->order->discount_percentage = 0;
//        $this->order->order_sum = 0;
//        $this->order->shipping_cost = 0;
//        $this->order->total_sum = 0;
//        $this->order->sales_tax = 0;
//        $this->order->tax_amount = 0;

        //print_r($this->order);
        //echo json_encode($this->order);
        //die();
    }

    //Keep this for future use
    private function setDiscount()
    {
        $this->discount = new Discount;
        $this->discount->code = 'test_code_10';
        //$this->discount->discount = 10;
        $this->discount->discount = 0;
    }
}

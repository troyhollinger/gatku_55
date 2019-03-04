<?php

namespace App\Console\Commands;

use Gatku\Model\Discount;
use Gatku\Service\CalculateOrdersService;
Use Illuminate\Console\Command;
Use Gatku\Model\Order;
Use Gatku\Repositories\OrderRepository;

class CalculateOrderSums extends Command
{
    /**
     * The name and signature of the console command.
     *
     * To run this script: $ php artisan calculate:orders
     *
     * @var string
     */
    //protected $signature = 'command:name';
    protected $signature = 'calculate:orders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * @var OrderRepository
     */
    private $orderRepository;
    /**
     * @var CalculateOrdersService
     */
    private $calculateOrdersService;

    /**
     * CalculateOrderSums constructor.
     * @param OrderRepository $orderRepository
     * @param CalculateOrdersService $calculateOrdersService
     */
    public function __construct(
        OrderRepository $orderRepository,
        CalculateOrdersService $calculateOrdersService
    )
    {
        $this->orderRepository = $orderRepository;
        $this->calculateOrdersService = $calculateOrdersService;

        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        echo "\n\nStart script\n\n";
        $discount = new Discount;

        $totalCounts = $this->orderRepository->getAllRecordsCount();
        $orders = $this->orderRepository->getAllRecords();

        $i = 0;

        /** @var Order $order */
        foreach($orders as $order) {
            $i++;
            $percentage = intval(($i/$totalCounts) * 100);
            echo "Process Order id: $order->id [ $percentage % ]\n";

            $this->calculateAndUpdateOrder($order, $discount);
        }

        echo "\n\nStart script\n\n";
    }

    /**
     * @param Order $order
     * @param Discount $discount
     */
    private function calculateAndUpdateOrder(Order $order, Discount $discount)
    {
        //Make all sum calculations
        $orderCalculations = $this->calculateOrdersService->getOrderCalculations($order, $discount);

        //Update Order
        $order->discount_percentage = ($discount->discount) ? $discount->discount * 100 : 0;
        $order->order_sum = $orderCalculations['subtotal'];
        $order->shipping_cost = $orderCalculations['shipping'];
        $order->tax_amount = $orderCalculations['tax'];
        $order->total_sum = $orderCalculations['total'];

        $order->update();
    }
}

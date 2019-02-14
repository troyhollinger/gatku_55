<?php 
namespace Gatku\Service;

use Gatku\Model\Order;

class CalculateOrdersService
{
    /**
     * @var int
     */
    private $subtotal;
    /**
     * @var int
     */
    private $discount;
    /**
     * @var int
     */
    private $tax;
    /**
     * @var int
     */
    private $shipping;
    /**
     * @var int
     */
    private $total;

    /**
     * @param Order $order
     */
    public function calculateSubtotal(Order $order) {

    }

    public function calculateDiscount() {

    }

    public function calculateShipping() {

    }

    public function calculateTax() {

    }

    public function calculateTotal() {

    }

    public function getAllCalculatedValues(Order $order) {
        $this->calculateSubtotal($order);

        return [
            'subtotal' => $this->subtotal,
            'discount' => $this->discount,
            'shipping' => $this->shipping,
            'tax' => $this->tax,
            'total' => $this->total
        ];
    }
}


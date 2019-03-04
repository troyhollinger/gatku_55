<?php 
namespace Gatku\Service;

use Gatku\Model\Discount;
use Gatku\Model\HomeSetting;
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
    private $discountAmount;
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
     * @var Order
     */
    private $order;
    /**
     * @var Discount
     */
    private $discount;
    /**
     * @var HomeSetting
     */
    private $homeSetting;

    private $freeShippingAmountTheshold = 30000; //This is $300
    /**
     * CalculateOrdersService constructor.
     * @param HomeSetting $homeSetting
     */
    public function __construct(HomeSetting $homeSetting)
    {
        $this->homeSetting = $homeSetting;
    }

    /**
     * @param Order $order
     * @param Discount $discount
     * @return array
     */
    public function getOrderCalculations(Order $order, ?Discount $discount) {

        $this->order = $order;
        $this->discount = $discount;

        $this->subtotal = $this->calculateSubtotal();
        $this->discountAmount = $this->calculateDiscountAmount();
        $this->shipping = $this->calculateShipping();
        $this->tax = $this->calculateTax();
        $this->total = $this->calculateTotal();

        return [
            'subtotal' => $this->subtotal,
            'discount' => $this->discountAmount,
            'shipping' => $this->shipping,
            'tax' => $this->tax,
            'total' => $this->total
        ];
    }


    /**
     * @return float|int
     */
    private function calculateSubtotal() {
        $subtotal = 0;

        $items = $this->order->items;

        //$discountReverse - variable name because this calculate actually not a discount but how much should be discounted price?
        $discountReverse = 1;
        if ($this->discount) {
            $discountReverse = (100 - $this->discount->discount) / 100;
        }

        foreach($items as $item) {

            if ($item->product->sizeable && $item->sizeId) {
                $price = $item->size->price;
            } else {
                //This id done because we don't wand to double price for charging
                //Then package price is not added. Only elements from package are summed.
                if ($item->product->type->slug != 'package') {
                    $price = $item->product->price;
                } else {
                    $price = 0;
                }
            }

            //Calc item value
            $value = $this->calculateDiscountValue($price, $item->quantity, $discountReverse);
            $subtotal += $value;

            foreach($item->addons as $addon) {

                //For Addons with price_zero = 1
                if ($addon->price_zero) {
                    $addonPrice = 0;
                } else {
                    if ($addon->product->sizeable && $addon->sizeId) {
                        $addonPrice = $addon->size->price;
                    } else {
                        $addonPrice = $addon->product->price;
                    }
                }

                //Calc addon value
                $addonPrice = $this->calculateDiscountValue($addonPrice, $addon->quantity, $discountReverse);
                $subtotal += $addonPrice;
            }
        }

//This is hardcoded discount for Black Friday, consider remove this code
//@todo should we calc here ?? I don't think so
//$discountHardcoded = $this->calculateDiscount();

        return $subtotal;
    }

    /**
     * @return float|int
     */
    private function calculateDiscountAmount() {
        $amount = 0;
        $glassCheck = 0;
        $glassPrice = 0;

        if ($this->subtotal && $this->homeSetting->global_discount_switch) {
            $amount = intval($this->subtotal * ( $this->homeSetting->global_discount_percentage / 100 ));
            return $amount;
        }

        $items = $this->order->items;

        //Glass discount
        foreach($items as $item) {
            if ($item->product->type->slug === 'glass') {
                $glassCheck += $item->quantity;
                $glassPrice = $item->product->price;
            }

            foreach($item->addons as $addon) {
                if ($addon->product->type->slug === 'glass') {
                    $glassCheck += $addon->quantity;
                }
            }
        }

        if ($glassCheck >= 4) {
            $amount = ($glassPrice * 4) - 4000;
        }

        return intval($amount);
    }

    /**
     * @return float|int
     */
    private function calculateShipping() {
        $shippingPrice = 0;

        //Orders under '$this->freeShippingAmountTheshold' will be charged one the highest shipping fee.
        if ($this->subtotal < $this->freeShippingAmountTheshold) {

        }

        return $shippingPrice;
    }

    /**
     * @return int
     */
    private function calculateTax() {
        $taxAmount = intval( ( $this->subtotal + $this->shipping ) * ( $this->order->sales_tax / 100) );
        return $taxAmount;
    }

    private function calculateTotal() {
        $total = $this->subtotal + $this->shipping + $this->tax - $this->discountAmount;
        return $total;
    }

    /**
     * @param $price
     * @param $quantity
     * @param $discountReverse
     * @return float|int
     */
    private function calculateDiscountValue($price, $quantity, $discountReverse)
    {
        return ($price * $quantity) * $discountReverse;
    }
}


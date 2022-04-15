<?php 
namespace Gatku\Service;

use Gatku\Model\Discount;
use Gatku\Model\HomeSetting;
use Gatku\Model\Order;
use Gatku\Model\Product;

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
    private $shippingHelper = 0;
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

    private $freeShippingAmountThreshold = 40000; //This is $400
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

        foreach($items as $item) {

            $this->prepareShippingIfApplied($item->product);

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

            //Calc based on item value
            $subtotal += intval($price * $item->quantity);

            foreach($item->addons as $addon) {

                $this->prepareShippingIfApplied($addon->product);

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

                //Calc based on addon value
                $subtotal += intval($addonPrice * $addon->quantity);
            }
        }

        return $subtotal;
    }

    /**
     * @return float|int
     */
    private function calculateDiscountAmount() {
        $globalDiscount = 0;
        $codeDiscount = 0;

        //Discount calculated on global discount percentage
        if ($this->subtotal && $this->homeSetting->global_discount_switch) {
            $globalDiscount = intval($this->subtotal * ( $this->homeSetting->global_discount_percentage / 100 ));
        }

        //Discount calculated based on applied code on page
        if ($this->discount) {
            $codeDiscount = intval(intval($this->subtotal - $globalDiscount) * ( $this->discount->discount / 100 ));
        } else {
            // This option is in case there was additional fee for shipping and value have to be recalculated.
            if ($this->order->discount_percentage) {
                $codeDiscount = intval(intval($this->subtotal - $globalDiscount) * ( $this->order->discount_percentage / 100 ));
            }
        }

        return intval($globalDiscount + $codeDiscount);
    }

    /**
     * @return int
     */
    private function calculateShipping()
    {
        $shipping = 0;

        //We want free shipping for orders with subtracted discount.
        $amount = intval($this->subtotal - $this->discountAmount);

        //Orders above '$this->freeShippingAmountThreshold' are not charged shipping fee.
        if ($amount < $this->freeShippingAmountThreshold) {
            $shipping = $this->shippingHelper;
        }

        return $shipping;
    }

    /**
     * @param Product $product
     */
    private function prepareShippingIfApplied(Product $product)
    {
        //Apply highest shipping fee
        if ($product->shipping > $this->shippingHelper) {
            $this->shippingHelper = $product->shipping;
        }
    }

    /**
     * @return int
     */
    private function calculateTax()
    {
        $taxAmount = intval( ( $this->subtotal + $this->shipping ) * ( $this->order->sales_tax / 100) );
        return $taxAmount;
    }

    /**
     * @return int
     */
    private function calculateTotal()
    {
        $total = intval($this->subtotal + $this->shipping + $this->tax - $this->discountAmount);
        return $total;
    }
}


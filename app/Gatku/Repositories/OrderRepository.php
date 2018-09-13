<?php
namespace Gatku\Repositories;

use App\Mail\EmailsOrder;
use App\Mail\EmailsOrderAdmin;
use Gatku\Model\EmailSettings;
use Gatku\Model\Order;
use Gatku\Model\OrderItem;
use Stripe_Charge;
use Gatku\Model\Discount;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Gatku\Model\OrderItemAddon;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Stripe_CardError;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
use Illuminate\Support\Facades\App;
use Gatku\Model\HomeSetting;

/**
 *
 *
 * @todo complete validateInput method
 */
class OrderRepository {

    protected $customer;
    protected $order;
    protected $error_message;

    public $blackFriday = false;
    /**
     * @var HomeSetting
     */
    private $homeSetting;
    /**
     * @var EmailSettings
     */
    private $emailSettings;

    /**
     * OrderRepository constructor.
     * @param CustomerRepository $customer
     * @param EmailSettingsRepository $emailSettingsRepository
     */
    public function __construct(CustomerRepository $customer, EmailSettingsRepository $emailSettingsRepository) {
        $this->customer = $customer;
        $this->homeSetting = HomeSetting::orderBy('id', 'desc')->first();
        $this->emailSettings = $emailSettingsRepository->getLastRecordFromDatabase();
    }

    public function all() {
        $orders = Order::with('items.addons.product', 'items.product', 'customer', 'items.size', 'tracking','shipping')->orderBy('created_at', 'desc')->take(10)->get();
        $orders = $this->assignHumanReadableTimestamps($orders);
        return $orders;
    }

    /**
     * Processes order, payment, and email.
     *
     * @return boolean
     */
    public function process($input) {

        if (!$this->validateInput($input)) {
            return false;
        }

        DB::beginTransaction();

        try {
            //Store customer data
            $customer = $this->customer->store($input['form']);

            //Create and store Order
            $order = new Order;
            $order = $this->assignFields($order, $customer, $input['form']);
            $order->save();

            //Assign and store order items
            $this->assignOrderItems($order, $input['items']);
            $order->load('items.addons.product.type','items.addons.size', 'items.product.type', 'customer', 'items.size');

            //Discount part
            $discount = new Discount;

            if (isset($input['discount']['code'])) {
                $discount = $discount->find($input['discount']['code']);
            }

            //Make all sum calculations
            $subtotal = $this->calculateSubTotal($order, $discount);
            $shipping = $this->calculateShipping($order, $discount);
            $total = $this->calculateTotal($order, $discount);

            //Update Order
            $order->discount_percentage = ($discount->discount) ? $discount->discount * 100 : 0;
            $order->order_sum = $subtotal;
            $order->shipping_cost = $shipping;
            $order->total_sum = $total;

            $order->update();

        } catch(\Exception $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            DB::rollback();

            return false;
        }

        try {
            Stripe_Charge::create([
                'source' => $input['token']['id'],
                'amount' => $total,
                'currency' => 'usd',
                'description' => 'Order : ' . $order->number
            ]);
        } catch (Stripe_CardError $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            DB::rollback();
            return $e;
        }

        DB::commit();

        $date = Carbon::now()->timezone('America/Los_Angeles')->format('F jS Y | g:i A T');

        if (App::environment('production')) {

            //Send email to Customer and to Ryan Gattoni
            Mail::to([
                [
                    'email' => $customer->email,
                    'name' => $customer->fullName
                ],
                [
                    'email' => 'ryan@gatku.com',
                    'name' => 'Ryan Gattoni'
                ],
            ])->send(new EmailsOrder($order, $discount, $subtotal, $shipping, $total, $date, $this->homeSetting, $this->emailSettings));

            //Send email to Sellers
            Mail::to([
                [
                    'email' => 'dustin@gatku.com',
                    'name' => 'Dustin McIntyre'
                ],
                [
                    'email' => 'emailme@troyhollinger.com',
                    'name' => 'Troy Hollinger'
                ]
            ])->send(new EmailsOrderAdmin($order, $discount, $subtotal, $shipping, $total, $date, $this->homeSetting, $this->emailSettings));

        }

        if (App::environment('dev')) {
            if (isset($_ENV['test_transaction_email'])) {
                Mail::to([
                    [
                        'email' => 'past-email-address-here',
                        'name' => 'past-recipient-name-here'
                    ]
                ])->send(new EmailsOrderAdmin($order, $discount, $subtotal, $shipping, $total, $date, $this->homeSetting));
            }
        }

        return true;
    }

    /**
     * Assigns the order destination fields
     *
     * @param $order $customer $input
     * @return Eloquent Object $order
     */
    private function assignFields($order, $customer, $input) {

        $order->customerId = $customer->id;
        $order->address = $input['address'];
        $order->city = $input['city'];
        $order->state = $input['state'];
        $order->country = $input['country'];
        $order->zip = $input['zip'];
        $order->number = strtoupper(str_random(15));
        if (isset($input['comments'])) $order->comments = $input['comments'];
        $order->discount_percentage = (isset($input['discount_percentage'])) ? $input['discount_percentage'] * 100 : 0;
        $order->order_sum = (isset($input['order_sum'])) ? $input['order_sum'] * 100 : 0;
        $order->shipping_cost = (isset($input['shipping_cost'])) ? $input['shipping_cost'] * 100 : 0;
        $order->total_sum = (isset($input['total_sum'])) ? $input['total_sum'] * 100 : 0;

        return $order;
    }

    /**
     * Validates the input from the cart. Make sure no shady business is happening.
     *
     * @todo code this method to validate the input
     */
    private function validateInput($input) {

        $email = $input['form']['email'];
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        return true;
    }

    /**
     * @param $order
     * @param $discountObj
     * @return float|int
     */
    private function calculateSubTotal($order, $discountObj) {

        $subtotal = 0;

        $items = $order->items;

        //$discountReverse - variable name because this calculate actually not a discount but how much should be discounted price?
        $discountReverse = 1;
        if ($discountObj) {
            $discountReverse = (100 - $discountObj->discount) / 100;
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
                if ($addon->product->sizeable && $addon->sizeId) {
                    $addonPrice = $addon->size->price;
                } else {
                    $addonPrice = $addon->product->price;
                }

                //Calc addon value
                $addonPrice = $this->calculateDiscountValue($addonPrice, $addon->quantity, $discountReverse);
                $subtotal += $addonPrice;
            }
        }
        //This is hardcoded discount for Black Friday, consider remove this code
        $discountHardcoded = $this->calculateDiscount($order, $subtotal);

        return $subtotal - $discountHardcoded;
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

    /**
     * @param $order
     * @param bool $subtotal
     * @return float|int
     */
    private function calculateDiscount($order, $subtotal = false) {

        $amount = 0;
        $glassCheck = 0;
        $glassPrice = 0;

        if($subtotal && $this->blackFriday) {

            $amount = ($subtotal * 0.2) / 100;
            $amount = ceil($amount) * 100;

            return $amount;

        }

        $items = $order->items;

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

        Log::info($amount);

        return $amount;

    }

    /**
     * Calculate the shipping.
     * There is a similar method in the CartController.js file. These two methods
     * should produce identical results.
     *
     */
    private function calculateShipping($order, $discount) {

        $shippingPrice = 0;
        $poles = [];
        $heads = [];
        $others = [];

        $items = $order->items;

        if ($this->calculateSubTotal($order, $discount) >= 30000) return 0;

        foreach($items as $item) {

            if ($item->product->type->slug === 'pole') {

                $poles[] = $item;

            } elseif ($item->product->type->slug === 'head') {

                $heads[] = $item;

            } else {

                $others[] = $item;
            }
        }

        // if black friday is true, only give free shipping to
        // orders that have poles
        if ($this->blackFriday && count($poles) > 0) return 0;

        if (count($poles) > 0) {

            $poleShippingPrice = $poles[0]->product->type->shippingPrice;

            if (count($poles) > 1) {

                $shippingPrice = $poleShippingPrice * count($poles);

            } else {

                $shippingPrice = $poleShippingPrice;

            }

        } elseif (count($heads) > 0) {

            $headShippingPrice = $heads[0]->product->type->shippingPrice;

            if (count($heads) > 1) {

                $shippingPrice = $headShippingPrice * ceil(count($heads) / 2);

            } else {

                $shippingPrice = $headShippingPrice;

            }

        } elseif (count($others) > 0) {

            $shippingPrice = $others[0]->product->type->shippingPrice;

        }

        return $shippingPrice;

    }

    /**
     * @param $order
     * @param $discount
     * @return float|int
     */
    private function calculateTotal($order, $discount) {

        $subtotal = $this->calculateSubTotal($order, $discount);

        $shipping = $this->calculateShipping($order, $discount);

        $total = $subtotal + $shipping;

        return $total;

    }

    /**
     * Converts cart items to order Items,
     * Addons the same.
     *
     */
    private function assignOrderItems($order, $items) {

        foreach($items as $item) {

            $orderItem = new OrderItem;
            $orderItem->orderId = $order->id;
            $orderItem->productId = $item['id'];
            $orderItem->quantity = $item['quantity'];

            if ($item['sizeable'] && $item['sizeId']) {
                $orderItem->sizeId = $item['sizeId'];
            }

            $orderItem->save();

            foreach($item['addons'] as $addon) {
                $itemAddon = new OrderItemAddon;
                $itemAddon->orderItemId = $orderItem->id;
                $itemAddon->productId = $addon['id'];
                $itemAddon->quantity = $addon['quantity'];

                if($addon['sizeable'] && $addon['sizeId']) {
                    $itemAddon->sizeId = $addon['sizeId'];
                }
                $itemAddon->save();
            }
        }
    }

    /**
     * @param $collection
     * @return mixed
     */
    private function assignHumanReadableTimestamps($collection) {

        foreach($collection as $model) {
            $model->createdAtHuman = $model->created_at->timezone('America/Los_Angeles')->format('F jS Y | g:i A');
        }

        return $collection;
    }
}

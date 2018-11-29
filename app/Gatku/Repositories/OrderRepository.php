<?php
namespace Gatku\Repositories;

use App\Mail\EmailsOrder;
use App\Mail\EmailsOrderAdmin;
use Gatku\Model\Customer;
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

    /**
     * @var EmailSettings
     */
    private $emailSettings;

    /**
     * @var EmailSettingsRepository
     */
    private $emailSettingsRepository;

    /**
     * @var HomeSetting
     */
    private $homeSetting;

    /**
     * OrderRepository constructor.
     * @param CustomerRepository $customer
     * @param EmailSettingsRepository $emailSettingsRepository
     * @param HomeSetting $homeSetting
     */
    public function __construct(
        CustomerRepository $customer,
        EmailSettingsRepository $emailSettingsRepository,
        HomeSetting $homeSetting
    ) {
        $this->customer = $customer;
        $this->emailSettingsRepository = $emailSettingsRepository;
        $this->homeSetting = $homeSetting;
    }

    /**
     * @return Order[]|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection|\Illuminate\Database\Query\Builder[]|\Illuminate\Support\Collection|mixed
     */
    public function all() {
        $orders = Order::with('items.addons.product', 'items.product', 'customer', 'items.size', 'tracking','shipping')->orderBy('created_at', 'desc')->take(10)->get();
        $orders = $this->assignHumanReadableTimestamps($orders);
        return $orders;
    }

    /**
     * @return mixed
     */
    public function getAllRecordsCount()
    {
        $totalCount = \DB::table('orders')->count();
        return $totalCount;
    }

    /**
     * @return Order[]|\Illuminate\Database\Eloquent\Builder[]|\Illuminate\Database\Eloquent\Collection
     */
    public function getAllRecords()
    {
        $orders = Order::with('items.addons.product', 'items.product', 'customer', 'items.size', 'tracking', 'shipping')->orderBy('created_at', 'desc')->get();
        return $orders;
    }

    /**
     * @param $id
     * @return bool
     */
    public function get($id) {
        try {
            $order = Order::findOrFail($id);
            $order->load('customer', 'items');
        } catch (\Exception $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            return false;
        }

        return $order;
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

        $this->prepareEmailAddressesForEmailNotifications($customer, $order, $discount, $subtotal, $shipping, $total);

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
    public function calculateSubTotal($order, $discountObj) {

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


        if ($subtotal && $this->homeSetting->global_discount_switch) {

            $amount = ($subtotal * ( $this->homeSetting->global_discount_percentage / 100 )) / 100;
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
     * @param Order $order
     * @param Discount $discount
     * @return float|int
     */
    public function calculateShipping(Order $order, Discount $discount) {

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

        //Commented for Troy's request
        //if ($this->homeSetting->global_discount_switch && count($poles) > 0) return 0;

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
    public function calculateTotal(Order $order, Discount $discount) {

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

                $itemAddon->include_in_package = ($addon['include_in_package']) ? $addon['include_in_package'] : 0;
                $itemAddon->price_zero = ($addon['price_zero']) ? $addon['price_zero'] : 0;

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

    /**
     * @param Customer $customer
     * @return array
     */
    private function createEmailListForEmailsOrder(Customer $customer)
    {
        $emailList = [];

        if ($customer->email) {
            $emailList[] = [
                'email' => $customer->email,
                'name' => $customer->fullName
            ];
        }

        if ($this->emailSettings['customer_order_notify_email_1']) {
            $emailList[] = [
                'email' => $this->emailSettings['customer_order_notify_email_1'],
                'name' => $this->emailSettings['customer_order_notify_name_1']
            ];
        }

        if ($this->emailSettings['customer_order_notify_email_2']) {
            $emailList[] = [
                'email' => $this->emailSettings['customer_order_notify_email_2'],
                'name' => $this->emailSettings['customer_order_notify_name_2']
            ];
        }

        if ($this->emailSettings['customer_order_notify_email_3']) {
            $emailList[] = [
                'email' => $this->emailSettings['customer_order_notify_email_3'],
                'name' => $this->emailSettings['customer_order_notify_name_3']
            ];
        }

        if ($this->emailSettings['customer_order_notify_email_4']) {
            $emailList[] = [
                'email' => $this->emailSettings['customer_order_notify_email_4'],
                'name' => $this->emailSettings['customer_order_notify_name_4']
            ];
        }

        if ($this->emailSettings['customer_order_notify_email_5']) {
            $emailList[] = [
                'email' => $this->emailSettings['customer_order_notify_email_5'],
                'name' => $this->emailSettings['customer_order_notify_name_5']
            ];
        }

        return $emailList;
    }

    /**
     * @return array
     */
    private function createEmailListForEmailsOrderAdmin()
    {
        $emailList = [];

        if ($this->emailSettings['admin_order_notify_email_1']) {
            $emailList[] = [
                'email' => $this->emailSettings['admin_order_notify_email_1'],
                'name' => $this->emailSettings['admin_order_notify_name_1']
            ];
        }

        if ($this->emailSettings['admin_order_notify_email_2']) {
            $emailList[] = [
                'email' => $this->emailSettings['admin_order_notify_email_2'],
                'name' => $this->emailSettings['admin_order_notify_name_2']
            ];
        }

        if ($this->emailSettings['admin_order_notify_email_3']) {
            $emailList[] = [
                'email' => $this->emailSettings['admin_order_notify_email_3'],
                'name' => $this->emailSettings['admin_order_notify_name_3']
            ];
        }

        if ($this->emailSettings['admin_order_notify_email_4']) {
            $emailList[] = [
                'email' => $this->emailSettings['admin_order_notify_email_4'],
                'name' => $this->emailSettings['admin_order_notify_name_4']
            ];
        }

        if ($this->emailSettings['admin_order_notify_email_5']) {
            $emailList[] = [
                'email' => $this->emailSettings['admin_order_notify_email_5'],
                'name' => $this->emailSettings['admin_order_notify_name_5']
            ];
        }

        return $emailList;
    }

    /**
     * @param Customer $customer
     * @param Order $order
     * @param Discount $discount
     * @param $subtotal
     * @param $shipping
     * @param $total
     * @return bool
     */
    public function prepareEmailAddressesForEmailNotifications(
        Customer $customer,
        Order $order,
        Discount $discount,
        $subtotal,
        $shipping,
        $total)
    {
        $this->uploadEmailSettingsIfNotSet();

        $emailListForEmailsOrderArray = $this->createEmailListForEmailsOrder($customer);
        $emailListForEmailsOrderAdminArray = $this->createEmailListForEmailsOrderAdmin();

        return $this->sendEmailNotifications(
            $order,
            $discount,
            $subtotal,
            $shipping,
            $total,
            $emailListForEmailsOrderArray,
            $emailListForEmailsOrderAdminArray
        );
    }

    /**
     * @param Order $order
     * @param Discount $discount
     * @param $subtotal
     * @param $shipping
     * @param $total
     * @param array|null $emailListForEmailsOrderArray
     * @param array|null $emailListForEmailsOrderAdminArray
     * @return bool
     */
    public function sendEmailNotifications(
        Order $order,
        Discount $discount,
        $subtotal,
        $shipping,
        $total,
        array $emailListForEmailsOrderArray = null,
        array $emailListForEmailsOrderAdminArray = null
    )
    {
        $this->uploadEmailSettingsIfNotSet();

        $date = Carbon::now()->timezone('America/Los_Angeles')->format('F jS Y | g:i A T');

        if (App::environment('production')) {

            //Send email to Customer and Notify Seller
            if ($emailListForEmailsOrderArray && !empty($emailListForEmailsOrderArray)) {
                Mail::to($emailListForEmailsOrderArray)->send(new EmailsOrder(
                            $order,
                            $discount,
                            $subtotal,
                            $shipping,
                            $total,
                            $date,
                            $this->homeSetting,
                            $this->emailSettings
                ));

            }

            //Send email to Sellers
            if ($emailListForEmailsOrderAdminArray && !empty($emailListForEmailsOrderAdminArray)) {
                Mail::to($emailListForEmailsOrderAdminArray)->send(new EmailsOrderAdmin(
                            $order,
                            $discount,
                            $subtotal,
                            $shipping,
                            $total,
                            $date,
                            $this->homeSetting,
                            $this->emailSettings
                ));
            }
        }

        if (App::environment('dev')) {
            if (isset($_ENV['test_transaction_email'])) {
                Mail::to([
                    [
                        'email' => 'past-email-address-here',
                        'name' => 'past-recipient-name-here'
                    ]
                ])->send(new EmailsOrderAdmin(
                        $order,
                        $discount,
                        $subtotal,
                        $shipping,
                        $total,
                        $date,
                        $this->homeSetting,
                        $this->emailSettings)
                );
            }
        }

        return true;
    }

    //Make sure EmailSettings are loaded!!!!
    private function uploadEmailSettingsIfNotSet()
    {
        if (!$this->emailSettings) {
            $this->emailSettings = $this->emailSettingsRepository->getLastRecordFromDatabase();
        }
    }
}

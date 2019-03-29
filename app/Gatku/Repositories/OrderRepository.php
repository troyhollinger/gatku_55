<?php
namespace Gatku\Repositories;

use App\Mail\EmailsOrder;
use App\Mail\EmailsOrderAdmin;
use Gatku\Model\Customer;
use Gatku\Model\EmailSettings;
use Gatku\Model\Order;
use Gatku\Model\OrderItem;
use Gatku\Model\SalesTax;
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
use Gatku\Service\CalculateOrdersService;

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
     * @var SalesTaxRepository
     */
    private $salesTaxRepository;
    /**
     * @var CalculateOrdersService
     */
    private $calculateOrdersService;

    /**
     * OrderRepository constructor.
     * @param CustomerRepository $customer
     * @param EmailSettingsRepository $emailSettingsRepository
     * @param HomeSetting $homeSetting
     * @param SalesTaxRepository $salesTaxRepository
     * @param CalculateOrdersService $calculateOrdersService
     */
    public function __construct(
        CustomerRepository $customer,
        EmailSettingsRepository $emailSettingsRepository,
        HomeSetting $homeSetting,
        SalesTaxRepository $salesTaxRepository,
        CalculateOrdersService $calculateOrdersService
    ) {
        $this->customer = $customer;
        $this->emailSettingsRepository = $emailSettingsRepository;
        $this->homeSetting = $homeSetting;
        $this->salesTaxRepository = $salesTaxRepository;
        $this->calculateOrdersService = $calculateOrdersService;
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

            //Get tax record form sales_tax table
            /** @var SalesTax $salesTax */
            $salesTax = $this->salesTaxRepository->get($customer->state);

            //Create and store Order
            $order = new Order;
            $order = $this->assignFields($order, $customer, $input['form'], $salesTax);
            $order->save();

            //Assign and store order items
            $this->assignOrderItems($order, $input['items'], true);

            $order->load('items.addons.product.type','items.addons.size', 'items.product.type', 'customer', 'items.size');

            //Discount part
            $discount = new Discount;

            if (isset($input['discount']['code'])) {
                $discount = $discount->find($input['discount']['code']);
            }

            //Make all sum calculations
            $orderCalculations = $this->calculateOrdersService->getOrderCalculations($order, $discount);

            $subtotal = $orderCalculations['subtotal'];
            $shipping = $orderCalculations['shipping'];
            $taxAmount = $orderCalculations['tax'];
            $total = $orderCalculations['total'];

            //Update Order
            $order->discount_percentage = ($discount->discount) ? $discount->discount * 100 : 0;
            $order->order_sum = $subtotal;
            $order->shipping_cost = $shipping;
            $order->tax_amount = $taxAmount;
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

        $this->prepareEmailAddressesForEmailNotifications(
            $customer,
            $order,
            $discount,
            $subtotal,
            $shipping,
            $taxAmount,
            $total
        );

        return true;
    }

    /**
     * @param $order
     * @param $customer
     * @param $input
     * @param $salesTax
     * @return mixed
     */
    private function assignFields($order, $customer, $input, $salesTax) {

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
        $order->sales_tax = $salesTax->tax;
        $order->tax_amount = (isset($input['tax_amount'])) ? $input['tax_amount'] * 100 : 0;

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
     * @param $items
     * @param bool $store
     * @return array
     */
    public function assignOrderItems($order, $items, $store = false) {

        $orderItems = [];
        $orderAddons = [];

        foreach($items as $item) {

            $orderItem = new OrderItem;

            //This id is used only for front end calculation
            if (isset($item['itemId'])) {
                $orderItem->id = $item['itemId'];
            }

            $orderItem->orderId = $order->id;
            $orderItem->productId = $item['id'];
            $orderItem->quantity = $item['quantity'];

            if ($item['sizeable'] && $item['sizeId']) {
                $orderItem->sizeId = $item['sizeId'];
            }

            if ($store) {
                $orderItem->save();
            }

            $orderItems[] = $orderItem;

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

                if ($store) {
                    $itemAddon->save();
                }

                $orderAddons[] = $itemAddon;
            }
        }

        return [
            $orderItems,
            $orderAddons
        ];
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
     * @param $taxAmount
     * @param $total
     * @return bool
     */
    public function prepareEmailAddressesForEmailNotifications(
        Customer $customer,
        Order $order,
        Discount $discount,
        $subtotal,
        $shipping,
        $taxAmount,
        $total
    )
    {
        $this->uploadEmailSettingsIfNotSet();

        $emailListForEmailsOrderArray = $this->createEmailListForEmailsOrder($customer);
        $emailListForEmailsOrderAdminArray = $this->createEmailListForEmailsOrderAdmin();

        return $this->sendEmailNotifications(
            $order,
            $discount,
            $subtotal,
            $shipping,
            $taxAmount,
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
     * @param $taxAmount
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
        $taxAmount,
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
                            $taxAmount,
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
                            $taxAmount,
                            $total,
                            $date,
                            $this->homeSetting,
                            $this->emailSettings
                ));
            }
        }

        //Development test code
        if (App::environment('dev')) {

            $email = env('DEV_TEST_EMAIL', false);

            if ($email) {

                //Admin Order Confirmation
                Mail::to([
                    [
                        'email' => $email,
                        'name' => 'past-recipient-name-here'
                    ]
                ])->send(new EmailsOrderAdmin(
                        $order,
                        $discount,
                        $subtotal,
                        $shipping,
                        $taxAmount,
                        $total,
                        $date,
                        $this->homeSetting,
                        $this->emailSettings
                ));

                //Customer Order Confirmation
                Mail::to([
                    [
                        'email' => $email,
                        'name' => 'past-recipient-name-here'
                    ]
                ]

                )->send(new EmailsOrder(
                    $order,
                    $discount,
                    $subtotal,
                    $shipping,
                    $taxAmount,
                    $total,
                    $date,
                    $this->homeSetting,
                    $this->emailSettings
                ));
            }
        }

        return true;
    }

    /**
     * @param string $start
     * @param string $end
     * @return mixed
     */
    public function quantityReport($start, $end)
    {
        //Set default value
        $oiPeriod = "";
        $oiaPeriod = "";

        //Change if start and end dates passed
        if ($start && $end) {
            $oiPeriod = " AND oi.created_at BETWEEN :oi_start_date AND :oi_end_date";
            $oiaPeriod = " AND oia.created_at BETWEEN :oia_start_date AND :oia_end_date";
        }

        $sql = "SELECT product_id,
                       product_name,
                       SUM(order_item_quantity) AS order_item_quantity,
                       SUM(order_item_addons_quantity) AS order_item_addons_quantity,
                       (SUM(order_item_quantity) + SUM(order_item_addons_quantity)) AS total_quantity
                FROM (
                    SELECT  p.id AS product_id,
                            p.name AS product_name,
                            IFNULL(SUM(oi.quantity), 0) AS order_item_quantity,
                            0 AS order_item_addons_quantity
                    FROM products p
                        LEFT JOIN order_items oi ON oi.productId = p.id $oiPeriod  
                    GROUP BY p.id

                    UNION ALL

                    SELECT  p.id AS product_id,
                            p.name AS product_name,
                            0 AS order_item_quantity,
                            IFNULL(SUM(oia.quantity), 0) AS  order_item_addons_quantity
                    FROM products p
                        LEFT JOIN order_item_addons oia ON oia.productId = p.id $oiaPeriod 
                    GROUP BY p.id
                ) t
                GROUP BY t.product_id, t.product_name
                ORDER BY t.product_name
        ";

        //I don't know why byt every single param must be bind separate.
        //The same neme param can't be used multiple times.
        $bindings = [
            ':oi_start_date' => $start,
            ':oia_start_date' => $start,
            ':oi_end_date' => $end,
            ':oia_end_date' => $end
        ];

        $products = DB::select($sql, $bindings);

        return $products;
    }

    //Make sure EmailSettings are loaded!!!!
    private function uploadEmailSettingsIfNotSet()
    {
        if (!$this->emailSettings) {
            $this->emailSettings = $this->emailSettingsRepository->getLastRecordFromDatabase();
        }
    }
}

<?php

namespace App\Http\Controllers;

use Gatku\Model\Discount;
use Gatku\Model\EmailSettings;
use Gatku\Model\HomeSetting;
use Gatku\Repositories\CustomerRepository;
use Gatku\Repositories\EmailSettingsRepository;
use Gatku\Repositories\OrderRepository;
use App\Mail\EmailsOrderAdmin;
use App\Mail\EmailsOrder;

class DisplayOrderNotificationEmailController extends BaseController {

    /**
     * @var OrderRepository
     */
	protected $orderRepository;
    /**
     * @var CustomerRepository
     */
	protected $customerRepository;

    /**
     * @var HomeSetting
     */
    private $homeSetting;
    /**
     * @var EmailSettings
     */
    private $emailSettings;

    /**
     * DisplayOrderNotificationEmailController constructor.
     * @param OrderRepository $order
     * @param CustomerRepository $customerRepository
     * @param EmailSettingsRepository $emailSettingsRepository
     * @param HomeSetting $homeSetting]
     */
    public function __construct(
        OrderRepository $order,
        CustomerRepository $customerRepository,
        EmailSettingsRepository $emailSettingsRepository,
        HomeSetting $homeSetting
    ) {
		$this->orderRepository = $order;
		$this->customerRepository = $customerRepository;

        $this->homeSetting = $homeSetting;
        $this->emailSettings = $emailSettingsRepository->getLastRecordFromDatabase();

        parent::__construct();
	}

    /**
     * @param $id
     * @return mixed
     */
	public function admin($id) {
        $order = $this->orderRepository->get($id);

        //@TODO This is hack just to make it work. In future add relation to Discount and make it work.
        $discount = new Discount;

        return new EmailsOrderAdmin(
            $order,
            $discount,
            $order->order_sum,
            $order->shipping_sum,
            $order->total_sum,
            $order->created_at,
            $this->homeSetting,
            $this->emailSettings);
	}

    /**
     * @param $id
     * @return mixed
     */
    public function customer($id) {
        $order = $this->orderRepository->get($id);

        //@TODO This is hack just to make it work. In future add relation to Discount and make it work.
        $discount = new Discount;

        return new EmailsOrder(
            $order,
            $discount,
            $order->order_sum,
            $order->shipping_sum,
            $order->total_sum,
            $order->created_at,
            $this->homeSetting,
            $this->emailSettings);
    }
}

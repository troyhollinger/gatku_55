<?php

namespace App\Http\Controllers;

use Gatku\Model\Order;
use Gatku\Repositories\DiscountRepository;
use Gatku\Repositories\OrderRepository;
use Gatku\Repositories\ProductRepository;
use Gatku\Repositories\SizeRepository;
use Gatku\Service\CalculateOrdersService;
use \Request;
use \Response;
use Gatku\Model\Discount;
use Gatku\Model\HomeSetting;

class CartCalculationsController extends BaseController {

    /**
     * @var HomeSetting
     */
    private $homeSetting;
    /**
     * @var DiscountRepository
     */
    private $discountRepository;
    /**
     * @var OrderRepository
     */
    private $orderRepository;
    /**
     * @var ProductRepository
     */
    private $productRepository;
    /**
     * @var SizeRepository
     */
    private $sizeRepository;
    /**
     * @var CalculateOrdersService
     */
    private $calculateOrdersService;

    /**
     * CartCalculationsController constructor.
     * @param HomeSetting $homeSetting
     * @param DiscountRepository $discountRepository
     * @param OrderRepository $orderRepository
     * @param ProductRepository $productRepository
     * @param SizeRepository $sizeRepository
     * @param CalculateOrdersService $calculateOrdersService
     */
    public function __construct(
        HomeSetting $homeSetting,
        DiscountRepository $discountRepository,
        OrderRepository $orderRepository,
        ProductRepository $productRepository,
        SizeRepository $sizeRepository,
        CalculateOrdersService $calculateOrdersService
    )
    {
        parent::__construct();

        $this->homeSetting = $homeSetting;
        $this->discountRepository = $discountRepository;
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
        $this->sizeRepository = $sizeRepository;
        $this->calculateOrdersService = $calculateOrdersService;
    }

    /**
     * @return mixed
     */
    public function getCalculations()
    {
        $input = Request::all();

        $discount = $this->getDiscount($input['discount']);
        $order = $this->getOrder($input['items']);

        $orderCalc = $this->calculateOrdersService->getOrderCalculations($order, $discount);

        return Response::json($orderCalc, 200);
    }

    /**
     * @param array|null $discountArray
     * @return Discount
     */
    private function getDiscount(?array $discountArray) :Discount
    {
        $discount = null;
        if (isset($discountArray['code'])) {
            $discount = $this->discountRepository->get($discountArray['code']);
        }

        return  $discount ?: new Discount();
    }

    /**
     * @param array|null $inputItems
     * @return Order
     */
    private function getOrder(?array $inputItems) :Order
    {
        $order = new Order;

        //Add temp itemId and itemOrderId for items and addons
        if (!empty($inputItems)) {
            foreach($inputItems as $itemKey => $item) {
                $inputItems[$itemKey]['itemId'] = $itemKey;
            }
        }

        list($orderItems, $orderAddons) = $this->orderRepository->assignOrderItems($order, $inputItems, false);

        $items = $this->addProductAndSizesToItemsAndAddons($orderItems);
        $addons = $this->addProductAndSizesToItemsAndAddons($orderAddons);

        //Merge addons with items
        if (!empty($addons)) {
            foreach($addons as $addon) {
                if (isset($items[$addon->orderItemId])) {
                    $items[$addon->orderItemId]->addons[] = $addon;
                }
            }
        }

        //Assign items to order
        $order->items = $items;

        return $order;
    }

    /**
     * This function pull product and size for Order Items and Order Addons
     *
     * @param $items
     * @return mixed
     */
    private function addProductAndSizesToItemsAndAddons($items)
    {
        if (!empty($items)) {
            foreach($items as $item) {
                if (isset($item->productId)) {
                    $item->product = $this->productRepository->getOnlyProduct($item->productId);
                }
                if (isset($item->sizeId)) {
                    $item->size = $this->sizeRepository->get($item->sizeId);
                }
            }
        }

        return $items;
    }
}
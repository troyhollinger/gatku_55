<?php

namespace App\Http\Controllers;

use Gatku\Service\XpsshipperCommunicationService;
use \Request;
use \Response;

class XpsshipperController extends BaseController {

    /**
     * @var XpsshipperCommunicationService
     */
    private $xpsshipperCommunicationService;
    
    /**
     * XpsshipperController constructor.
     * @param XpsshipperCommunicationService $xpsshipperCommunicationService
     */
    public function __construct(
        XpsshipperCommunicationService $xpsshipperCommunicationService
    )
    {
        parent::__construct();
        $this->xpsshipperCommunicationService = $xpsshipperCommunicationService;
    }

    /**
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getServicesList()
    {
        $orderCalc = $this->xpsshipperCommunicationService->getServicesList();
        return Response::make($orderCalc);
    }

    /**
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getIntegratedQuotingOptions()
    {
        $orderCalc = $this->xpsshipperCommunicationService->getIntegratedQuotingOptions();
        return Response::make($orderCalc);
    }

    /**
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getQuote()
    {
        $quote = $this->xpsshipperCommunicationService->getQuote();
        return Response::make($quote);
    }

    /**
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function deleteOrder()
    {
        $quote = $this->xpsshipperCommunicationService->deleteOrder();
        return Response::make($quote);
    }

    /**
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function putOrder()
    {
        $quote = $this->xpsshipperCommunicationService->putOrder();
        return Response::make($quote);
    }

    /**
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function retrieveShipment()
    {
        $quote = $this->xpsshipperCommunicationService->retrieveShipment();
        return Response::make($quote);
    }

    /**
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function retrieveShipmentLabel()
    {
        $quote = $this->xpsshipperCommunicationService->retrieveShipmentLabel();
        //This should return PDF then we need to add PDF header to Response
        return Response::make($quote)->header('Content-Type', 'application/pdf');
    }
}
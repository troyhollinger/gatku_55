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
        $bookNumber = 15655343; //This is example i got from https://xpsshipper.com/ec/#/history then pick one product

        $quote = $this->xpsshipperCommunicationService->retrieveShipment($bookNumber);
        return Response::make($quote);
    }

    /**
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function retrieveShipments()
    {
        $bookNumber = 15655343; //This is example i got from https://xpsshipper.com/ec/#/history then pick one product
        $limit = 100;

        $quote = $this->xpsshipperCommunicationService->retrieveShipments($bookNumber, $limit);
        return Response::make($quote);
    }

    /**
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function searchShipments()
    {
        $keyword = '15655343'; //Any value you are searching

        $quote = $this->xpsshipperCommunicationService->searchShipments($keyword);
        return Response::make($quote);
    }

    /**
     * @return mixed
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function retrieveShipmentLabel()
    {
        $bookNumber = 15655343; //This is example i got from https://xpsshipper.com/ec/#/history then pick one product

        $quote = $this->xpsshipperCommunicationService->retrieveShipmentLabel($bookNumber);
        //This should return PDF then we need to add PDF header to Response
        return Response::make($quote)->header('Content-Type', 'application/pdf');
    }
}
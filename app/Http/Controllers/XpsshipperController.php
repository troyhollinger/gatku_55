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
     */
    public function getServicesList()
    {
        $orderCalc = $this->xpsshipperCommunicationService->getServicesList();
        return Response::json($orderCalc, 200);
    }
}
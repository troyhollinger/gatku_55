<?php 
namespace Gatku\Service;

use Gatku\Model\HomeSetting;

/**
 * https://xpsshipper.com/restapi/docs/v1-ecommerce/endpoints/overview/
 *
 * Class XpsshipperCommunicationService
 * @package Gatku\Service
 */
class XpsshipperCommunicationService
{
    //constants
    const API_HOST  = "XPSSHIPPER_API_HOST";
    const API_KEY   = "XPSSHIPPER_API_KEY";
    const CUST_ID   = "XPSSHIPPER_CUSTOMER_ID";
    const INTEGR_ID = "XPSSHIPPER_INTEGRATION_ID";
    //constants - end

    /**
     * @var string
     */
    private $xpsshipper_api_host;
    /**
     * @var string
     */
    private $xpsshipper_api_key;
    /**
     * @var string
     */
    private $xpsshipper_customer_id;
    /**
     * @var string
     */
    private $xpsshipper_integration_id;
    
    /**
     * XpsshipperCommunicationService constructor.
     */
    public function __construct()
    {
        $this->xpsshipper_api_host          = env(self::API_HOST, "xpsshipper.com API HOST not set.");
        $this->xpsshipper_api_key           = env(self::API_KEY, "xpsshipper.com API KEY not set.");
        $this->xpsshipper_customer_id       = env(self::CUST_ID, "xpsshipper.com CUSTOMER ID not set.");
        $this->xpsshipper_integration_id    = env(self::INTEGR_ID, "xpsshipper.com INTEGRATION ID not set.");
    }

    public function getServicesList()
    {
        $servicesList = '';
echo "$this->xpsshipper_api_host" . PHP_EOL;
echo "$this->xpsshipper_api_key" . PHP_EOL;
echo "$this->xpsshipper_customer_id" . PHP_EOL;
echo "$this->xpsshipper_integration_id" . PHP_EOL;

        return $servicesList;
    }
}


<?php 
namespace Gatku\Service;

use \GuzzleHttp\Client;

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
     * @var Client
     */
    private $client;
    
    /**
     * XpsshipperCommunicationService constructor.
     * @param Client $client
     */
    public function __construct(Client $client)
    {
        $this->client                       = $client;
        $this->xpsshipper_api_host          = env(self::API_HOST, "xpsshipper.com API HOST not set.");
        $this->xpsshipper_api_key           = env(self::API_KEY, "xpsshipper.com API KEY not set.");
        $this->xpsshipper_customer_id       = env(self::CUST_ID, "xpsshipper.com CUSTOMER ID not set.");
        $this->xpsshipper_integration_id    = env(self::INTEGR_ID, "xpsshipper.com INTEGRATION ID not set.");
    }

    public function getServicesList()
    {
        $servicesList = '';
        
        $url = $this->xpsshipper_api_host . '/restapi/v1/customers/' . $this->xpsshipper_customer_id . '/services';

        $response = $this->client->request('GET', $url, [
            'headers' => [
                'Authorization' => ' RSIS ' . $this->xpsshipper_api_key
            ]
        ]);

        $statusCode = $response->getStatusCode();

        if ($statusCode == 200) {
            $servicesList = $response->getBody()->getContents();
        } else {
            throw new \Exception("Request returned status: " . $statusCode );
        }

        //Process json to be array because Response::json need array to avoid double escaping.
        return json_decode($servicesList);
    }
    
    private function setHeaders(array $headers)
    {
//        $response = $this->client->request('GET', $url, [
//            'headers' => [
//                'Authorization' => ' RSIS ' . $this->xpsshipper_api_key
//            ]
//        ]);
    }
    
    private function setRequestParams(array $params)
    {
//        $client->request('POST', '/post', [
//            'form_params' => [
//                'foo' => 'bar',
//                'baz' => ['hi', 'there!']
//            ]
    }

    private function buildUrl()
    {}

    private function buildRequest(string $requestType, string $endpoint, array $options)
    {}
}


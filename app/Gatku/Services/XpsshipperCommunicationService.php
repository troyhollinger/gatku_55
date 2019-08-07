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
    const API_HOST     = "XPSSHIPPER_API_HOST";
    const API_KEY      = "XPSSHIPPER_API_KEY";
    const CUST_ID      = "XPSSHIPPER_CUSTOMER_ID";
    const INTEGR_ID    = "XPSSHIPPER_INTEGRATION_ID";
    const REQUEST_GET  = 'GET';
    const REQUEST_POST = 'POST';
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
        $url = $this->xpsshipper_api_host . '/restapi/v1/customers/' . $this->xpsshipper_customer_id . '/services';
        $response = $this->sendRequest(self::REQUEST_GET, $url);
        return $response;
    }

    /**
     * @param string $requestMethod
     * @param string $url
     * @param array|null $headers
     * @param array|null $params
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function sendRequest(string $requestMethod, string $url, ?array $headers = null, ?array $params = null): string
    {
        $options = array_merge($this->getHeaders($headers), $this->getRequestParams($params));

        try {
            $response = $this->client->request($requestMethod, $url, $options);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }

        return $response->getBody()->getContents();
    }

    /**
     * @param array $additionalHeaders
     * @return array
     */
    private function getHeaders(?array $additionalHeaders = null):array
    {
        $headers = $this->getAuthorizationHeader();

        if ($additionalHeaders) {
            $headers = array_merge($headers, $additionalHeaders);
        }

        return [
            'headers' => $headers
        ];
    }

    /**
     * @return array
     */
    private function getAuthorizationHeader():array
    {
        return [
            'Authorization' => ' RSIS ' . $this->xpsshipper_api_key
        ];
    }

    /**
     * @param array $params
     * @return array
     */
    private function getRequestParams(?array $params = null):array
    {
        $paramsArray = [];

        if (!empty($params)) {
            $paramsArray = [
                'form_params' => $params
            ];
        }

        return $paramsArray;
    }
}


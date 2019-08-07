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
    const API_HOST       = "XPSSHIPPER_API_HOST";
    const API_KEY        = "XPSSHIPPER_API_KEY";
    const CUST_ID        = "XPSSHIPPER_CUSTOMER_ID";
    const INTEGR_ID      = "XPSSHIPPER_INTEGRATION_ID";
    const REQUEST_GET    = 'GET';
    const REQUEST_DELETE = 'DELETE';
    const REQUEST_POST   = 'POST';
    const REQUEST_PUT    = 'PUT';
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

    /**
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getServicesList()
    {
        $url = $this->xpsshipper_api_host . '/restapi/v1/customers/' . $this->xpsshipper_customer_id . '/services';
        $response = $this->sendRequest(self::REQUEST_GET, $url);
        return $response;
    }

    /**
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getIntegratedQuotingOptions()
    {
        $url = $this->xpsshipper_api_host . '/restapi/v1/customers/' . $this->xpsshipper_customer_id
               . '/integratedQuotingOptions';
        $response = $this->sendRequest(self::REQUEST_GET, $url);
        return $response;
    }

    /**
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getQuote()
    {
        $json = '
        {
  "carrierCode": "usps",
  "serviceCode": "usps_first_class",
  "packageTypeCode": "usps_custom_package",
  "sender": {
    "country": "US",
    "zip": "84117"
  },
  "receiver": {
    "city": "Salt Lake City",
    "country": "US",
    "zip": "84106",
    "email":"foo@bar.com"
  },
  "residential": true,
  "signatureOptionCode": "DIRECT",
  "contentDescription": "stuff and things",
  "weightUnit": "oz",
  "dimUnit": "in",
  "currency": "USD",
  "customsCurrency": "USD",
  "pieces": [
    {
      "weight": "14",
      "length": "5.1",
      "width": "4",
      "height": "2.5",
      "insuranceAmount": "12.15",
      "declaredValue": null
    }
  ],
  "billing": {
    "party": "sender"
  }
}';

        $additionalHeaders = ['Content-Type' => 'application/json'];

        $url = $this->xpsshipper_api_host . '/restapi/v1/customers/' . $this->xpsshipper_customer_id . '/quote';
        $response = $this->sendRequest(self::REQUEST_POST, $url, $additionalHeaders, $json);
        return $response;
    }

    /**
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function deleteOrder()
    {
        $orderId = 1234;

        $url = $this->xpsshipper_api_host . '/restapi/v1/customers/' . $this->xpsshipper_customer_id
               . '/integrations/' . $this->xpsshipper_integration_id . '/orders/' . $orderId;
        $response = $this->sendRequest(self::REQUEST_DELETE, $url);
        return $response;
    }

    /**
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function putOrder()
    {
        $orderId = 1234;

        $json = '
        {
  "orderId": "'. $orderId.'",
  "orderDate": "2019-08-07",
  "orderNumber": "'. $orderId.'",
  "fulfillmentStatus": "pending",
  "shippingService": "Standard",
  "shippingTotal": "1.24",
  "weightUnit": "lb",
  "dimUnit": "in",
  "dueByDate": "2019-07-10",
  "orderGroup": "Workstation 1",
  "sender": {
    "name": "Troy Hollinger",
    "company": "Gatku",
    "address1": "1250 Pioneer Way Ste H",
    "address2": "",
    "city": "El Cajon",
    "state": "CA",
    "zip": "92020",
    "country": "US",
    "phone": "6192521850",
    "email": "troy@gatku.com"
  },
  "receiver": {
    "name": "Marcin Wojcik",
    "company": "",
    "address1": "12646 Springbrook Dr. E",
    "address2": "",
    "city": "San Diego",
    "state": "CA",
    "zip": "92128",
    "country": "US",
    "phone": "6196652143",
    "email": "marcincyniu@gmail.com"
  }
}';

        $additionalHeaders = ['Content-Type' => 'application/json'];

        $url = $this->xpsshipper_api_host . '/restapi/v1/customers/' . $this->xpsshipper_customer_id
               . '/integrations/' . $this->xpsshipper_integration_id . '/orders/' . $orderId;
        $response = $this->sendRequest(self::REQUEST_PUT, $url, $additionalHeaders, $json);
        return $response;
    }

    /**
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function retrieveShipment()
    {
        $bookNumber = 15655343; //This is example i got from https://xpsshipper.com/ec/#/history then pick one product

        $url = $this->xpsshipper_api_host . '/restapi/v1/customers/' . $this->xpsshipper_customer_id
               . '/shipments/' . $bookNumber;
        $response = $this->sendRequest(self::REQUEST_GET, $url);
        return $response;
    }


    /**
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function retrieveShipmentLabel()
    {
        $bookNumber = 15655343; //This is example i got from https://xpsshipper.com/ec/#/history then pick one product

        //We pull PDF labels right now
        $url = $this->xpsshipper_api_host . '/restapi/v1/customers/' . $this->xpsshipper_customer_id
               . '/shipments/' . $bookNumber . '/label/PDF';
        $response = $this->sendRequest(self::REQUEST_GET, $url);
        return $response;
    }

    // Private

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
     * @param string $body
     * @return array
     */
    private function getRequestBody(?string $body = null):array
    {
        $bodyArray = [];

        if (!empty($body)) {
            $bodyArray = [
                'body' => $body
            ];
        }

        return $bodyArray;
    }

    /**
     * @param string $requestMethod
     * @param string $url
     * @param array|null $headers
     * @param string|null $body
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    private function sendRequest(string $requestMethod, string $url, ?array $headers = null, ?string $body = null): string
    {
        $options = array_merge($this->getHeaders($headers), $this->getRequestBody($body));

        try {
            $response = $this->client->request($requestMethod, $url, $options);
        } catch (\Exception $e) {
            throw new \Exception($e->getMessage());
        }

        return $response->getBody()->getContents();
    }
}


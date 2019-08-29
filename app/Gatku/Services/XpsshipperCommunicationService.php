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
        $url = $this->xpsshipper_api_host
               . '/restapi/v1/customers/'
               . $this->xpsshipper_customer_id
               . '/services';

        $response = $this->sendRequest(self::REQUEST_GET, $url);
        return $response;
    }

    /**
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function getIntegratedQuotingOptions()
    {
        $url = $this->xpsshipper_api_host
               . '/restapi/v1/customers/'
               . $this->xpsshipper_customer_id
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

        $url = $this->xpsshipper_api_host
               . '/restapi/v1/customers/'
               . $this->xpsshipper_customer_id
               . '/quote';

        $response = $this->sendRequest(self::REQUEST_POST, $url, $additionalHeaders, $json);
        return $response;
    }

    /**
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function deleteOrder()
    {
        $orderId = 12;

        $url = $this->xpsshipper_api_host
               . '/restapi/v1/customers/'
               . $this->xpsshipper_customer_id
               . '/integrations/'
               . $this->xpsshipper_integration_id
               . '/orders/'
               . $orderId;

        $response = $this->sendRequest(self::REQUEST_DELETE, $url);
        return $response;
    }

    /**
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function putOrder()
    {
        $orderId = 12;

        $json = '
        {
  "orderId": "' . $orderId . '",
  "orderDate": "2019-07-27",
  "orderNumber": "' . $orderId . '",
  "fulfillmentStatus": "pending",
  "shippingService": "ups_next_day_air",
  "shippingTotal": "8.24",
  "weightUnit": "lb",
  "dimUnit": "in",
  "dueByDate": "2019-07-30",
  "orderGroup": "Workstation 1",
  "sender": {
    "name": "Albert Jones",
    "company": "Jones Co.",
    "address1": "123 Some Street",
    "address2": "#54",
    "city": "Holladay",
    "state": "UT",
    "zip": "84117",
    "country": "US",
    "phone": "8015042351",
    "email": "albert@jones.egg"
  },
  "receiver": {
    "name": "Alice Janson",
    "company": "",
    "address1": "54 Green St.",
    "address2": "",
    "city": "Salt Lake City",
    "state": "UT",
    "zip": "84106",
    "country": "US",
    "phone": "8013920046",
    "email": "alice@jensen.egg"
  },
  "items": [
    {
      "productId": "856673",
      "sku": "ade3-fe21-bb9a",
      "title": "Socks",
      "price": "3.99",
      "quantity": 2,
      "weight": "0.5",
      "imgUrl": "http://sockstore.egg/img/856673",
      "htsNumber": "555555",
      "countryOfOrigin": "US",
      "lineId": "1"
    }
  ],
  "packages": [
    {
      "weight": "0.5",
      "length": "6",
      "width": "5",
      "height": "2.5",
      "insuranceAmount": null,
      "declaredValue": null
    }
  ]
}';

        $additionalHeaders = ['Content-Type' => 'application/json'];

        $url = $this->xpsshipper_api_host
               . '/restapi/v1/customers/'
               . $this->xpsshipper_customer_id
               . '/integrations/'
               . $this->xpsshipper_integration_id
               . '/orders/'
               . $orderId;

        $response = $this->sendRequest(self::REQUEST_PUT, $url, $additionalHeaders, $json);
        return $response;
    }

    /**
     * @param string $bookNumber
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function retrieveShipment(string $bookNumber)
    {
        $url = $this->xpsshipper_api_host
               . '/restapi/v1/customers/'
               . $this->xpsshipper_customer_id
               . '/shipments/'
               . $bookNumber;
        $response = $this->sendRequest(self::REQUEST_GET, $url);
        return $response;
    }

    /**
     * @param string $bookNumber
     * @param string $limit
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function retrieveShipments(string $bookNumber, string $limit = '100')
    {
        $url = $this->xpsshipper_api_host
               . '/restapi/v1/customers/'
               . $this->xpsshipper_customer_id
               . '/shipments?minBookNumber=' . $bookNumber
               . '&limit=' . $limit;
        $response = $this->sendRequest(self::REQUEST_GET, $url);
        return $response;
    }

    /**
     * @param string $keyword
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function searchShipments(string $keyword)
    {
        $json = '{ "keyword": "' . $keyword . '"}';

        $additionalHeaders = ['Content-Type' => 'application/json'];

        $url = $this->xpsshipper_api_host
               . '/restapi/v1/customers/'
               . $this->xpsshipper_customer_id
               . '/searchShipments';

        $response = $this->sendRequest(self::REQUEST_POST, $url, $additionalHeaders, $json);
        return $response;
    }


    /**
     * @param string $bookNumber
     * @return string
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function retrieveShipmentLabel(string $bookNumber)
    {
        //We pull PDF labels right now
        $url = $this->xpsshipper_api_host
               . '/restapi/v1/customers/'
               . $this->xpsshipper_customer_id
               . '/shipments/'
               . $bookNumber
               . '/label/PDF';

        $response = $this->sendRequest(self::REQUEST_GET, $url);
        return $response;
    }


    // Private methods

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


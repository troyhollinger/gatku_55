<?php 
namespace Gatku\Service;

use Gatku\Model\HomeSetting;
use Illuminate\Support\Facades\App;

class MailchimpService
{
    /**
     * @var HomeSetting
     */
    private $homeSetting;

    /**
     * MailchimpService constructor.
     * @param HomeSetting $homeSetting
     */
    public function __construct(HomeSetting $homeSetting)
    {
        $this->homeSetting = $homeSetting;
    }

    public function addSubscription($fname, $email, $country)
	{
        //Allow subscription only for production
        if (App::environment('production')) {

            if(!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL) === false){

                // MailChimp API credentials. Get from .env files
                $apiKey = env('MAILCHIMP_API_KEY', 'no api key');

                $listID = '793e0e910d'; // gatku customer

                if (strstr($this->homeSetting->hostname, 'gatku')) {
                    if(strtolower($country) == 'australia') {
                        $listID = '451477286e'; // austrelia
                    }
                } elseif (strstr($this->homeSetting->hostname , 'cristspears')) {
                    $listID = 'dec7c06bb6'; // cristspears
                }

                // MailChimp API URL
                $memberID = md5(strtolower($email));
                $dataCenter = substr($apiKey,strpos($apiKey,'-')+1);
                $url = 'https://' . $dataCenter . '.api.mailchimp.com/3.0/lists/' . $listID . '/members/' . $memberID;

                // member information
                $json = json_encode([
                    'email_address' => $email,
                    'status'        => 'subscribed',
                    'merge_fields'  => [
                        'FNAME'     => $fname
                    ]
                ]);

                // send a HTTP POST request with curl
                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_USERPWD, 'user:' . $apiKey);
                curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_TIMEOUT, 10);
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
                $result = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);
            }
        }
	}
}


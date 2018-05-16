<?php 
namespace Austen\Repositories;

class MailchimpRepository 
{
	public function addSubscription($fname, $email, $country) 
	{
		
	    if(!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL) === false){
	        // MailChimp API credentials
	        $apiKey = 'dbb4a319f336c9f4ceb826cb0c6f102e-us9';
	        if(strtolower($country) == 'australia'){
	        	$listID = '451477286e'; // austrelia
	        }else{
	        	$listID = '793e0e910d'; // gatku customer
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
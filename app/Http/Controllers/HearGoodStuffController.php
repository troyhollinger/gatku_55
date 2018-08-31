<?php

namespace App\Http\Controllers;

use Gatku\Service\MailchimpService;

class HearGoodStuffController extends BaseController {

    /**
     * @var MailchimpService
     */
    private $mailchimp;

    public function __construct(MailchimpService $mailchimp)
    {
        $this->mailchimp = $mailchimp;
    }

    /**
	 * Store a newly created resource in storage.
	 * POST /homesetting
	 *
	 * @return Response
	 */
	public function store() {

	    $post = \Request::all();

	    $email = $post['email'];
        $fname = 'Email registered throw gatku.com'.
	    $country = '';  // no country picked

        $this->mailchimp->addSubscription($fname, $email, $country);

		return \Response::json(['message' => 'Email address saved!'], 200);
	}
}
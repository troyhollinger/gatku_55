<?php

namespace App\Http\Controllers;

use Austen\Repositories\MailchimpRepository;

class HearGoodStuffController extends BaseController {

    /**
     * @var MailchimpRepository
     */
    private $mailchimp;

    public function __construct(MailchimpRepository $mailchimp)
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

	    $post = Input::all();

	    $email = $post['email'];
        $fname = 'Email registered throw gatku.com'.
	    $country = '';  // no country picked

        $this->mailchimp->addSubscription($fname, $email, $country);

		return Response::json(['message' => 'Email address saved!'], 200);
	}
}
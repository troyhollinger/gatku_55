<?php

namespace App\Http\Controllers;

use App\Mail\EmailsInquiry;
use Gatku\Service\MailchimpService;
use Gatku\Model\HomeSetting;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Request;

class QuoteController extends BaseController {

    protected $mailchimp;

    public function __construct(MailchimpService $mailchimp) {
        $this->mailchimp = $mailchimp;

        parent::__construct();
    }

	public function index(HomeSetting $homeSetting) {
		return View::make('pages.quote')->with('homeSetting',  $homeSetting);;
	}

	public function sendEmail() {

		$form = Request::all();
		$name = Request::get('name');

		if (App::environment('production')) {
            Mail::to([
                [
                    'email' => 'dustin@gatku.com',
                    'name' => 'Dustin McIntyre'
                ],
                [
                    'email' => 'nathan@gatku.com',
                    'name' => 'Nathan'
                ],
                [
                    'email' => 'troy@gatku.com',
                    'name' => 'Troy Hollinger'
                ],
            ])->send(new EmailsInquiry($form, $name));
		}

        $this->mailchimp->addSubscription(Request::get('name'), Request::get('email'), Request::get('country'));
	} 

}
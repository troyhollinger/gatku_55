<?php

namespace App\Http\Controllers;

use App\Mail\EmailsInquiry;
use Austen\Repositories\MailchimpRepository;
use Gatku\HomeSetting;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\View;

class QuoteController extends BaseController {

    protected $mailchimp;

    public function __construct(MailchimpRepository $mailchimp) {
        $this->mailchimp = $mailchimp;

        parent::__construct();
    }

	public function index() {
        $homeSetting = HomeSetting::orderBy('id', 'desc')->first();
		return View::make('pages.quote')->with('homeSetting',  $homeSetting);;
	}

	public function sendEmail() {

		$form = \Request::all();
		$name = \Request::get('name');

		if (App::environment('production')) {
            Mail::to([
                [
                    'email' => 'dustin@gatku.com',
                    'name' => 'Dustin McIntyre'
                ],
                [
                    'email' => 'emailme@troyhollinger.com',
                    'name' => 'Troy Hollinger'
                ]
            ])->send(new EmailsInquiry($form, $name));
		}

        $this->mailchimp->addSubscription(\Request::get('name'), \Request::get('email'), \Request::get('country'));
	} 

}
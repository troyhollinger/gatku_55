<?php

namespace App\Http\Controllers;

use Austen\Repositories\MailchimpRepository;

class QuoteController extends BaseController {

    protected $mailchimp;

    public function __construct(MailchimpRepository $mailchimp) {
        $this->mailchimp = $mailchimp;

        parent::__construct();
    }

	public function index() {

		return View::make('pages.quote');

	}

	public function sendEmail() {

		$form = Input::all();
		$name = Input::get('name');

		if (App::environment('production')) {

			Mail::queue('emails.inquiry', array('form' => $form), function($message) use ($name) {

			    $message->to('dustin@gatku.com', 'GATKU Polespears')->subject('New Shipping Inquiry from ' . $name);

			});

			Mail::queue('emails.inquiry', array('form' => $form), function($message) use ($name) {

			    $message->to('emailme@troyhollinger.com', 'Troy Hollinger')->subject('New Shipping Inquiry from ' . $name);

			});

		} 

		Mail::queue('emails.inquiry', array('form' => $form), function($message) use ($name) {

		    $message->to('austenpayan@gmail.com', 'Austen Payan')->subject('New Shipping Inquiry from ' . $name);

		});
        
        $this->mailchimp->addSubscription(Input::get('name'), Input::get('email'), Input::get('country'));
	
	} 

}
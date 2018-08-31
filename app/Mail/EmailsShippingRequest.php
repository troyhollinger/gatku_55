<?php

namespace App\Mail;

use Gatku\Model\ShippingRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailsShippingRequest extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var ShippingRequest
     */
    public $request;

    /**
     * EmailsShippingRequest constructor.
     * @param ShippingRequest $request
     */
    public function __construct(
        ShippingRequest $request
    )
    {
        $this->request = $request;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('GATKU | Shipping Request')->view('emails.shipping-request');
    }
}

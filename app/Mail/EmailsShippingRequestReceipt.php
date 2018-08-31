<?php

namespace App\Mail;

use Gatku\Model\ShippingRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailsShippingRequestReceipt extends Mailable
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
        return $this->subject('GATKU | Shipping Payment Receipt')->view('emails.shipping-request-receipt');
    }
}

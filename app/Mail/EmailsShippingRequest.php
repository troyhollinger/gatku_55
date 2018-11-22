<?php

namespace App\Mail;

use Gatku\Model\ShippingRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Gatku\Model\HomeSetting;

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
     * @param HomeSetting $homeSetting
     * @return EmailsShippingRequest
     */
    public function build(HomeSetting $homeSetting)
    {
        return $this->subject('GATKU | Shipping Request')->view('emails.shipping-request')->with('homeSetting', $homeSetting);
    }
}

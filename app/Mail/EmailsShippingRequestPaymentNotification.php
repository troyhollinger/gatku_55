<?php

namespace App\Mail;

use Gatku\Model\HomeSetting;
use Gatku\Model\ShippingRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailsShippingRequestPaymentNotification extends Mailable
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
     * @return EmailsShippingRequestPaymentNotification
     */
    public function build(HomeSetting $homeSetting)
    {
        return $this->subject('GATKU | Shipping Payment')->view('emails.shipping-request-payment-notification')->with('homeSetting', $homeSetting);
    }
}

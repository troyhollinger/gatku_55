<?php

namespace App\Mail;

use Gatku\Model\Discount;
use Gatku\Model\EmailSettings;
use Gatku\Model\HomeSetting;
use Gatku\Model\Order;
use Gatku\Model\ShippingTrack;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmailsShippingTrack extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var ShippingTrack
     */
    public $request;
    public $discount;
    public $subtotal;
    public $shipping;
    public $total;
    public $date;
    /**
     * @var EmailSettings
     */
    public $emailSettings;

    /**
     * EmailsShippingTrack constructor.
     * @param ShippingTrack $request
     * @param $discount
     * @param $subtotal
     * @param $shipping
     * @param $total
     * @param $date
     * @param EmailSettings $emailSettings
     */
    public function __construct(
        ShippingTrack $request,
        $discount,
        $subtotal,
        $shipping,
        $total,
        $date,
        EmailSettings $emailSettings
    )
    {
        $this->request = $request;
        $this->discount = $discount;
        $this->subtotal = $subtotal;
        $this->shipping = $shipping;
        $this->total = $total;
        $this->date = $date;
        $this->emailSettings = $emailSettings;
    }

    /**
     * @param HomeSetting $homeSetting
     * @return EmailsShippingTrack
     */
    public function build(HomeSetting $homeSetting)
    {
        return $this->subject('GATKU | Here is your package tracking number!')
            ->view('emails.shipping-track')
            ->with([
                'homeSetting' => $homeSetting,
                'emailSettings' => $this->emailSettings,
                'order' => $this->request->order
            ]);
    }
}

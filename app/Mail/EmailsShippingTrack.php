<?php

namespace App\Mail;

use Gatku\Discount;
use Gatku\ShippingTrack;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

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
     * EmailsShippingTrack constructor.
     * @param ShippingTrack $request
     * @param Discount $discount
     * @param $subtotal
     * @param $shipping
     * @param $total
     * @param $date
     */
    public function __construct(
        ShippingTrack $request,
        $discount,
        $subtotal,
        $shipping,
        $total,
        $date
    )
    {
        $this->request = $request;
        $this->discount = $discount;
        $this->subtotal = $subtotal;
        $this->shipping = $shipping;
        $this->total = $total;
        $this->date = $date;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('GATKU | Here is your package tracking number!')->view('emails.shipping-track');
    }
}

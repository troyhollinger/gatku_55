<?php

namespace App\Mail;

use Gatku\Model\Discount;
use Gatku\Model\EmailSettings;
use Gatku\Model\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Gatku\Model\HomeSetting;

class EmailsOrder extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var Order
     */
    public $order;
    /**
     * @var Discount
     */
    public $discount;
    public $subtotal;
    public $shipping;
    public $total;
    public $date;
    /**
     * @var HomeSetting
     */
    public $homeSetting;
    /**
     * @var EmailSettings
     */
    public $emailSettings;

    /**
     * EmailsOrder constructor.
     * @param Order $order
     * @param Discount $discount
     * @param $subtotal
     * @param $shipping
     * @param $total
     * @param $date
     * @param HomeSetting $homeSetting
     * @param EmailSettings $emailSettings
     */
    public function __construct(
        Order $order,
        Discount $discount,
        $subtotal,
        $shipping,
        $total,
        $date,
        HomeSetting $homeSetting,
        EmailSettings $emailSettings
    )
    {
        $this->order = $order;
        $this->discount = $discount;
        $this->subtotal = $subtotal;
        $this->shipping = $shipping;
        $this->total = $total;
        $this->date = $date;
        $this->homeSetting = $homeSetting;
        $this->emailSettings = $emailSettings;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject($this->emailSettings->customer_order_email_title)->view('emails.order');
    }
}

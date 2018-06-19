<?php

namespace App\Mail;

use Gatku\Discount;
use Gatku\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

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
     * EmailsOrder constructor.
     * @param Order $order
     * @param Discount $discount
     * @param $subtotal
     * @param $shipping
     * @param $total
     * @param $date
     */
    public function __construct(
        Order $order,
        Discount $discount,
        $subtotal,
        $shipping,
        $total,
        $date
    )
    {
        $this->order = $order;
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
        return $this->view('emails.order');
    }
}

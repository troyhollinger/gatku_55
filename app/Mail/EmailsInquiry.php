<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Request;

class EmailsInquiry extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @var Request
     */
    public $form;

    /**
     * @var string
     */
    public $name;

    /**
     * EmailsInquiry constructor.
     * @param Request $form
     * @param $name
     */
    public function __construct(
        array $form,
        string $name
    )
    {
        $this->form = $form;
        $this->name = $name;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->subject('New Shipping Inquiry from: ' . $this->name )->view('emails.inquiry');
    }
}

<?php

namespace Gatku\Repositories;

use App\Mail\EmailsShippingTrack;
use Gatku\Model\EmailSettings;
use Gatku\Model\HomeSetting;
use Gatku\Model\ShippingTrack;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;

class ShippingTrackRepository {

    /**
     * @var HomeSetting
     */
    public $homeSetting;

    /**
     * @var EmailSettingsRepository
     */
    public $emailSettingsRepository;

    /**
     * @var EmailSettings
     */
    private $emailSettings;

    /**
     * ShippingTrackRepository constructor.
     * @param HomeSetting $homeSetting
     * @param EmailSettingsRepository $emailSettingsRepository
     */
	public function __construct(
	    HomeSetting $homeSetting,
        EmailSettingsRepository $emailSettingsRepository
    )
    {
        $this->homeSetting = $homeSetting;
        $this->emailSettingsRepository = $emailSettingsRepository;
    }

    public function store($input)
	{

		try {
			if(!empty($input['trackId'])){
				ShippingTrack::where('id', $input['trackId'])->update(array('track_id' => $input['track_id'], 'carrier' => $input['carrier']));
				$request = ShippingTrack::find($input['trackId']);

			}else{
				$request = new ShippingTrack;
				$request->track_id = $input['track_id'];
				$request->orderId = $input['orderId'];
				$request->carrier = $input['carrier'];
				$request->token = str_random(10);
				$request->save();
			}
			$request->load('order.customer');

			$this->sendEmail(
			    $request,
                0,
                $request->order->order_sum,
                $request->order->shipping_cost,
                $request->order->tax_amount,
                $request->order->total_sum
            );

		} catch (Exception $e) {
            Bugsnag::notifyException($e);
			Log::error($e);
			return false;
		}

		return $request;
	}

	private function sendEmail($request, $discount, $subtotal, $shipping, $taxAmount, $total)
	{
	    $this->uploadEmailSettingsIfNotSet();

		$date = Carbon::now()->timezone('America/Los_Angeles')->format('F jS Y | g:i A T');

        if (App::environment('production')) {
            Mail::to([
                [
                    'email' => $request->order->customer->email,
                    'name' => $request->order->customer->fullName
                ],
                [
                    'email' => 'emailme@troyhollinger.com',
                    'name' => 'Troy Hollinger'
                ]
            ])->send(new EmailsShippingTrack($request, $discount, $subtotal, $shipping, $taxAmount, $total, $date, $this->emailSettings));
        } else {
            //for dev and QA
            $email = env('DEV_QA_TEST_EMAIL', false);

            if ($email) {
                Mail::to([
                    [
                        'email' => $email,
                        'name' => 'past-recipient-name-here'
                    ]
                ])->send(new EmailsShippingTrack($request, $discount, $subtotal, $shipping, $taxAmount, $total, $date, $this->emailSettings));
            }
        }
	}

    //Make sure EmailSettings are loaded!!!!
    private function uploadEmailSettingsIfNotSet()
    {
        if (!$this->emailSettings) {
            $this->emailSettings = $this->emailSettingsRepository->getLastRecordFromDatabase();
        }
    }
}

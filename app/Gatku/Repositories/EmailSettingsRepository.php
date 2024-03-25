<?php

namespace Gatku\Repositories;

use Gatku\Model\EmailSettings;
use Illuminate\Support\Facades\Log;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
use Exception;

class EmailSettingsRepository {

    /**
     * Display a listing of the resource.
     * GET /email-settings
     *
     * @return Response
     */
    public function index() {
        $emailSettings = $this->getLastRecordFromDatabase();
        return \Response::json($emailSettings, 200);
    }


    /**
     * Store a newly created resource in storage.
     * POST /email-settings
     *
     * @return Response
     */
    public function store($input) {
        try {
            if (isset($input['id']) && $input['id'] ) {
                $emailSettings = $this->getLastRecordFromDatabase();
            } else {
                $emailSettings = new EmailSettings;
            }

            $emailSettings = $this->assignData($emailSettings, $input);
            $emailSettings->save();
        } catch (Exception $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            return \Response::json(['message' => 'Sorry, there was a problem saving the EmailSettings'], 404);
        }

        return \Response::json(['message' => 'Email Settings saved!'], 200);
    }

    /**
     * @param EmailSettings $emailSettings
     * @param array $input
     * @return EmailSettings
     */
    private function assignData(EmailSettings $emailSettings, array $input)
    {
        $emailSettings->email_main_logo_url = isset($input['email_main_logo_url']) ? $input['email_main_logo_url'] : '';
        $emailSettings->email_small_logo_url = isset($input['email_small_logo_url']) ? $input['email_small_logo_url'] : '';
        $emailSettings->customer_order_email_title = isset($input['customer_order_email_title']) ? $input['customer_order_email_title'] : '';
        $emailSettings->customer_order_notify_email_1 = isset($input['customer_order_notify_email_1']) ? $input['customer_order_notify_email_1'] : '';
        $emailSettings->customer_order_notify_name_1 = isset($input['customer_order_notify_name_1']) ? $input['customer_order_notify_name_1'] : '';
        $emailSettings->customer_order_notify_email_2 = isset($input['customer_order_notify_email_2']) ? $input['customer_order_notify_email_2'] : '';
        $emailSettings->customer_order_notify_name_2 = isset($input['customer_order_notify_name_2']) ? $input['customer_order_notify_name_2'] : '';
        $emailSettings->customer_order_notify_email_3 = isset($input['customer_order_notify_email_3']) ? $input['customer_order_notify_email_3'] : '';
        $emailSettings->customer_order_notify_name_3 = isset($input['customer_order_notify_name_3']) ? $input['customer_order_notify_name_3'] : '';
        $emailSettings->customer_order_notify_email_4 = isset($input['customer_order_notify_email_4']) ? $input['customer_order_notify_email_4'] : '';
        $emailSettings->customer_order_notify_name_4 = isset($input['customer_order_notify_name_4']) ? $input['customer_order_notify_name_4'] : '';
        $emailSettings->customer_order_notify_email_5 = isset($input['customer_order_notify_email_5']) ? $input['customer_order_notify_email_5'] : '';
        $emailSettings->customer_order_notify_name_5 = isset($input['customer_order_notify_name_5']) ? $input['customer_order_notify_name_5'] : '';
        $emailSettings->admin_order_email_title = isset($input['admin_order_email_title']) ? $input['admin_order_email_title'] : '';
        $emailSettings->admin_order_notify_email_1 = isset($input['admin_order_notify_email_1']) ? $input['admin_order_notify_email_1'] : '';
        $emailSettings->admin_order_notify_name_1 = isset($input['admin_order_notify_name_1']) ? $input['admin_order_notify_name_1'] : '';
        $emailSettings->admin_order_notify_email_2 = isset($input['admin_order_notify_email_2']) ? $input['admin_order_notify_email_2'] : '';
        $emailSettings->admin_order_notify_name_2 = isset($input['admin_order_notify_name_2']) ? $input['admin_order_notify_name_2'] : '';
        $emailSettings->admin_order_notify_email_3 = isset($input['admin_order_notify_email_3']) ? $input['admin_order_notify_email_3'] : '';
        $emailSettings->admin_order_notify_name_3 = isset($input['admin_order_notify_name_3']) ? $input['admin_order_notify_name_3'] : '';
        $emailSettings->admin_order_notify_email_4 = isset($input['admin_order_notify_email_4']) ? $input['admin_order_notify_email_4'] : '';
        $emailSettings->admin_order_notify_name_4 = isset($input['admin_order_notify_name_4']) ? $input['admin_order_notify_name_4'] : '';
        $emailSettings->admin_order_notify_email_5 = isset($input['admin_order_notify_email_5']) ? $input['admin_order_notify_email_5'] : '';
        $emailSettings->admin_order_notify_name_5 = isset($input['admin_order_notify_name_5']) ? $input['admin_order_notify_name_5'] : '';
        $emailSettings->email_footer_color = isset($input['email_footer_color']) ? $input['email_footer_color'] : '';
        $emailSettings->contact_email_address_displayed_in_email = isset($input['contact_email_address_displayed_in_email']) ? $input['contact_email_address_displayed_in_email'] : '';
        $emailSettings->contact_phone_number_displayed_in_email = isset($input['contact_phone_number_displayed_in_email']) ? $input['contact_phone_number_displayed_in_email'] : '';

        return $emailSettings;
    }

    /**
     * @return mixed
     */
    public function getLastRecordFromDatabase()
    {
        try {
            $emailSettings = EmailSettings::orderBy('id', 'desc')->first();
        } catch (Exception $e) {
            Bugsnag::notifyException($e);
            return \Response::json(['message' => 'Sorry, EmailSettings could not be retrieved.'], 404);
        }

        return $emailSettings;
    }
}

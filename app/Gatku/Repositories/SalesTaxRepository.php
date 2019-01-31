<?php

namespace Gatku\Repositories;

use Gatku\Model\SalesTax;
use Illuminate\Support\Facades\Log;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;

class SalesTaxRepository {

    public function all() {
        $salesTax = SalesTax::all();
        Log::info($salesTax);
        return $salesTax;
    }

    /**
     * @param $code
     * @return bool
     */
    public function get($code) {
        try {
            $salesTax = SalesTax::findOrFail($code);
        } catch (\Exception $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            return false;
        }
        return $salesTax;
    }


    /**
     * @param $input
     * @return bool
     */
    public function store($input) {

        try {
            $salesTax = new SalesTax;
            $result = $this->assignData($salesTax, $input);
            $result->save();
        } catch (\Exception $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            return false;
        }
        return true;
    }

    /**
     * @param $state
     * @param $input
     * @return bool
     */
    public function update($state, $input) {
        try {
            $salesTax = SalesTax::findOrFail($state);
            $result = $this->assignData($salesTax, $input);
            $result->save();
        } catch (\Exception $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            return false;
        }
        return true;
    }

    /**
     * @param $state
     * @return bool
     */
    public function destroy($state) {
        try {
            $salesTax = SalesTax::findOrFail($state);
            $salesTax->delete();
        } catch (\Exception $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            return false;
        }
        return true;
    }

    /**
     * Assigns discount data from input
     *
     * @param SalesTax $salesTax
     * @param $data
     * @return SalesTax
     */
    private function assignData(SalesTax $salesTax, $data) {
        $salesTax->state = $data['state'];
        $salesTax->tax = $data['tax'];

        return $salesTax;
    }
}

<?php

namespace Austen\Repositories;

use Gatku\Discount;
use Log;

class DiscountRepository {

    public function all() {
        $discounts = Discount::all();
        Log::info($discounts);
        return $discounts;
    }

    /**
     * @param $code
     * @return bool
     */
    public function get($code) {
        try {
            $discount = Discount::findOrFail($code);
        } catch (Exception $e) {
            Log::error($e);
            return false;
        }
        return $discount;
    }


    /**
     * @param $input
     * @return bool
     */
    public function store($input) {

        try {
            $discount = new Discount;
            $result = $this->assignData($discount, $input);
            $result->save();
        } catch (Exception $e) {
            Log::error($e);
            return false;
        }
        return true;
    }

    /**
     * @param $code
     * @param $input
     * @return bool
     */
    public function update($code, $input) {
        try {
            $discount = Discount::findOrFail($code);
            $result = $this->assignData($discount, $input);
            $result->save();
        } catch (Exception $e) {
            Log::error($e);
            return false;
        }
        return true;
    }

    /**
     * @param $code
     * @return bool
     */
    public function destroy($code) {
        try {
            $discount = Discount::findOrFail($code);
            $discount->delete();
        } catch (\Exception $e) {
            Log::error($e);
            return false;
        }
        return true;
    }

    /**
     * Assigns discount data from input
     *
     * @param Discount $discount
     * @param $data
     * @return Discount
     */
    private function assignData($discount, $data) {
        $discount->code = $data['code'];
        $discount->discount = $data['discount'];

        return $discount;
    }
}

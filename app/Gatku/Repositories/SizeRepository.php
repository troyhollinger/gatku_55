<?php

namespace Gatku\Repositories;

use Gatku\Model\Size;
use Illuminate\Support\Facades\Log;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;

class SizeRepository {

    public function all() {
        $sizes = Size::all();
        Log::info($sizes);
        return $sizes;
    }

    /**
     * @param $id
     * @return bool
     */
    public function get($id) {
        try {
            $discount = Size::findOrFail($id);
        } catch (\Exception $e) {
            Bugsnag::notifyException($e);
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
            $size = new Size;
            $result = $this->assignData($size, $input);
            $result->save();
        } catch (\Exception $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            return false;
        }
        return true;
    }

    /**
     * @param $id
     * @param $input
     * @return bool
     */
    public function update($id, $input) {
        try {
            $size = Size::findOrFail($id);
            $result = $this->assignData($size, $input);
            $result->save();
        } catch (\Exception $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            return false;
        }
        return true;
    }

    /**
     * @param $id
     * @return bool
     */
    public function destroy($id) {
        try {
            $discount = Size::findOrFail($id);
            $discount->delete();
        } catch (\Exception $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            return false;
        }
        return true;
    }

    /**
     * Assigns size data from input
     *
     * @param Size $size
     * @param $input
     * @return Size
     */
    private function assignData(Size $size, $input) {

        $size->id = isset($input['id']) ? $input['id'] : '';
        $size->name = isset($input['name']) ? $input['name'] : '';
        $size->shortName = isset($input['shortName']) ? $input['shortName'] : '';
        $size->slug = isset($input['slug']) ? $input['slug'] : '';
        $size->price = isset($input['price']) ? $input['price'] : 0;
        $size->available = isset($input['available']) ? $input['available'] : 0;
        $size->productId = $input['productId'];

        return $size;
    }
}

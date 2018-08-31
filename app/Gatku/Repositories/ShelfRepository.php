<?php

namespace Gatku\Repositories;

use Gatku\Model\Shelf;
use Illuminate\Support\Facades\Log;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;

class ShelfRepository {

    /**
     * @return mixed
     */
    public function all() {
        $shelves = Shelf::orderBy('order')->get();
        Log::info($shelves);
        return $shelves;
    }

    /**
     * @param $id
     * @return bool
     */
    public function get($id) {
        try {
            $shelf = Shelf::findOrFail($id);
        } catch (\Exception $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            return false;
        }
        return $shelf;
    }


    /**
     * @param $input
     * @return bool
     */
    public function store($input) {

        try {
            $shelf = new Shelf;
            $result = $this->assignData($shelf, $input);
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
            $shelf = Shelf::findOrFail($id);
            $result = $this->assignData($shelf, $input);
            $result->save();
        } catch (Exception $e) {
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
            $shelf = Shelf::findOrFail($id);
            $shelf->delete();
        } catch (\Exception $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            return false;
        }
        return true;
    }

    /**
     * Assigns shelf data from input
     *
     * @param Shelf $shelf
     * @param $data
     * @return Shelf
     */
    private function assignData(Shelf $shelf, $data) {
        $shelf->id = $data['id'];
        $shelf->name = (isset($data['name'])) ? $data['name'] : '';
        $shelf->order = (isset($data['order'])) ? $data['order'] : 0;
        $shelf->hidden = (isset($data['hidden'])) ? $data['hidden'] : 0;;
        $shelf->name_text_align = $data['name_text_align'];
        $shelf->name_font_style = $data['name_font_style'];
        $shelf->name_font_weight = $data['name_font_weight'];
        $shelf->desktop_shelf_font_size = (isset($data['desktop_shelf_font_size'])) ? $data['desktop_shelf_font_size'] : 0;
        $shelf->mobile_shelf_font_size = (isset($data['mobile_shelf_font_size'])) ? $data['mobile_shelf_font_size'] : 0;

        return $shelf;
    }
}

<?php

namespace Austen\Repositories;

use Gatku\Shelf;
use Illuminate\Support\Facades\Log;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;

class ShelfRepository {

    public function all() {
        $shelves = Shelf::all();
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
        $shelf->name = $data['name'];
        $shelf->order = $data['order'];

        return $shelf;
    }
}

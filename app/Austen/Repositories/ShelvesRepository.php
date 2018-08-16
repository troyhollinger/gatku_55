<?php

namespace Austen\Repositories;

use Gatku\Shelf;
use Illuminate\Support\Facades\Log;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;

class ShelvesRepository {

    /**
     * @return mixed
     */
    public function getAllActive() {
        $shelves = Shelf::where('hidden', 0)->orderBy('order')->get();
        Log::info($shelves);
        return $shelves;
    }

    /**
     * @param $input
     * @return bool
     */
    public function update($input) {
        try {
            foreach ($input as $shelfUpdated) {
                $shelf = Shelf::findOrFail($shelfUpdated['id']);
                $result = $this->assignData($shelf, $shelfUpdated);
                $result->save();
            }
        } catch (Exception $e) {
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
        $shelf->hidden = $data['hidden'];
        $shelf->name_text_align = $data['name_text_align'];
        $shelf->name_font_style = $data['name_font_style'];
        $shelf->name_font_weight = $data['name_font_weight'];

        return $shelf;
    }
}

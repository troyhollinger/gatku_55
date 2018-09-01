<?php

namespace App\Http\Controllers;

use Gatku\Repositories\ImageRepository;
use Gatku\Model\YouImage;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;
use Illuminate\Support\Facades\Log;

class YouImageController extends BaseController {

	protected $image;

	public function __construct(ImageRepository $image) {
		$this->image = $image;

        parent::__construct();
	}

	/**
	 * Display a listing of the resource.
	 * GET /youimage
	 *
	 * @return Response
	 */
	public function index() {
		try {
			$images = YouImage::with('product')->groupBy('image')->get();
		} catch (\Exception $e) {
            Bugsnag::notifyException($e);
			return \Response::json(['message' => 'Sorry, images could not be retrieved.'], 404);
		}

		return \Response::json($images, 200);
	}


	/**
	 * Store a newly created resource in storage.
	 * POST /youimage
	 *
	 * @return Response
	 */
	public function store() {
		try {
			//Create YouImage object
            $image = new YouImage;
            $image->image = \Request::get('image');

            $productIds = \Request::get('products');
			if ($productIds) {
                foreach ($productIds as $productId) {
                    $image->productId = $productId;
                    $image->save();
                }
            } else {
			    $image->save();
            }

		} catch (\Exception $e) {
            Bugsnag::notifyException($e);
			Log::error($e);
			return \Response::json(['message' => 'Sorry, there was a problem saving the image'], 404);
		}

		return \Response::json(['message' => 'Image saved!'], 200);
	}


	/**
	 * Update the specified resource in storage.
	 * PUT /youimage/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function update($id)
	{
		//
	}

	/**
	 * Remove the specified resource from storage.
	 * DELETE /youimage/{id}
	 *
	 * @param  int  $id
	 * @return Response
	 */
	public function destroy($id)
	{
	    $result =  $this->image->delete($id);
        if ($result === false) {
            return \Response::json(['message' => 'Sorry, there was a problem removing image.'], 404);
        }

        return \Response::json(['message' => 'Image with id:' . $id . ' removed.'], 200);
	}

	public function upload() {
		$file = \Request::file('file');
		$upload = $this->image->upload($file, 'img/you-images/');
		if ($upload === false) {
			return \Response::json(['message' => 'Sorry, something went wrong during the upload'], 404);
		}

		return \Response::json($upload['imagePath'], 200);
	}
}

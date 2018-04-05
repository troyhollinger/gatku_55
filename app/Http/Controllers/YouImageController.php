<?php

namespace App\Http\Controllers;

use Austen\Repositories\ImageRepository;

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
			$images = YouImage::groupBy('image')->get();
			//$images = YouImage::all();	

		} catch (Exception $e) {
			
			return Response::json(['message' => 'Sorry, images could not be retrieved.'], 404);

		}

		return Response::json(['data' => $images], 200);

	}


	/**
	 * Store a newly created resource in storage.
	 * POST /youimage
	 *
	 * @return Response
	 */
	public function store() {
		
		
		try {
			$productIds = Input::get('products');
			foreach ($productIds as $productId) {
				$image = new YouImage;
				$image->image = Input::get('image');
				$image->productId = $productId;
				$image->save();	
			}
			
			/*if (Input::has('productId')) {

				$image->productId = Input::get('productId');

			}*/

		} catch (Exception $e) {
			
			Log::error($e);

			return Response::json(['message' => 'Sorry, there was a problem saving the image'], 404);

		}

		return Response::json(['message' => 'Image saved!'], 200);


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
		//
	}


	public function upload() {

		$file = Input::file('file');

		$upload = $this->image->upload($file, 'img/you-images/');

		if ($upload === false) {

			return Response::json(['message' => 'Sorry, something went wrong during the upload'], 404);

		}

		return Response::json(['data' => $upload['imagePath']], 200);

	}

}
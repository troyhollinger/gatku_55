<?php

namespace App\Http\Controllers;

use Gatku\Repositories\ProductRepository;
use Gatku\Repositories\ImageRepository;
use Gatku\Model\HomeSetting;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Gatku\Model\Product;
use Illuminate\Support\Facades\Log;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;

class ProductController extends BaseController
{
    /**
     * @var ProductRepository
     */
    protected $product;
    /**
     * @var Request
     */
    private $request;
    /**
     * @var ImageRepository
     */
    private $image;

    /**
     * ProductController constructor.
     * @param ProductRepository $product
     * @param ImageRepository $image
     * @param Request $request
     */
    public function __construct(ProductRepository $product, ImageRepository $image, Request $request)
    {
        $this->product = $product;
        $this->image = $image;
        $this->request = $request;

        parent::__construct();
    }

    /**
     * Display a listing of the resource.
     * GET /products
     *
     * @return Response
     */
    public function index()
    {
        if ($this->request->wantsJson()) {

            $products = $this->product->all();

            //Commented temporary remove in future if not used
//            $requestParams = $this->request->input();
//            if (isset($requestParams['start_date']) && isset($requestParams['end_date'])) {
//                $products = $this->product->getProductsForPeriod($requestParams['start_date'], $requestParams['end_date']);
//            } else {
//                $products = $this->product->all();
//            }

            return \Response::json($products, 200);
        } else {
            return \Redirect::route('home');
        }
    }


    /**
     * Store a newly created resource in storage.
     * POST /products
     *
     * @return Response
     */
    public function store()
    {
        if ($this->product->store(\Request::all())) {
            return \Response::json([], 200);
        } else {
            return \Response::json(['message' => 'Sorry, the product could not be created'], 404);
        }
    }


    /**
     * @param $id
     * @return mixed
     */
    public function get($id)
    {
        $product = $this->product->get($id);

        if ($product === false) {
            return \Response::json(['sorry, there was an error'], 404);
        }
        return \Response::json($product, 200);
    }

    /**
     * @param $slug
     * @return mixed
     */
    public function getBySlug($slug)
    {
        $product = $this->product->find($slug);

        if ($product === false) {
            return \Response::json(['message' => 'Sorry, the product could not be retrieved'], 404);
        }
        return \Response::json($product, 200);
    }

    /**
     * @param $slug
     * @param HomeSetting $homeSetting
     * @return mixed
     */
    public function show($slug, HomeSetting $homeSetting)
    {
        $product = $this->product->find($slug);

        if ($product === false || $product === null) {
            return \Redirect::route('home');
        }
        Log::info($product);

        //Determine what countries get free shipping based on host name
        $shippingCountries = 'USA';

        $host = $this->request->getHost();
        if (strpos($host, 'gatku') !== false) {
            $shippingCountries = 'USA + AU';
        }

        return \View::make('pages.product', [
            'product' => $product,
            'shippingCountries' => $shippingCountries
        ])->with('homeSetting',  $homeSetting);
    }


    /**
     * Upload a file from $_POST request
     * POST /products/image
     *
     * @return Response
     */
    public function upload()
    {
        $file = \Request::file('file');
        $upload = $this->image->upload($file, 'img/uploads/');

        if ($upload === false) {
            return \Response::json(['message' => 'Sorry, There was an error uploading this image.'], 404);
        }
        return \Response::json($upload['imagePath'], 200);
    }


    /**
     * Update the specified resource in storage.
     * PUT /products/{id}
     *
     * @param  int $id
     * @return Response
     */
    public function update($id)
    {
        $input = \Request::all();
        $update = $this->product->update($id, $input);

        if ($update === false) {
            return \Response::json(['message' => 'Sorry, there was a problem updating this product.'], 404);
        }
        return \Response::json(['message' => 'product updated'], 200);
    }

    /**
     * Remove the specified resource from storage.
     * DELETE /products/{id}
     *
     * @param  int $id
     * @return Response
     */
    public function destroy($id)
    {
//        $response = $this->product->destroy($id);
//        if ($response === false) {
//            return \Response::json(['message' => 'Sorry, there was a problem removing this product.'], 404);
//        }
//        return \Response::json(['message' => 'Product removed.'], 200);
    }

    /**
     * Returns an array of product types
     *
     * @return Response
     */
    public function types()
    {
        $types = $this->product->types();

        if ($types === false) {
            return \Response::json(['message' => 'Sorry, there was problem retrieving the types'], 404);
        }
        return \Response::json($types, 200);
    }


    /**
     * @return mixed
     */
    public function getByType()
    {
        $products = $this->product->getByType();

        if ($products === false) {
            return \Response::json(['message' => 'Sorry, could not get products by type.'], 404);
        }
        return \Response::json($products, 200);
    }

    /**
     * @return mixed
     */
    public function getAllAvailable()
    {
        $products = $this->product->getAllAvailable();

        if ($products === false) {
            return \Response::json(['message' => 'Sorry, could not get All Available Products.'], 404);
        }
        return \Response::json($products, 200);
    }

    /**
     * Retrieve you images corresponding to the product
     *
     * @param $id
     * @return mixed
     */
    public function photos($id)
    {
        try {
            $image = Product::find($id)->images;
        } catch (\Exception $e) {
            Bugsnag::notifyException($e);
            Log::error($e);
            return \Response::json(['message' => 'Sorry, there was a problem retrieving the images'], 404);

        }
        return \Response::json($image, 200);
    }

    /**
     * @param $slug
     * @return mixed
     */
    public function getSizeBySlug($slug)
    {
        $size = $this->product->getSizeBySlug($slug);
        if ($size === false) return \Response::json(['message' => 'Sorry, something went wrong!'], 404);

        return \Response::json($size, 200);
    }

    public function getByShelf(int $shelfId) {
        //@TODO finish this method
    }
}

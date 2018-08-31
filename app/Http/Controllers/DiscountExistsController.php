<?php

namespace App\Http\Controllers;

use Gatku\Repositories\DiscountRepository;

class DiscountExistsController extends BaseController {

    /**
     * @var DiscountRepository
     */
    protected $repository;

    /**
     * DiscountController constructor.
     * @param DiscountRepository $request
     */
    public function __construct(DiscountRepository $request)
    {
        $this->repository = $request;
        parent::__construct();
    }

    /**
     * @return mixed
     */
    public function index()
    {
        $response = false;
        $request = $this->repository->all();
        if ($request === false) return \Response::json(['message' => 'Sorry, there was an error on our end'], 404);

        $data = $request->toArray();

        if (!empty($data)) {
            $response = true;
        }

        return \Response::json($response, 200);
    }
}
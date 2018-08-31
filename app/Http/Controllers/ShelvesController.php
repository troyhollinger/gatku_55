<?php

namespace App\Http\Controllers;

use Gatku\Repositories\ShelvesRepository;

class ShelvesController extends BaseController {

    /**
     * @var ShelvesRepository
     */
    protected $repository;

    /**
     * DiscountController constructor.
     * @param ShelvesRepository $params
     */
    public function __construct(ShelvesRepository $params)
    {
        $this->repository = $params;
        parent::__construct();
    }

    /**
     * @return mixed
     */
    public function index()
    {
        $request = $this->repository->getAllActive();
        if ($request === false) return \Response::json(['message' => 'Sorry, there was an error on our end'], 404);
        return \Response::json($request, 200);
    }

    /**
     * @return mixed
     */
    public function update() {
        $input = \Request::all();
        $update = $this->repository->update($input);
        if ($update === false) {
            return \Response::json(['message' => 'Sorry, there was a problem updating this discount.'], 404);
        }
        return \Response::json(['message' => 'Shelf updated'], 200);
    }
}
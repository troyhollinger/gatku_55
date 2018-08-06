<?php

namespace App\Http\Controllers;

use Austen\Repositories\ShelfRepository;

class ShelfController extends BaseController {

    /**
     * @var ShelfRepository
     */
    protected $repository;

    /**
     * DiscountController constructor.
     * @param ShelfRepository $params
     */
    public function __construct(ShelfRepository $params)
    {
        $this->repository = $params;
        parent::__construct();
    }

    /**
     * @return mixed
     */
    public function index()
    {
        $request = $this->repository->all();
        if ($request === false) return \Response::json(['message' => 'Sorry, there was an error on our end'], 404);
        return \Response::json(['message' => 'request was created', "data" => $request], 200);
    }

    /**
     * @param int $id
     * @return mixed
     */
    public function show(int $id)
    {
        $request = $this->repository->get($id);
        if ($request === false) return \Response::json(['message' => 'Sorry, there was an error on our end'], 404);
        return \Response::json($request, 200);
    }

    /**
     * Store a newly created resource in storage.
     * POST /shipping-request
     *
     * @return Response
     */
    public function store()
    {
        $input = \Request::all();
        $request = $this->repository->store($input);
        if ($request === false) return \Response::json(['message' => 'Sorry, there was an error with store discount'], 404);
        return \Response::json(['message' => 'Discount was created', "data" => $request], 200);
    }

    /**
     * @param int $id
     * @return mixed
     */
    public function destroy(int $id)
    {
        $response = $this->repository->destroy($id);
        if ($response === false) {
            return \Response::json(['message' => 'Sorry, there was a problem removing this discount.'], 404);
        }
        return \Response::json(['message' => 'Discount updated'], 200);
    }

    /**
     * @param int $id
     * @return mixed
     */
    public function update(int $id) {
        $input = \Request::all();
        $update = $this->repository->update($id, $input);
        if ($update === false) {
            return \Response::json(['message' => 'Sorry, there was a problem updating this discount.'], 404);
        }
        return \Response::json(['message' => 'Discount updated'], 200);
    }
}
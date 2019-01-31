<?php

namespace App\Http\Controllers;

use Gatku\Repositories\SalesTaxRepository;

class SalesTaxController extends BaseController {

    /**
     * @var SalesTaxRepository
     */
    protected $repository;

    /**
     * SalesTaxController constructor.
     * @param SalesTaxRepository $request
     */
    public function __construct(SalesTaxRepository $request)
    {
        $this->repository = $request;
        parent::__construct();
    }

    /**
     * @return mixed
     */
    public function index()
    {
        $request = $this->repository->all();
        if ($request === false) return \Response::json(['message' => 'Sorry, there was an error on our end'], 404);
        return \Response::json($request, 200);
    }

    /**
     * @param $code
     * @return mixed
     */
    public function show($code)
    {
        $request = $this->repository->get($code);
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
        return \Response::json($request, 200);
    }

    /**
     * @param $code
     * @return mixed
     */
    public function destroy($code)
    {
        $response = $this->repository->destroy($code);
        if ($response === false) {
            return \Response::json(['message' => 'Sorry, there was a problem removing this discount.'], 404);
        }
        return \Response::json(['message' => 'Discount removed.'], 200);
    }

    /**
     * @param $code
     * @return mixed
     */
    public function update($code) {
        $input = \Request::all();
        $update = $this->repository->update($code, $input);
        if ($update === false) {
            return \Response::json(['message' => 'Sorry, there was a problem updating this discount.'], 404);
        }
        return \Response::json(['message' => 'Discount updated'], 200);
    }
}
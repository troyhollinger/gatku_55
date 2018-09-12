<?php

namespace App\Http\Controllers;

use Gatku\Repositories\EmailSettingsRepository;
use Gatku\Repositories\ImageRepository;

class EmailSettingsController extends BaseController {

    /**
     * @var EmailSettingsRepository
     */
    protected $repository;
    /**
     * @var ImageRepository
     */
    protected $imageRepository;

    /**
     * EmailSettingsController constructor.
     * @param EmailSettingsRepository $repository
     * @param ImageRepository $imageRepository
     */
    public function __construct(EmailSettingsRepository $repository, ImageRepository $imageRepository)
    {
        $this->repository = $repository;
        $this->imageRepository = $imageRepository;
        parent::__construct();
    }

    /**
     * @return mixed
     */
    public function index()
    {
        $request = $this->repository->index();
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
        if ($request === false) return \Response::json(['message' => 'Sorry, there was an error with EmailSettings'], 404);
        return \Response::json($request, 200);
    }


    public function upload() {
        $file = \Request::file('file');
        $upload = $this->imageRepository->upload($file, 'img/email-images/');

        if ($upload === false) {
            return \Response::json(['message' => 'Sorry, something went wrong during the upload'], 404);
        }

        return \Response::json($upload['imagePath'], 200);
    }
}
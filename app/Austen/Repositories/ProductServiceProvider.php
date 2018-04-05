<?php

namespace Austen\Repositories;

use Illuminate\Support\ServiceProvider;


class ProductServiceProvider extends ServiceProvider {

	public function register() {

		$this->app->bind(

			'Austen\Repositories\ProductRepositoryInterface',
			'Austen\Repositories\ProductRepository'

		);

	}

}
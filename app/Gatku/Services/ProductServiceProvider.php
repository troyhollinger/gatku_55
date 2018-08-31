<?php

namespace Gatku\Service;

use Illuminate\Support\ServiceProvider;


class ProductServiceProvider extends ServiceProvider {

	public function register() {

		$this->app->bind(
			'Gatku\Repositories\ProductRepositoryInterface',
			'Gatku\Repositories\ProductRepository'
		);
	}
}
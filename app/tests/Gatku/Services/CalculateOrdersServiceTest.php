<?php

use Illuminate\Container\Container;
use Tests\TestCase;
use Gatku\Service\CalculateOrdersService;


class CalculateOrdersServiceTest extends TestCase {

    /**
     * @var CalculateOrdersService
     */
    public $service;

    public function setUp()
    {
        parent::setUp();

        $this->service = $this->app->make(CalculateOrdersService::class);
    }

	public function testTrue()
    {
		$this->assertTrue(true);
	}

	public function testCalculateDiscount()
    {
        $result = $this->service->calculateDiscount();

        $this->assertEquals('calculateDiscount', $result);
    }

}

<?php




class RoutingTest extends TestCase {

	public function testProductPageHasProduct() {

		$this->call('GET', '/product/sixer');

		$this->assertViewHas('product');

	}

	public function testThankYouPageSaysThankYou() {

		$crawler = $this->client->request('GET', '/thankyou');

		$this->assertCount(1, $crawler->filter('h2:contains("Thank You for Visiting!")'));

	}

}

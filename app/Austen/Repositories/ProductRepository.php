<?php

namespace Austen\Repositories;

use Gatku\Product;
use Gatku\Size;
use Gatku\ProductType;
use Illuminate\Support\Facades\Log;
use Gatku\Addon;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;

class ProductRepository implements ProductRepositoryInterface {

	public function all()
    {
		$products = Product::with('type', 'addons', 'availability')->get();
		Log::info($products);
		return $products;
	}

	//Commented temporary - remove in future if not used.
//	public function getProductsForPeriod($startDate, $endDate)
//    {
//        if (!$startDate) {
//            $startDate = date('y-m-d');
//        }
//
//        //Just in case no endDate
//        if (!$endDate) {
//            $endDate = date('y-m-d');
//        }
//
//        $products = Product::with(['type', 'addons', 'availability', 'orderitems' => Product::orderItemsWithParams($startDate, $endDate)])->get();
//
//        Log::info($products);
//        return $products;
//    }

	public function get($id)
    {
		try {
			$product = Product::findOrFail($id);
			$product->load('type', 'addons.product.type', 'sizes', 'availability');
		} catch (\Exception $e) {
            Bugsnag::notifyException($e);
			Log::error($e);
			return false;
		}
		return $product;
	}

    /**
     * @param $slug
     * @return bool
     */
	public function find($slug)
    {
		try {
			$product = Product::where('slug', '=', $slug)->with('type')->first();
			Log::info($product);
		} catch (\Exception $e) {
            Bugsnag::notifyException($e);
			Log::error($e);
			return false;
		}

		return $product;
	}

    /**
     * @param $input
     * @return bool
     */
	public function store($input)
    {
		try {
			$product = new Product;
			$result = $this->assignData($product, $input);
			$result->save();
			if (isset($input['addonSelection'])) $this->assignAddons($result, $input);
		} catch (\Exception $e) {
            Bugsnag::notifyException($e);
			Log::error($e);
			return false;
		}

		return true;
	}

    /**
     * @param $id
     * @param $input
     * @return bool
     */
	public function update($id, $input)
    {
		try {
			$product = Product::findOrFail($id);
			$result = $this->assignData($product, $input);
			$result->save();
			$this->assignAddons($result, $input);
		} catch (\Exception $e) {
            Bugsnag::notifyException($e);
			Log::error($e);
			return false;
		}

		return true;
	}

    /**
     * @param $id
     * @return bool
     */
	public function destroy($id)
    {
//        try {
//            $product = Product::findOrFail($id);
//            $product->delete();
//        } catch (\Exception $e) {
//            Bugsnag::notifyException($e);
//            Log::error($e);
//            return false;
//        }
//        return true;
	}

    /**
     * @return bool
     */
	public function types()
    {
		try {
			$types = ProductType::all();	
		} catch (\Exception $e) {
            Bugsnag::notifyException($e);
			Log::error($e);
			return false;
		}
		return $types;
	}

    /**
     * @return array|bool
     */
	public function getByType()
    {
		try {
            $heads = ProductType::where('name', '=', 'head')->first()->products()->orderBy('order', 'asc')->get();
            $poles = ProductType::where('name', '=', 'pole')->first()->products()->orderBy('order', 'asc')->get();
            $shrinker = ProductType::where('name', '=', 'shrinker')->first()->products()->orderBy('order', 'asc')->get();
            $extras = ProductType::where('name', '=', 'extra')->first()->products()->orderBy('order', 'asc')->get();
            $apparel = ProductType::where('name', '=', 'apparel')->first()->products()->orderBy('order', 'asc')->get();
            $glasses = ProductType::where('name', '=', 'glass')->first()->products()->orderBy('order', 'asc')->get();
            $packages = ProductType::where('name', '=', 'package')->first()->products()->orderBy('order', 'asc')->get();
		} catch (\Exception $e) {
            Bugsnag::notifyException($e);
			Log::error($e);
			return false;
		}

		$products = [
            'heads' => $heads,
            'poles' => $poles,
            'shrinker' => $shrinker,
            'extras' => $extras,
            'apparel' => $apparel,
            'glasses' => $glasses,
            'packages' => $packages
		];

		return $products;
	}

    /**
     * @param string $slug
     * @return bool
     */
	public function getSizeBySlug($slug)
    {
		try {
			$size = Size::where('slug', '=', $slug)->first();
		} catch (\Exception $e) {
            Bugsnag::notifyException($e);
			Log::error($e);
			return false;
		}

		return $size;
	}


    /**
     * @param Product $product
     * @param array $data
     * @return Product
     */
	private function assignData(Product $product, array $data)
    {
		$product->typeId = $data['typeId'];
		if (isset($data['attachedImage'])) $product->attachedImage = $data['attachedImage'];
		if (isset($data['detachedImage'])) $product->detachedImage = $data['detachedImage'];
		if (isset($data['emailImage'])) $product->emailImage = $data['emailImage'];
		if (isset($data['thumb'])) $product->thumb = $data['thumb'];
		if (isset($data['availabilityTypeId'])) $product->availabilityTypeId = $data['availabilityTypeId'];
		$product->name = $data['name'];
		$product->shortName = $data['shortName'];
        $product->short_name_extension = $data['short_name_extension'];
		$product->slug = $data['slug'];
		$product->price = $data['price'];
		$product->description = $data['description'];
		$product->metaDescription = $data['metaDescription'];
		$product->length = $data['length'];

        $product->editable_1_label  = $data['editable_1_label'];
        $product->editable_1        = $data['editable_1'];
        if (isset($data['editable_1_image']))   $product->editable_1_image  = $data['editable_1_image'];

        $product->editable_2_label  = $data['editable_2_label'];
        $product->editable_2        = $data['editable_2'];
        if (isset($data['editable_2_image']))   $product->editable_2_image  = $data['editable_2_image'];

        $product->editable_3_label  = $data['editable_3_label'];
        $product->editable_3        = $data['editable_3'];
        if (isset($data['editable_3_image']))   $product->editable_3_image  = $data['editable_3_image'];

        $product->editable_4_label  = $data['editable_4_label'];
        $product->editable_4        = $data['editable_4'];
        if (isset($data['editable_4_image']))   $product->editable_4_image  = $data['editable_4_image'];

        if (isset($data['order'])) $product->order = $data['order'];
		$product->shipping_description = $data['shipping_description'];
        $product->mobile_name = $data['mobile_name'];
        $product->shelf_id = $data['shelf_id'];
        
        if (isset($data['name_text_align'])) $product->name_text_align = $data['name_text_align'];
        if (isset($data['name_font_style'])) $product->name_font_style = $data['name_font_style'];
        if (isset($data['name_font_weight'])) $product->name_font_weight = $data['name_font_weight'];

		return $product;
	}


    /**
     * @param $product
     * @param $data
     */
	private function assignAddons($product, $data)
    {
		Log::info("Assign Addons is being called");

		$addons = $data['addonSelection'];
		// get existing addons for product
		$existing = $product->addons;

		// loop through the data array
		foreach($addons as $addon) {
			if (count($existing)) {
				$match = false;
				// loop through existing addons
				foreach($existing as $existingAddon) {
					// there is a match
					if ($existingAddon->childId == $addon['id']) {
						if ($addon['isAddon'] === false) {
							$existingAddon->delete();
							break;
						}

						if (isset($addon['include_in_package'])) {
                            $existingAddon->include_in_package = $addon['include_in_package'];
                            if (isset($addon['price_zero']) && $addon['include_in_package']) {
                                $existingAddon->price_zero = $addon['price_zero'];
                            } else {
                                $existingAddon->price_zero = false;
                            }
                            $existingAddon->update();
                        }
						$match = true;
					}
				}

				if ($match === false && $addon['isAddon'] === true) {
					$newAddon = new Addon();
					$newAddon->parentId = $product->id;
					$newAddon->childId = $addon['id'];

                    if (isset($addon['include_in_package']) && $addon['include_in_package']) {
                        $newAddon->include_in_package = $addon['include_in_package'];
                        if ($addon['include_in_package']) {
                            if (isset($addon['price_zero'])) {
                                $newAddon->price_zero = $addon['price_zero'];
                            } else {
                                $newAddon->price_zero = false;
                            }
                        } else {
                            $newAddon->price_zero = false;
                        }
                    } else {
                        $newAddon->include_in_package = false;
                        $newAddon->price_zero = false;
                    }

					$newAddon->save();

				}

			} else {
				if ($addon['isAddon'] === true) {
					$newAddon = new Addon;
					$newAddon->parentId = $product->id;
					$newAddon->childId = $addon['id'];

					if (isset($addon['include_in_package']) && $addon['include_in_package']) {
                        $newAddon->include_in_package = $addon['include_in_package'];
                        if (isset($addon['price_zero'])) {
                            $newAddon->price_zero = $addon['price_zero'];
                        } else {
                            $newAddon->price_zero = false;
                        }

                    } else {
                        $newAddon->include_in_package = false;
                        $newAddon->price_zero = false;
                    }

					$newAddon->save();
				}
			}
		}
	}

    /**
     * @return mixed
     */
    public function getAllAvailable()
    {
        $products = Product::with('type')->where('available', 1)->orderBy('shelf_id')->orderBy('order')->get();

        Log::info($products);
        return $products;
    }
}


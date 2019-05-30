<?php

namespace Gatku\Repositories;

use Gatku\Model\Product;
use Gatku\Model\Size;
use Gatku\Model\ProductType;
use Illuminate\Support\Facades\Log;
use Gatku\Model\Addon;
use Bugsnag\BugsnagLaravel\Facades\Bugsnag;

class ProductRepository implements ProductRepositoryInterface {

	public function all()
    {
		$products = Product::with('type', 'addons', 'availability', 'sizes')->get();
		Log::info($products);
		return $products;
	}

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

	public function getOnlyProduct($id) {
        try {
            $product = Product::findOrFail($id);
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

			if ($product) {

                //This is code to display proper thumb image in og tag og:image
                if (!config(['ogimage'])) {
                    config(['ogimage' => $product['ogimage']]);

                    //If no $product['ogimage'] then use mobile_image instead
                    if (!$product['ogimage']) {
                        config(['ogimage' => $product->thumb]);
                    }
                }

                //Page title from Product
                if (isset($product['page_title']) && !empty($product['page_title'])) {
                    config(['page_title' => $product['page_title']]);
                }
            }

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
			if (isset($input['sizes'])) $this->assignSizes($result, $input);
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
            if (isset($input['sizes'])) $this->assignSizes($result, $input);
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
		$product->typeId = (isset($data['typeId'])) ? $data['typeId'] : '';
		$product->attachedImage = (isset($data['attachedImage'])) ? $data['attachedImage'] : '';
		$product->detachedImage = (isset($data['detachedImage'])) ? $data['detachedImage'] : '';
		$product->emailImage = (isset($data['emailImage'])) ? $data['emailImage'] : '';
		$product->thumb = (isset($data['thumb'])) ? $data['thumb'] : '';
		if (isset($data['availabilityTypeId'])) $product->availabilityTypeId = $data['availabilityTypeId'];

		$product->name = (isset($data['name'])) ? $data['name'] : '';
		$product->shortName = (isset($data['shortName'])) ? $data['shortName'] : '' ;

		$product->short_name_extension = (isset($data['short_name_extension'])) ? $data['short_name_extension'] : '';
		$product->slug = (isset($data['slug'])) ? $data['slug'] : '';
		$product->price = (isset($data['price'])) ? $data['price'] : '';
		$product->description = (isset($data['description'])) ? $data['description'] : '';
		$product->metaDescription = (isset($data['metaDescription'] )) ? $data['metaDescription']  : '';

		$product->length = (isset($data['length'])) ? $data['length'] : '';

        $product->editable_1_label  = (isset($data['editable_1_label'])) ? $data['editable_1_label']  : '' ;
        $product->editable_1        = (isset($data['editable_1'])) ? $data['editable_1'] : '';
        $product->editable_1_image  = (isset($data['editable_1_image'])) ? $data['editable_1_image'] : '';

        $product->editable_2_label  = (isset($data['editable_2_label'])) ? $data['editable_2_label'] : '';
        $product->editable_2        = (isset($data['editable_2'])) ? $data['editable_2'] : '';
        $product->editable_2_image  = (isset($data['editable_2_image'])) ? $data['editable_2_image'] : '';

        $product->editable_3_label  = (isset($data['editable_3_label'])) ? $data['editable_3_label'] : '';
        $product->editable_3        = (isset($data['editable_3'])) ? $data['editable_3'] : '';
        $product->editable_3_image  = (isset($data['editable_3_image'])) ? $data['editable_3_image'] : '';

        $product->editable_4_label  = (isset($data['editable_4_label'])) ? $data['editable_4_label'] : '';
        $product->editable_4        = (isset($data['editable_4'])) ? $data['editable_4'] : '';
        $product->editable_4_image  = (isset($data['editable_4_image'])) ? $data['editable_4_image'] : '';

        $product->order =  (isset($data['order'])) ? $data['order'] : 0;
		$product->shipping_description = (isset($data['shipping_description'])) ? $data['shipping_description']  : '';
        $product->mobile_name = (isset($data['mobile_name'])) ? $data['mobile_name'] : '';
        $product->shelf_id = (isset($data['shelf_id'] )) ? $data['shelf_id'] : '';

        $product->sizeable =  (isset($data['sizeable'])) ? $data['sizeable'] : 0;
        
        $product->name_text_align = (isset($data['name_text_align'])) ? $data['name_text_align']  : '';
        $product->name_font_style = (isset($data['name_font_style'])) ? $data['name_font_style']  : '';
        $product->name_font_weight = (isset($data['name_font_weight'])) ? $data['name_font_weight'] : '';

        $product->name_extension_font_style = (isset($data['name_extension_font_style'])) ? $data['name_extension_font_style'] : '';
        $product->name_extension_font_weight = (isset($data['name_extension_font_weight'])) ? $data['name_extension_font_weight'] : '';

        $product->length_font_style = (isset($data['length_font_style'])) ? $data['length_font_style'] : '';
        $product->length_font_weight = (isset($data['length_font_weight'])) ? $data['length_font_weight'] : '';

        $product->name_font_size = (isset($data['name_font_size'])) ? $data['name_font_size'] : 0;
        $product->name_extension_font_size = (isset($data['name_extension_font_size'])) ? $data['name_extension_font_size'] : 0;
        $product->length_font_size = (isset($data['length_font_size'])) ? $data['length_font_size'] : 0;

        $product->mobile_name_text_align = (isset($data['mobile_name_text_align'])) ? $data['mobile_name_text_align'] : '';
        $product->mobile_name_font_style = (isset($data['mobile_name_font_style'])) ? $data['mobile_name_font_style'] : '';
        $product->mobile_name_font_weight = (isset($data['mobile_name_font_weight'])) ? $data['mobile_name_font_weight'] : '';
        $product->mobile_name_font_size = (isset($data['mobile_name_font_size'])) ? $data['mobile_name_font_size'] : 0;

        $product->name_text_align_for_mobile = (isset($data['name_text_align_for_mobile'])) ? $data['name_text_align_for_mobile'] : '';
        $product->name_font_weight_for_mobile = (isset($data['name_font_weight_for_mobile'])) ? $data['name_font_weight_for_mobile'] : '';
        $product->name_font_style_for_mobile = (isset($data['name_font_style_for_mobile'])) ? $data['name_font_style_for_mobile'] : '';
        $product->name_font_size_for_mobile = (isset($data['name_font_size_for_mobile'])) ? $data['name_font_size_for_mobile'] : 0;

        $product->name_text_align_for_shelf = (isset($data['name_text_align_for_shelf'])) ? $data['name_text_align_for_shelf'] : '';
        $product->name_font_weight_for_shelf = (isset($data['name_font_weight_for_shelf'])) ? $data['name_font_weight_for_shelf'] : '';
        $product->name_font_style_for_shelf = (isset($data['name_font_style_for_shelf'])) ? $data['name_font_style_for_shelf'] : '';
        $product->name_font_size_for_shelf = (isset($data['name_font_size_for_shelf'])) ? $data['name_font_size_for_shelf'] : 0;

        $product->name_extension_font_weight_for_mobile = (isset($data['name_extension_font_weight_for_mobile'])) ? $data['name_extension_font_weight_for_mobile'] : '';
        $product->name_extension_font_style_for_mobile = (isset($data['name_extension_font_style_for_mobile'])) ? $data['name_extension_font_style_for_mobile'] : '';
        $product->name_extension_font_size_for_mobile = (isset($data['name_extension_font_size_for_mobile'])) ? $data['name_extension_font_size_for_mobile'] : 0;

        $product->name_extension_font_weight_for_shelf = (isset($data['name_extension_font_weight_for_shelf'])) ? $data['name_extension_font_weight_for_shelf'] : '';
        $product->name_extension_font_style_for_shelf = (isset($data['name_extension_font_style_for_shelf'])) ? $data['name_extension_font_style_for_shelf'] : '';
        $product->name_extension_font_size_for_shelf = (isset($data['name_extension_font_size_for_shelf'])) ? $data['name_extension_font_size_for_shelf'] : 0;

        $product->length_font_weight_for_mobile = (isset($data['length_font_weight_for_mobile'])) ? $data['length_font_weight_for_mobile'] : '';
        $product->length_font_style_for_mobile = (isset($data['length_font_style_for_mobile'])) ? $data['length_font_style_for_mobile'] : '';
        $product->length_font_size_for_mobile = (isset($data['length_font_size_for_mobile'])) ? $data['length_font_size_for_mobile'] : 0;

        $product->length_font_weight_for_shelf = (isset($data['length_font_weight_for_shelf'])) ? $data['length_font_weight_for_shelf'] : '';
        $product->length_font_style_for_shelf = (isset($data['length_font_style_for_shelf'])) ? $data['length_font_style_for_shelf'] : '';
        $product->length_font_size_for_shelf = (isset($data['length_font_size_for_shelf'])) ? $data['length_font_size_for_shelf'] : 0;

        $product->short_name_space = (isset($data['short_name_space'])) ? $data['short_name_space'] : 0;
        $product->length_space = (isset($data['length_space'])) ? $data['length_space'] : 0;

        $product->include_length_on_email = (isset($data['include_length_on_email'])) ? $data['include_length_on_email'] : 0;
        $product->ogimage = (isset($data['ogimage'])) ? $data['ogimage'] : '';
        $product->page_title = (isset($data['page_title'])) ? $data['page_title'] : '';
        $product->shipping = (isset($data['shipping'])) ? $data['shipping'] : 0;

        $product->free_shipping_html = (isset($data['free_shipping_html'])) ? $data['free_shipping_html'] : '';

		return $product;
	}


    /**
     * @param $product
     * @param $data
     */
	private function assignAddons(Product $product, $data)
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

    private function assignSizes(Product $product, $input)
    {
        $sizableRepository = new SizeRepository;
        $sizes = $input['sizes'];

        //Remove deleted sizes
        foreach($product->sizes as $productSize) {
            $delete = true;
            foreach($sizes as $size) {
                if ($productSize->id == $size['id']) {
                    $delete = false;
                }
            }

            if ($delete) {
                $sizableRepository->destroy($productSize->id);
            }
        }


        //Add or update sizes
        foreach($sizes as $size) {
            if ($size['productId'] == 0) {
                $size['productId'] = $product->id;
            }

            if ($size['id']) {
                $sizableRepository->update($size['id'], $size);
            } else {
                $sizableRepository->store($size);
            }
        }
    }
}


@extends('layouts.master')

@section('title')
Admin
@stop

@section('content')
	
	

	<div class="admin-container" ng-controller="AdminController">

		<h1>Admin</h1>
		
		<div class="admin-navigation-container">
			<div class="admin-navigation-tab" ng-click="show('orders')" ng-class="{'selected' : showOrders}">Orders</div>
			<div class="admin-navigation-tab" ng-click="show('products')" ng-class="{'selected' : showProducts}">Products</div>
			<div class="admin-navigation-tab" ng-click="show('you')" ng-class="{'selected' : showYou}">You</div>
			<div class="admin-navigation-tab" ng-click="show('videos')" ng-class="{'selected' : showVideos}">Videos</div>
			<div class="admin-navigation-tab" ng-click="show('home-setting')" ng-class="{'selected' : showHomeSetting}">Home</div>
			<div class="clear"></div>
		</div>

		<div class="admin-section" ng-show="showOrders" ng-controller="AdminordersController as data" ng-cloak>

			<div class="order-search">
				<h2>Orders</h2>
				<div class="ord-src">
					<label>Start From</label>
					<input style="width: 150px;" class="date-ord-input" ; placeholder="<?php echo date('Y-m-d')?>"
						   type="text" ng-model="order_start_date" datepickerstartdate/>
				</div>
				<div class="ord-src">
					<label>End To</label>
					<input style="width: 150px;" class="date-ord-input" ; placeholder="<?php echo date('Y-m-d')?>"
						   type="text" ng-model="order_end_date" datepickerenddate/>
				</div>
				<div class="ord-src">
					<div class="button success-bg" ng-click="data.searchOrder()">Search Order</div>
				</div>
				<div class="ord-src" ng-show="order_start_date || order_end_date">
					<div class="button danger-bg" ng-click="data.resetDateFilter()">Reset range</div>
				</div>
			</div>
			
    <table class="admin-orders-table">

				<tr>
					<th>Info</th>
					<th>Products</th>
					<th>Actions</th>
					<th>Amount</th>
					<th>Date</th>
				</tr>

				<tr dir-paginate="order in orders|itemsPerPage:15" total-items="data.total_count">
				
					<td><span class="brand">@{{ order.number }}</span><br>
						<span class="bold">@{{ order.customer.fullName }}</span><br>
						@{{ order.address }}<br>
						@{{ order.city }}, @{{ order.state }} @{{ order.zip }}
					</td>
					<td>
						<ul>
							<li ng-repeat="item in order.items" class="uppercase bold">
								@{{ item.product.sizeable ? item.size.name : item.product.name }} <span ng-show="item.quantity > 1" class="lowercase brand">x @{{ item.quantity }}</span>
								<ul class="admin-order-addons-list">
									<li ng-repeat="addon in item.addons">
										@{{ addon.product.name }} <span ng-show="addon.quantity > 1" class="lowercase brand">x @{{ addon.quantity }}</span>
									</li>
								</ul>
							</li>
						</ul>
					</td>
					<td>{{-- <div class="button info-bg">Print Label</div> --}}
					<shipping-request order="order" shipping="order.shipping"></shipping-request>
						<div ng-if="!order.tracking" style="margin-right: 5px;float:left;">
							<shipping-track order="order" tracking=""></shipping-track>	
						</div>
						<div ng-if="order.tracking" style="margin-right: 5px;float:left;">

							<a ng-if="order.tracking.carrier == 'usps'" href="https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=@{{ order.tracking.track_id }}" target="_blank"><div class="button success-bg">Track# @{{ order.tracking.track_id }}</div></a>
							<a ng-if="order.tracking.carrier == 'auspost'" href="https://auspost.com.au/parcels-mail/track.html#/track?id=@{{ order.tracking.track_id }}" target="_blank"><div class="button success-bg">Track# @{{ order.tracking.track_id }}</div></a>
							<a ng-if="order.tracking.carrier == 'packsend'" href="https://online.packsend.com.au/tracktrace?trackingnumber=@{{ order.tracking.track_id }}" target="_blank"><div class="button success-bg">Track# @{{ order.tracking.track_id }}</div></a>
							<a ng-if="order.tracking.carrier == 'ups'" href="https://wwwapps.ups.com/WebTracking/track?track=yes&trackNums=@{{ order.tracking.track_id }}" target="_blank"><div class="button success-bg">Track# @{{ order.tracking.track_id }}</div></a>
						</div>
						<div ng-if="order.tracking" style="margin-right: 5px;float:right;">
							<shipping-track order="order" tracking="order.tracking"></shipping-track>	
						</div>
					</td>
					<td>
					<span ng-if="order.orderAmount">$@{{ order.orderAmount }}</span>
					
					</td>
					<td>@{{ order.createdAtHuman }}</td>
				</tr>
			</table> <dir-pagination-controls
                   max-size="8"
                   direction-links="true"
                   boundary-links="true"
                   on-page-change="data.getData(newPageNumber)" >
                </dir-pagination-controls>
           
		</div>


		<div class="admin-section" ng-show="showProducts" ng-cloak>
			
			<div class="admin-sub-section">

				<div class="button success-bg" ng-hide="editState" ng-click="createProduct()">Create Product</div>
				<div class="button success-bg" ng-show="editState && editingNew" ng-click="saveProduct();">Save</div>
				<div class="button success-bg" ng-show="editState && editingNew === false" ng-click="updateProduct();">Update</div>
				<div class="button error-bg" ng-show="editState" ng-click="reset();">Cancel</div>
				<span ng-show="editState" class="edit-indicator">Editing Product</span>

				<form class="new-product-form" ng-show="editState" ng-cloak>

					<label>Product Type</label>
					<select ng-options="type.id as type.name for type in types" ng-model="newProduct.typeId"></select>
					<br>
					<label>Name</label>
					<input type="text" ng-model="newProduct.name">

					<label>Short Name</label>
					<input type="text" ng-model="newProduct.shortName">

					<label>Slug</label>
					<input type="text" ng-model="newProduct.slug">

					<label>Availability</label>
					<select ng-options="availabilityType.id as availabilityType.name for availabilityType in availabilityTypes" ng-model="newProduct.availabilityTypeId"></select>

					<label>Shipping Description [max: 255 characters]</label>
					<input type="text" ng-model="newProduct.shipping_description"></input>

					<label>Description</label>
					<textarea ng-model="newProduct.description"></textarea>

					<label>Meta Description</label>
					<input type="text" ng-model="newProduct.metaDescription">

					<label>Length</label>
					<input type="text" ng-model="newProduct.length">

					<label>Price</label>
					<input type="number" ng-model="newProduct.price">

					<label>Addons</label>
					<table class="table table-striped table-bordered table-sm">
						<thead class="thead-dark">
							<tr>
								<th style="text-align: center"><b>Addon</b></th>
								<th style="text-align: center"><b>Included in package</b></th>
								<th style="text-align: center"><b>Price zero if included in package</b></th>
							</tr>
						</thead>
						<tbody>
							<tr ng-repeat="addon in newProduct.addonSelection" ng-if="editState">
								<td>
									<div class="new-product-checkbox-container">
										<input type="checkbox" ng-model="addon.isAddon">&nbsp;<span class="uppercase">@{{ addon.name }}</span>
									</div>
								</td>
								<td style="text-align: center">
									<input type="checkbox" ng-model="addon.include_in_package">
								</td>
								<td style="text-align: center">
									<input type="checkbox" ng-model="addon.price_zero">
								</td>
							</tr>
						</tbody>
					</table>

					<label>Attached Image</label>
					<div class="upload-field" ng-style="{'background-image':'url(' + newProduct.attachedImage + ')'}">
						<i class="fa fa-image" ng-hide="newProduct.attachedImage"></i>
						<input type="text" ng-model="newProduct.attachedImage" class="image-path-storage-input">
						<input type="file" ng-file-drop ng-file-select="upload($files, 'attachedImage')">
					</div>
					
					<label>Detached Image</label>
					<div class="upload-field" ng-style="{'background-image':'url(' + newProduct.detachedImage + ')'}">
						<i class="fa fa-image" ng-hide="newProduct.detachedImage"></i>
						<input type="text" ng-model="newProduct.detachedImage" class="image-path-storage-input">
						<input type="file" ng-file-select="upload($files, 'detachedImage')">
					</div>

					<label>Thumb</label>
					<div class="upload-field" ng-style="{'background-image':'url(' + newProduct.thumb + ')'}">
						<i class="fa fa-image" ng-hide="newProduct.thumb"></i>
						<input type="text" ng-model="newProduct.thumb" class="image-path-storage-input">
						<input type="file" ng-file-select="upload($files, 'thumb')">
					</div>

					<label>Email Image</label>
					<div class="upload-field" ng-style="{'background-image':'url(' + newProduct.emailImage + ')'}">
						<i class="fa fa-image" ng-hide="newProduct.emailImage"></i>
						<input type="text" ng-model="newProduct.emailImage" class="image-path-storage-input">
						<input type="file" ng-file-select="upload($files, 'emailImage')">
					</div>

					<label>Maneuverability</label>
					<input type="text" ng-model="newProduct.maneuverability">

					<label>Trajectory</label>
					<input type="text" ng-model="newProduct.trajectory">

					<label>Balance</label>
					<input type="text" ng-model="newProduct.balance">

					<label>Stealth</label>
					<input type="text" ng-model="newProduct.stealth">
					<label>Product order</label>
					<input type="text" ng-model="newProduct.order"
           min="0" max="500">  
				</form>

				<div class="button success-bg" ng-show="editState && editingNew" ng-click="saveProduct();">Save</div>
				<div class="button success-bg" ng-show="editState && editingNew === false" ng-click="updateProduct();">Update</div>
				<div class="button error-bg" ng-show="editState" ng-click="reset();">Cancel</div>
				<span ng-show="editState" class="edit-indicator">Editing Product</span>

			</div>

			<div class="admin-sub-section" ng-hide="editState">

				<div class="order-search">

					<h2>Products</h2>
					<div class="ord-src">
						<label>Start From</label>
						<input style="width: 150px;" class="date-ord-input"; placeholder="<?php echo date('Y-m-d')?>" type="text" ng-model="order_start_date" datepickerstartdate />
					</div>
					<div class="ord-src">
						<label>End To</label>
						<input style="width: 150px;" class="date-ord-input"; placeholder="<?php echo date('Y-m-d')?>" type="text" ng-model="order_end_date" datepickerenddate />
					</div>
					<div class="ord-src">
						<div class="button success-bg" ng-click="getProducts()">Submit</div>
					</div>
					<div class="ord-src" ng-show="order_start_date || order_end_date">
						<div class="button danger-bg" ng-click="resetDateFilter()">Reset range</div>
					</div>
				</div>



				<table class="admin-products-table">
					<tr>
						<th>Name</th>
						<th>Type</th>
						<th>Stock</th>
						<th>Sold</th>
						<th>Display Order</th>
						<th>Actions (hover)</th>
					</tr>
					<tr ng-repeat="product in products">
						<td class="bold uppercase">@{{ product.name }}</td>
						<td class="faded">@{{ product.type.name }}</td>
						<td class="faded">@{{ product.availability.name }}</td>
						<td class="faded">@{{ product.sold | number | customNumber }}</td>
						<td class="faded">@{{ product.order }}</td>

						<td>
							<a href="/product/@{{ product.slug }}" target="_blank"><div class="button info-bg">View</div></a>
							<div class="button info-bg" ng-click="editProduct(product)">Edit</div>
							<div class="button error-bg">Delete</div>
						</td>
					</tr>
				</table>

			</div>

		</div>

		<div class="admin-section" ng-show="showYou" ng-cloak>
			<h2>You</h2>

			<div class="admin-sub-section">

				<div class="button success-bg" ng-hide="editState" ng-file-select="uploadYouImage($files)">Upload New</div>
				<span ng-show="editState" class="edit-indicator">Editing You Image</span>

				<div class="admin-you-image-staging" ng-show="editState">
					<div class="upload-field" ng-style="{'background-image':'url(' + newYouImage.image + ')'}"></div>
					<label>Select Products</label>

					<div class="you-image-checkbox-container" ng-repeat="product in products">

						<input type="checkbox" checklist-model="newYouImage.products" checklist-value="product.id">&nbsp;<span class="uppercase">@{{ product.name }}</span>
					</div> 
					<!-- <label>Select corresponding product (optional)</label>
					<p><select ng-options="product.id as product.name for product in products" ng-model="newYouImage.productId"></select></p> -->

					<div class="button success-bg" ng-click="saveYouImage()">Save</div> 
					<div class="button error-bg" ng-click="reset()">Cancel</div>
				</div>

			</div>

			<div class="admin-sub-section">

				<div class="grid-container">

					{{-- <div class="grid-square square" ng-repeat="youImage in youImages" ng-style="{'background-image':'url(' + youImage.image + ')'}"></div> --}}
					<div class="grid-square square" ng-repeat="youImage in youImages" back-img="@{{ youImage.image }}"></div>

					
					<div class="clear"></div>

				</div>
			</div>
			


		</div>

		<div class="admin-section" ng-show="showVideos" ng-cloak>
			<h2>Videos</h2>

		</div>
		<div class="admin-section" ng-show="showHomeSetting" ng-cloak>
			<h2>Home</h2>

			<div class="admin-sub-section">
			<form name="home-setting" class="home-setting-form">
				<!-- <div class="grid-square square"  back-img="@{{ HomeSettings.image }}"></div> -->
				
				<!-- upload mobile image -->
				<label>Logo</label>
					<div style=" height: auto;"class="upload-field" ng-style="{'background-image':'url(' + homeSetting.logo + ')'}">
						<i class="fa fa-image" ng-hide="homeSetting.logo"></i>
						<input type="text" ng-model="homeSetting.logo" class="image-path-storage-input">
						<input type="file" ng-file-drop ng-file-select="uploadHomeImage($files, 'logo')">
					</div>
				<label>Button Color</label>
					<input style="width: 150px;" placeholder="#000000" type="text" ng-model="homeSetting.button_color">
				<label>Home Image</label>
					<div class="upload-field" ng-style="{'background-image':'url(' + homeSetting.image + ')'}">
						<i class="fa fa-image" ng-hide="homeSetting.mobile_image"></i>
						<input type="text" ng-model="homeSetting.image" class="image-path-storage-input">
						<input type="file" ng-file-drop ng-file-select="uploadHomeImage($files, 'image')">
					</div>

				<label>Mobile Image</label>
					<div class="upload-field" ng-style="{'background-image':'url(' + homeSetting.mobile_image + ')'}">
						<i class="fa fa-image" ng-hide="homeSetting.mobile_image"></i>
						<input type="text" ng-model="homeSetting.mobile_image" class="image-path-storage-input">
						<input type="file" ng-file-drop ng-file-select="uploadHomeImage($files, 'mobile_image')">
					</div>
					
				
				<label>On Site Live Til</label>
					<input type="text" ng-model="homeSetting.image_info"> 

				<label>Image Credit</label>
				<input type="text" ng-model="homeSetting.image_credit">
				</form>
				<div class="button success-bg" ng-click="saveHomeSetting()">Save</div> 
			</div>
			
		</div>

	</div>

</style>
@stop
<?php

use Gatku\Model\HomeSetting;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', ['as' => 'home', function(HomeSetting $homeSetting) {
    return View::make('pages.home')->with('homeSetting',  $homeSetting);
}]);

Route::get('au', ['as' => 'australia', function(HomeSetting $homeSetting) {
    return View::make('pages.australia')->with('homeSetting',  $homeSetting);
}]);

Route::post('product/image', ['as' => 'product.image', 'uses' => 'ProductController@upload']);
Route::get('product/types', ['as' => 'product.types', 'uses' => 'ProductController@types']);
Route::get('product/by/type', ['as' => 'product.getByType', 'uses' => 'ProductController@getByType']);
Route::get('product/available', ['as' => 'product.getAllAvailable', 'uses' => 'ProductController@getAllAvailable']);
Route::get('product/by/slug/{slug}', ['as' => 'product.getBySlug', 'uses' => 'ProductController@getBySlug']);
Route::get('product/get/{id}', ['as' => 'product.get', 'uses' => 'ProductController@get']); //done
Route::get('product/photos/{id}', ['as' => 'product.customerPhotos', 'uses' => 'ProductController@photos']);
Route::get('size/by/slug/{slug}', ['as' => 'size.bySlug', 'uses' => 'ProductController@getSizeBySlug']);

Route::resource('product', 'ProductController');

Route::resource('user', 'UserController', ['except' => ['create']]);

Route::get('login', ['as' => 'login', 'uses' => 'AuthenticationController@index']);
Route::post('login', ['as' => 'login.authenticate', 'uses' => 'AuthenticationController@authenticate']);
Route::get('logout', ['as' => 'logout', 'uses' => 'AuthenticationController@logout']);

//Admin access limited routes only
Route::middleware(['auth'])->prefix('admin')->group(function () {

    Route::get('/', ['as' => 'admin.index', function(HomeSetting $homeSetting) {
        return View::make('pages.admin')->with('homeSetting',  $homeSetting);
    }]);

    //
    Route::get('quantity-report', 'QuantityReportController@index');

    //Admin sales tax access to all methods in controller
    Route::resource('sales-tax', 'SalesTaxController');
});
//Admin access limited routes only - end

//For front end sales tax access only to index method
Route::resource('sales-tax', 'SalesTaxController', ['only' => ['index']]);


Route::resource('order', 'OrderController');

Route::get('orderall/{itemsPerPage}/{pagenumber}', ['as' => 'order.orderall', 'uses' => 'OrderController@orderall']);
Route::get('orderall/{itemsPerPage}/{pagenumber}/{startdate}/{enddate}', ['as' => 'order.orderall', 'uses' => 'OrderController@orderall']);
Route::get('orderall/{itemsPerPage}/{pagenumber}/{startdate}', ['as' => 'order.orderall', 'uses' => 'OrderController@orderall']);

Route::resource('you-image', 'YouImageController', ['only' => ['index', 'store', 'update', 'destroy']]);
Route::post('you-image/upload', ['as' => 'you-image.upload', 'uses' => 'YouImageController@upload']);

Route::resource('home-setting', 'HomeSettingController', ['only' => ['index', 'store', 'update', 'destroy']]);

Route::resource('email-setting', 'EmailSettingsController', ['only' => ['index', 'store']]);

Route::resource('hear-good-stuff', 'HearGoodStuffController');

Route::post('home-image/upload', ['as' => 'home-image.upload', 'uses' => 'HomeSettingController@upload']);

Route::post('email-image/upload', ['as' => 'email-image.upload', 'uses' => 'EmailSettingsController@upload']);

Route::post('cart-calculations', ['uses' => 'CartCalculationsController@getCalculationsForCart']);

Route::get('thankyou', ['as' => 'thankyou', function(HomeSetting $homeSetting) {
    return View::make('pages.thankyou')->with('homeSetting',  $homeSetting);
}]);

Route::get('thespear', ['as' => 'thespear', function(HomeSetting $homeSetting) {
    return View::make('pages.thespear')->with('thespear',  $homeSetting)->with('homeSetting',  $homeSetting);
}]);

Route::get('images', function() {
    // TODO : use this forumula to retrieve images so that
    // new products can choose already-uploaded images as their
    // product images.

    $photos = [];

    chdir(public_path() . '/img/uploads/');

    foreach(glob('*.{jpg,JPG,jpeg,JPEG,png,PNG}', GLOB_BRACE) as $index => $file) {
        $photos[$index] = $file;
    }
    var_dump($photos);
});

Route::get('quote', ['as' => 'quote', 'uses' => 'QuoteController@index']);
Route::post('quote', ['as' => 'quote.post', 'uses' => 'QuoteController@sendEmail']);

Route::get('media', ['as' => 'media', function(HomeSetting $homeSetting) {
    return View::make('pages.media')->with('homeSetting',  $homeSetting);
}]);

Route::get('availability-type', ['as' => 'availabilityType.index', 'uses' => 'AvailabilityController@index']);

Route::post('shipping-request/pay', ['as' => 'shipping-request.pay', 'uses' => 'ShippingRequestController@pay']);
Route::resource('shipping-request', 'ShippingRequestController', ['except' => ['index', 'create', 'edit', 'update']]);
Route::resource('shipping-track', 'ShippingTrackController', ['except' => ['index', 'create', 'edit', 'update']]);


//Discount route
Route::resource('discount', 'DiscountController');
Route::resource('discounts-exists', 'DiscountExistsController'); //Check if in discounts table are any records

//Shelf and Shelves routes
Route::resource('shelf', 'ShelfController');
Route::resource('shelves', 'ShelvesController')->only(['index']);
Route::put('shelves', ['uses' => 'ShelvesController@update']);

//Resend email notifications for order
Route::post('/resend-order-email/{orderId}', [ 'uses' => 'ResendOrderEmailsController@resend']);

//Display email notifications for order
Route::get('/display-order-email/admin/{orderId}', [ 'uses' => 'DisplayOrderNotificationEmailController@admin']);
Route::get('/display-order-email/customer/{orderId}', [ 'uses' => 'DisplayOrderNotificationEmailController@customer']);

//Below code is to test mailable objects. Uncomment if necessary.
//Route::get('/mailable', function (HomeSetting $homeSetting) {
//
//    $order = Gatku\Order::find(604);
//    $discount = new Gatku\Discount;
//    $subtotal = 100;
//    $shipping = 20;
//    $total = $subtotal + $shipping;
//    $date = '2018-06-19';
//
//    Mail::to([
//        [   'email' => 'marcincyniu@gmail.com',
//            'name' => 'Marcin Wojcik'
//        ]
//    ])->send( new App\Mail\EmailsOrder($order, $discount, $subtotal, $shipping, $total, $date, $homeSetting) );

//    Mail::to([
//        [   'email' => 'marcincyniu@gmail.com',
//            'name' => 'Marcin Wojcik'
//        ]
//    ])->send( new App\Mail\EmailsOrderAdmin($order, $discount, $subtotal, $shipping, $total, $date, $homeSetting) );
//
//    return 'Sent';
//});



// Feature/205 This is only for test. Remove:

Route::get('/video_tag', ['as' => 'home', function(HomeSetting $homeSetting) {
    return View::make('pages.video_tag')->with('homeSetting',  $homeSetting);
}]);

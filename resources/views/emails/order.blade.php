
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html xmlns="http://www.3c.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="viewport" content="width=200, initial-scale= 1.0">
		<title>Customer Purchase</title>
		<style>
		body, #body-table, #body-cell {
			height:100% !important;
			margin:0;
			padding:0;
			width:100% !important;
		}
		table {
			border-collapse: collapse;
		}
		img, a img {
			border:0;
			outline:none;
			text-decoration;
		}
		h1, h2, h3, h4 ,h5, h6 {
			margin:0;
			padding:0;
		}

		/*///////// CLIENT SPECIFIC STYLES ////////*/
		.ReadMsgBody{ width:100%;}  /*Force Hotmail/Outlook.com to display emails at full width.*/
		.ExternalClass { width:100%;} /*Force Hotmail/Outlook.com to display emails at full width.*/

		.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{ line-height:100%;} /*Force Hotmail/ Outlook.com to display line heights normally.*/
		table, td {
			mso-table-lspace: 0pt; /* Remove spacing between tables in Outlook 2007 and up */
			mso-table-rspace: 0pt; /* Remove spacing between tables in Outlook 2007 and up */
		}
		#outlook a { padding:0;} /* Force Outlook 2007 and up to provide a "view in browser" message */
		img { -ms-interpolation-mode: bicubic;} /* Force IE to smoothly render resized images */
		body, table, td, p, a, li, blockquote, {
			-ms-text-size-adjust:100%;
			-webkit-text-size-adjust:100%; /* Prevent Windows and Webkit based mobile platforms from changing declared text sizes. */
			font-family: Helvetica, Arial, sans-serif;
		}

		/*////////// GENERAL STYLES //////////*/
		#body-cell {
			/*border: solid red thin;*/
		}
		#header {
			height:45px;
			/*background-color:gray;*/
			/*border:solid green thin;*/

			/*width:100;*/
			font-family: "Helvetica", Arial, sans-serif;
		}
		#header img {
			/*height:90%;*/
			margin-left:0;
			margin-top: 5px;
			font-family: "Helvetica", Arial, sans-serif;
		}
		#container {
			max-width:800px;
			/*width:90%;*/
			/*border:solid blue thin;*/
			/*background-color:orange;*/
			font-family: "Helvetica", Arial, sans-serif;

		}
		#main {
			max-width:950px;
			width:90%;
			/*height:600px;*/
			/*background-color: green;*/
			font-family: "Helvetica", Arial, sans-serif;
			padding-top:10px;
		}
		#order-info {
			width:100%;
			height:35px;
			/*background-color: red;*/
                        color:#E24A62;
			border-bottom: 1px solid black;
			font-family: "HelveticaNeue-Light", "Helvetica", Arial, sans-serif;
			padding:0 0 0 0px !important;
			
		}
		
		#main-data-1 {
			/*background-color: yellow;*/
			width:30%;
			/*width:40px;
			height:40px;*/
			font-family: "HelveticaNeue-Light", "Helvetica", Arial, sans-serif;
			padding-top:20px;
			padding-bottom:20px;
			font-size:16px;
			font-weight: 200;
		}
		#main-data-2 {
			/*background-color:#C3C3C3;*/
			width:70%;
			font-family: "HelveticaNeue-Light", "Helvetica", Arial, sans-serif;
		}
		#totals {
			/*background-color:pink;*/
			font-family: "HelveticaNeue-Light", "Helvetica", Arial, sans-serif;
			font-size: 12px;
			color:#D1D1D1;
			border-top: 1px solid black;
			height:50px;
		}

		#total {
			border-top: 1px solid black;
			padding-top:10px;
			font-weight: bold;
		}
		#date {
			font-size:20px;
			font-weight: 200;
		}

		#status {
			/*display: inline;*/
			font-size:16px;
			font-weight: 200;
		}

		.product {
			/*background-color: green;*/
			padding-top:20px;
			padding-bottom: 0px;
			/*border-top: 1px solid black;*/
			border-bottom: 1px solid black;
		}

		.product-image {
			width:500px;
			height:auto;
			vertical-align: bottom;
			/*padding-left:-40px;*/
		}

		.product-after {
			padding-top:30px;
			padding-bottom: 0px;
			border-top: 1px solid black;
			border-bottom: 1px solid black;
			height:250px; overflow:hidden;
		}


		.image-container {
			width:100%;
			text-align: left;
		}

		.applelinksblack a {
			color:black !important;
			text-decoration: none !important;

		}

		.product-name {
			font-size: 20px;
			text-transform: uppercase;
		}


		.addons-table td {
			padding:4px 8px;
		}
		.addons-table td:last-child {
			padding-right:0px;
		}

		.main-product td {
			text-align:right;
		}
		.main-product:first-child td {
			padding-top:50px;
		}
		.product-name-row {
			border-bottom:solid black 1px;
		}
		.product-name-row td {
			text-align:right;
		}

		.product-data-cell {
			vertical-align:top;
		}
		.first-opt-set td{
			padding-top:35px;
		}

		.bold {

			font-weight:bold;

		}

		.product-quantity {
			font-weight:bold;
		}
		.product-final-price {
			font-weight:bold;
		}
		.multiple {
			display:block;
			background-color:#E24A62;
			width:18px;
			height:18px;
			text-align:center;
			border-radius:50%;
			box-sizing:border-box;
			padding-top:2px;
			color:white;
		}

        .product-image {
              width:300px

         }

		</style>
	</head>	
	<body style="margin: 0;padding: 0;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: Helvetica, Arial, sans-serif;height: 100%;width: 100%;">
		<center>
			<table id="body-table" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: Helvetica, Arial, sans-serif;margin: 0;padding: 0;height: 100%;width: 100%;">
				<tr>
					<td id="body-cell" align="center" valign="top" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: Helvetica, Arial, sans-serif;margin: 0;padding: 0;height: 100%;width: 100%;padding-bottom:50px">
						<table id="container" border="0" cellpadding="0" cellspacing="0" width="1000px" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: 'Helvetica', Arial, sans-serif;max-width: 800px;">
							<thead>
								<tr>
									<th id="header" align="left" valign="top" colspan="2" style="height: 45px;font-family: "Helvetica", Arial, sans-serif;">
										<!-- Gatku image here -->
										<img src="{{ asset('img/email-assets/logo.png') }}" height="40px" style="margin-left: 0;margin-top: 5px;border: 0;outline: none;text-decoration: ;-ms-interpolation-mode: bicubic;font-family: 'helvetica' ;, arial, sans-serif: ;">
									</th>
								</tr>
								<tr>
									<th id="order-info" colspan="2" padding="0" align="left" style="width: 100%;height: 35px;border-bottom: 1px solid black;font-family: 'Helvetica', Arial, sans-serif;padding: 0 0 0 0px;color:#E24A62"><span id="status" style="font-size: 16px;font-weight: 200;">Order : {{ $order['number'] }} - </span><span id="date" style="font-size: 20px;font-weight: 200;">{{ $date }}</span></th>
								</tr>
							</thead>
							<tbody>
							<tr id="main" style="max-width: 950px;width: 90%;font-family: 'Helvetica', Arial, sans-serif;padding-top: 10px;">
								<td id="main-data-1" valign="top" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: 'Helvetica', Arial, sans-serif;width: 30%;padding-top: 20px;padding-bottom: 20px;font-size: 16px;font-weight: 200;">

									<!-- Address And Name here -->

									<p style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: Helvetica, Arial, sans-serif; font-weight:bold;">{{ $order['customer']['fullName'] }}</p>

	                                <p style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: Helvetica, Arial, sans-serif;">
	                                 	{{ $order['address'] }}<br>
	                                 	{{ $order['city'] }}, {{ $order['state'] }} {{ $order['zip'] }}<br>
	                                 	{{ $order['country'] }}<br>
	                                 	Phone: {{ $order['customer']['phone'] }}<br>
	                                 	Email: {{ $order['customer']['email'] }}
	                             	</p>

	                             	@if(isset($order['comments']))
	                             	<p style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: Helvetica, Arial, sans-serif;">
	                             		Comments :<br>
	                             		{{ $order['comments'] }}
	                             	</p>
	                             	@endif

										
								</td>

								<td id="main-data-2" align="right" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: 'Helvetica', Arial, sans-serif;width: 70%;">

									<div style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: Helvetica, Arial, sans-serif;">


										@foreach($order['items'] as $i => $item)
										<div class="product" style="{{ $i == 0 ? 'padding-top:20px;' : 'padding-top:30px; border-top:1px solid black; ' }}padding-bottom:0px;border-bottom:1px solid black;height:290px; overflow:hidden;">
											<table style="width:100%;">
												<tr>
													<td class="product-image-cell">
														<div class="image-container" style="width:100%;text-align:left;">
															<!-- Product thumb here -->
															<img class="product-image" style="width:200px;height:auto;vertical-align: bottom;" src="{{ $item['product']['emailImage'] }}" >
														</div>
													</td>
													<td class="product-data-cell">
														<table class="addons-table" style="float:right;">
															<tr class="product-name-row">
																<!-- Product Name here -->
																@if($item['product']['sizeable'])
																<td><span class="product-name" style="text-transform:uppercase;"><strong>{{ $item['size']['name'] }}</strong></span></td>
																@else
																<td><span class="product-name" style="text-transform:uppercase;"><strong>{{ $item['product']['shortName'] }}</strong>@if($item['product']['type']['slug'] === 'pole')<span>'ER</span>@endif
																	@if (strpos($item['product']['slug'], 'paralyzer') !== false || $item['product']['type']['slug'] === 'glass')<small>/{{ $item['product']['length'] }}</small>@endif</span>
																</td>
																@endif

																@if($item['product']['sizeable'])
																<td>${{ $item['size']['price'] / 100 }}</td>
																@else
																<td>${{ $item['product']['price'] / 100 }}</td>
																@endif

																<td><span class="product-quantity @if($item['quantity'] > 1) multiple @endif">{{ $item['quantity'] }}</span></td>

																@if($item['product']['sizeable'])
																<td><span class="product-final-price">${{ ($item['size']['price'] * $item['quantity']) / 100}}</span></td>
																@else
																<td><span class="product-final-price">${{ ($item['product']['price'] * $item['quantity']) / 100}}</span></td>
																@endif

															</tr>

															@foreach($item['addons'] as $ii => $addon)
															<!-- first addon -->
															<tr class="main-product {{ $ii == 0 ? 'first-opt-set' : '' }}">
																<td><span class="bold">{{ $addon['product']['name'] }}</span></td>

																@if($addon['product']['sizeable'])
																<td>${{ $addon['size']['price'] / 100 }}</td>
																@else
																<td>${{ $addon['product']['price'] / 100 }}</td>
																@endif

																<td><span class="product-quantity @if($addon['quantity'] > 1) multiple @endif">{{ $addon['quantity'] }}</span></td>

																@if($addon['product']['sizeable'])
																<td><span class="product-final-price">${{ ($addon['size']['price'] * $addon['quantity']) / 100 }}</span></td>
																@else
																<td><span class="product-final-price">${{ ($addon['product']['price'] * $addon['quantity']) / 100 }}</span></td>
																@endif
															</tr>

															@endforeach
														
														</table>
													</td>
												</tr>
											</table>
										</div>
										@endforeach

										<br><br><br>

									</div>

									<p id="total" style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: Helvetica, Arial, sans-serif;border-top: 1px solid black;padding-top: 10px;font-weight: bold;">
										@if($discount > 0)
										<span style="font-weight:normal">Discount: <span style="color:#2ECC71;">- ${{ $discount / 100 }}</span></span><br>
										@endif
										<span style="font-weight:normal">Subtotal: ${{ $subtotal / 100 }}</span><br>
										<span style="font-weight:normal">Shipping: ${{ $shipping / 100 }}</span><br>
										Total : ${{ $total / 100 }}
									</p>

								</td>
															
							</tr>
							</tbody>
							<tfoot>

								<tr id="totals" style="font-family: 'Helvetica', Arial, sans-serif;font-size: 12px;color: #D1D1D1;border-top: 1px solid black;height: 50px;">
									<td colspan="2" align="right" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: Helvetica, Arial, sans-serif; color:#E24A62;">
									Thank you for your purchase. 
									</td>
								</tr>

                                <tr>
									<td colspan="2">
										<table style="width:inherit;" style="margin-bottom:30px;">

											<?php $displayShrinker = false; ?>

											<?php 

												foreach($order['items'] as $item) {

													if($item['product']['slug'] === 'eighter' || $item['product']['slug'] === 'niner' || $item['product']['slug'] === 'tener') {

														$displayShrinker = true;

													}

													foreach($item['addons'] as $addon) {

														if ($addon['product']['slug'] === 'inshore-shrinker') {

															$displayShrinker = false;

														}

													}

												}

											 ?>

											{{-- Inshore Message temporatily turned off. --}}
											{{-- @if($displayShrinker)
											<tr id="add-inshore" style="border-top:solid black 1px; border-bottom:solid black 1px;">
												<td style="width:100%; font-size:30px; letter-spacing:-1px; padding:10px 0; text-align:center;" colspan="2"><span style="font-weight:bold">Add InshoreShrinker</span> - Its like <span style="font-weight:bold">2 poles for only $49 more</span></td>
											</tr>
											<tr id="add-inshore-image">
												<td colspan="2" style="padding:20px 0;"><img style="width:100%;" src="{{ asset('img/full-size/inshore-shrinker-detached.jpg') }}"></td>
											</tr>
											<tr id="add-inshore-text">
												<td colspan="2">
													<p style="font-size:50px;font-weight:bold;letter-spacing:-1px;-webkit-margin-before: 0em;-webkit-margin-after: 0em;color:#E24A62">InshoreShrinker - $49</p>
													<p>Buying an <span style="font-weight:bold">EIGHT</span>&apos;ER, <span style="font-weight:bold">NINE</span>&apos;ER, or <span style="font-weight:bold">TEN</span>&apos;ER? Purchasing an InshoreShrinkerâ¢ will allow 
														you to shrink your ordered pole nearly two feet on the <span style="font-weight:bold">EIGHT</span>&apos;ER and almost two and a half 
														feet on the <span style="font-weight:bold">NINE</span>&apos;ER &amp; <span style="font-weight:bold">TEN</span>&apos;ER! It&apos;s like you&apos;re getting 2 poles with your purchase for only $49 more.
													</p>
													<p style="padding-bottom:40px"><span style="font-weight:bold">Add to your existing order now &amp; it SHIPS for FREE!</span> Simply reply to this email 'Add InshoreShrinker' and we&apos;ll take care of the rest.</p>

												</td>
											</tr>
											@endif --}}
											
											<tr id="thefooter" style="border-top:solid black 1px; border-bottom:solid black 1px;">
												<td style="color:#E24A62;font-size:16px; padding:15px 0;" colspan="1">Customer Service - Email: dustin@gatku.com / Phone: +001 619 507-3860</td>

												<!-- INSERT SOCIAL MEDIA IMAGES -->
												<td style="text-align:right;" colspan="1"><a href="http://www.facebook.com/gatku"><img height="25" style="margin-left:30px;" src="{{ asset('img/email-assets/red-facebook.png') }}"></a><a href="http://www.twitter.com/gatku"><img height="25" style="margin-left:30px;" src="{{ asset('img/email-assets/red-twitter.png') }}"></a><a href="http://www.gatku.com"><img height="25" style="margin-left:30px;" src="{{ asset('img/email-assets/red-logo.png') }}"></a></td>

											</tr>
										</table>
									</td>
								</tr>
							</tfoot>
						</table>
					</td>
				</tr>
			</table>
		</center>
	</body>
</html>


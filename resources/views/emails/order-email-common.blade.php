<table id="body-table" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: Helvetica, Arial, sans-serif;margin: 0;padding: 0;height: 100%;width: 100%;">
    <tr>
        <td id="body-cell" align="center" valign="top" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: Helvetica, Arial, sans-serif;margin: 0;padding: 0;height: 100%;width: 100%;padding-bottom:50px">
            <table id="container" border="0" cellpadding="0" cellspacing="0" width="1000px" style="border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: 'Helvetica', Arial, sans-serif;max-width: 800px;">
                <thead>
                <tr>
                    <th id="header" align="left" valign="top" colspan="2" style="height: 45px;font-family: "Helvetica", Arial, sans-serif;">

                    <!-- Gatku image here -->
                    <img src="{{ asset($emailSettings['email_main_logo_url']) }}" height="40px" style="margin-left: 0;margin-top: 5px;border: 0;outline: none;text-decoration: ;-ms-interpolation-mode: bicubic;font-family: 'helvetica' ;, arial, sans-serif: ;">
                    </th>
                </tr>
                <tr>
                    <th id="order-info"
                        colspan="2"
                        padding="0"
                        align="left"
                        style="	width: 100%;
							height: 35px;
							border-bottom: 1px solid black;
							font-family: 'Helvetica', Arial, sans-serif;
							padding: 0 0 0 0px;
							color: {{ $emailSettings['email_footer_color'] }}">
                        <span id="status" style="font-size: 16px;font-weight: 200;">Order : {{ $order['number'] }} - </span><span id="date" style="font-size: 20px;font-weight: 200;">{{ $date }}</span></th>
                </tr>
                </thead>
                <tbody>
                <tr id="main" style="max-width: 950px;width: 90%;font-family: 'Helvetica', Arial, sans-serif;padding-top: 10px;">
                    <td id="main-data-1" valign="top" style="mso-table-lspace: 0pt;mso-table-rspace: 0pt;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: 'Helvetica', Arial, sans-serif;width: 30%;padding-top: 20px;padding-bottom: 20px;font-size: 16px;font-weight: 200;">

                        <!-- Address And Name here -->

                        <p style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: Helvetica, Arial, sans-serif; font-weight:bold;">{{ $order['customer']['fullName'] }}</p>

                        <p style="-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;font-family: Helvetica, Arial, sans-serif;">
                            {{ $order['address'] }}<br>
                            {{ $order['city'] }}, {{ ($order['state'] != '-- Out of US') ? $order['state'] : '' }} {{ $order['zip'] }}<br>
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
                                                    <img class="product-image" style="width:200px;height:auto;vertical-align: bottom;" src="{{ asset($item['product']['emailImage']) }}" >
                                                </div>
                                            </td>
                                            <td class="product-data-cell">
                                                <table class="addons-table" style="float:right;">
                                                    <tr class="product-name-row">
                                                        <!-- Product Name here -->
                                                        @if($item['product']['sizeable'])
                                                            <td><span class="product-name" style="text-transform:uppercase;"><strong>{{ $item['size']['name'] }}</strong></span></td>
                                                        @else

                                                            <td>
                        <span class="product-name" style="text-transform:uppercase;">
							<!-- Don't breake following line in separate lines to avoid spaces between words. -->
                            <strong>{{ $item['product']['shortName'] }}</strong>@if($item['product']['type']['slug'] === 'pole')<span>{{ $item['product']['short_name_extension'] }}</span>@endif
                            @if ($item['product']['include_length_on_email'])
                                <small>{{ $item['product']['length'] }}</small>
                            @endif
                        </span>
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
                                                            <td>
                                                                <span class="bold">{{ $addon['product']['name'] }}</span>
                                                                @if ($addon['product']['include_length_on_email'])
                                                                    <small>{{ $addon['product']['length'] }}</small>
                                                                @endif
                                                            </td>

                                                            @if($addon['product']['sizeable'])
                                                                <td>${{ ($addon['price_zero'] == 0) ? $addon['size']['price'] / 100 : 0}}</td>
                                                            @else
                                                                <td>${{ ($addon['price_zero'] == 0) ? $addon['product']['price'] / 100 : 0}}</td>
                                                            @endif

                                                            <td><span class="product-quantity @if($addon['quantity'] > 1) multiple @endif">{{ $addon['quantity'] }}</span></td>

                                                            @if($addon['product']['sizeable'])
                                                                <td><span class="product-final-price">${{ ($addon['price_zero'] == 0) ? ($addon['size']['price'] * $addon['quantity']) / 100 : 0}}</span></td>
                                                            @else
                                                                <td><span class="product-final-price">${{ ($addon['price_zero'] == 0) ? ($addon['product']['price'] * $addon['quantity']) / 100 : 0}}</span></td>
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
                            <span style="font-weight:normal">Subtotal: ${{ number_format($subtotal / 100, 2) }}</span><br>

                            @if($order->discount_percentage != 0)
                                <span style="font-weight:normal">Discount: <span style="color:#2ECC71;">- ${{ number_format(( ($subtotal / 100) * ($order->discount_percentage / 100) ) / 100, 2) }}</span></span><br>
                            @endif

                            <span style="font-weight:normal">Shipping: ${{ number_format($shipping / 100, 2) }}</span><br>

                            <span style="font-weight:normal">Sales tax: ${{ number_format($taxAmount / 100, 2) }}</span><br>
                            Total : ${{ number_format($total / 100, 2) }}
                        </p>

                    </td>

                </tr>
                </tbody>
                <tfoot>

                <tr id="totals" style="font-family: 'Helvetica', Arial, sans-serif;font-size: 12px;color: #D1D1D1;border-top: 1px solid black;height: 50px;">
                    <td colspan="2"
                        align="right"
                        style="	mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                -ms-text-size-adjust: 100%;
                                -webkit-text-size-adjust: 100%;
                                font-family: Helvetica, Arial, sans-serif;
                                color:{{ $emailSettings['email_footer_color'] }};">
                        Thank you for your purchase.
                    </td>
                </tr>

                <tr>
                    <td colspan="2">
                        <table style="margin-bottom:30px; width: 100%;">

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
                                    <p style="font-size:50px;font-weight:bold;letter-spacing:-1px;-webkit-margin-before: 0em;-webkit-margin-after: 0em;color: {{ $emailSettings['email_footer_color'] }};">InshoreShrinker - $49</p>
                                    <p>Buying an <span style="font-weight:bold">EIGHT</span>&apos;ER, <span style="font-weight:bold">NINE</span>&apos;ER, or <span style="font-weight:bold">TEN</span>&apos;ER? Purchasing an InshoreShrinkerâ¢ will allow
                                        you to shrink your ordered pole nearly two feet on the <span style="font-weight:bold">EIGHT</span>&apos;ER and almost two and a half
                                        feet on the <span style="font-weight:bold">NINE</span>&apos;ER &amp; <span style="font-weight:bold">TEN</span>&apos;ER! It&apos;s like you&apos;re getting 2 poles with your purchase for only $49 more.
                                    </p>
                                    <p style="padding-bottom:40px"><span style="font-weight:bold">Add to your existing order now &amp; it SHIPS for FREE!</span> Simply reply to this email 'Add InshoreShrinker' and we&apos;ll take care of the rest.</p>

                                </td>
                            </tr>
                            @endif --}}

                            <tr id="thefooter" style="border-top:solid black 1px; border-bottom:solid black 1px;">
                                <td style="	color: {{ $emailSettings['email_footer_color'] }};
                                        font-size:16px;
                                        padding:15px 0;"
                                    colspan="1">Customer Service - Email: {{ $emailSettings['contact_email_address_displayed_in_email'] }} / Phone: {{ $emailSettings['contact_phone_number_displayed_in_email'] }}</td>

                                <!-- INSERT SOCIAL MEDIA IMAGES -->
                                <td style="text-align:right;" colspan="1">

                                    &nbsp;&nbsp;&nbsp;&nbsp;

                                    <!-- Facebook -->
                                    @if ($homeSetting['facebook_url'])
                                        <a style="color: {{ $emailSettings['email_footer_color'] }}; font-size: 1.5em; margin-right: 10px;" href="{{ $homeSetting['facebook_url'] }}">
                                            <i class="fa fa-facebook-official"></i>
                                        </a>
                                    @endif

                                <!-- Twitter -->
                                    @if ($homeSetting['twitter_url'])
                                        <a style="color: {{ $emailSettings['email_footer_color'] }}; font-size: 1.5em; margin-right: 10px;" href="{{ $homeSetting['twitter_url'] }}">
                                            <i class="fa fa-twitter"></i>
                                        </a>
                                    @endif

                                <!-- Instagram -->
                                    @if ($homeSetting['instagram_url'])
                                        <a style="color: {{ $emailSettings['email_footer_color'] }}; font-size: 1.5em; margin-right: 10px;" href="{{ $homeSetting['instagram_url'] }}">
                                            <i class="fa fa-instagram"></i>
                                        </a>
                                    @endif

                                    <a href="{{ $homeSetting['hostname'] }}">
                                        <img style="margin-left:0px;"
                                             src="{{ asset($emailSettings['email_small_logo_url']) }}">

                                    </a>
                                </td>
                                <!-- INSERT SOCIAL MEDIA END -->

                            </tr>
                        </table>
                    </td>
                </tr>
                </tfoot>
            </table>
        </td>
    </tr>
</table>
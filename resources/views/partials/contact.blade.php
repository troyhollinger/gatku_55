
<div class="contact-section">
	<div class="contact-top"
		 style="background-image: url('{!! $homeSetting['contact_image'] !!}');
				background-repeat: no-repeat;
				background-position: center top;
				">
		<div class="home-container">
			<h2 class="contact-headline">{!! $homeSetting['contact_title'] !!}</h2>
			<p class="contact-sub-headline">{!! $homeSetting['contact_message'] !!}</p>
		</div>
	</div>
</div>

<div class="hear-good-stuff" ng-controller="HearGoodStuffController" id="contact">
	<div style="display: table; margin: 0 auto;">
		<form name="hearGoodStuffForm">
			<div>
				<div style="float: left;">
					<b class="hear-good-stuff-caption">HEAR GOOD STUFF :&nbsp;</b>
					<input  type="email"
							style="padding-left: 5px;"
							ng-model="email_address"
							placeholder="Your Email Address..."
							required>
				</div>

				<div class="hear-good-stuff-button-div-class">
					<button class="button-no-frame" ng-show="hearGoodStuffForm.$valid" ng-click="addEmailToMailingList();"><b>Submit</b></button>
				</div>
			</div>
		</form>
	</div>
</div>

<div class="bottom-footer-address-mobile">
	@include('partials.mobile-footer')
</div>

<div class="bottom-footer-address-desktop">
	@include('partials.desktop-footer')
</div>
<div class="contact-section">
	<div class="contact-top">
		<div class="home-container">
			<h2 class="contact-headline">Thank You for Visiting!</h2>
			<p class="contact-sub-headline">We hope you enjoyed your virtual shopping experience. Please let us know if we can help you with anything else. </p>
		</div>
	</div>
</div>

<div class="hear-good-stuff" ng-controller="HearGoodStuffController" id="contact"cin>
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
	@include('partials/desktop-footer')
</div>
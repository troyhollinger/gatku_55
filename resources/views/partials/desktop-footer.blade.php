<div class="desktop-footer-500">

    <div class="domain-footer-divider-1"></div>

    <div style="overflow: auto;">
        <div class="forty-percent-left-flow">
            <div class="desktop-footer-divider">
                @include('partials.us-address-with-map')

                @include('partials.australian-address-with-map')

                @include('partials.email-and-phone')
            </div>
        </div>

        <div class="desktop-logo-footer" style="background-image: url('{!! $homeSetting['contact_desktop_logo_url'] !!}')"></div>
    </div>

</div>


<div class="domain-footer-divider"></div>

<div class="desktop-last-footer-element-wrapper">
    <div style="width: 100%;">
        <div class="forty-percent-left-flow">
            <div style="float: right;">
                <div style="height: 10px;"></div>
                <div class="width-400-class">
                    <img class="footer-label-class" src="{!! $homeSetting['footer_banner_url'] !!}">
                </div>
            </div>
        </div>

        <div class="social-media-sixty-percent">
            <div class="social-media-wrapper">
                @include('partials.social-media-footer')
                @include('partials.desktop-copyright-footer')
            </div>
            <div class="div-ten-percent-separator"></div>
        </div>
    </div>
</div>


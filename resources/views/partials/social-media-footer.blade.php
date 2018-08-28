
<div class="social-media-icons" ng-controller="SocialMediaFooterController">

    <a href="{!! $homeSetting['facebook_url'] !!}"
       target="_blank"
       ng-show="'{{ $homeSetting['facebook_url'] }}'">
        <i class="fa fa-facebook-official"></i>
    </a>
    &nbsp;
    <a href="{!! $homeSetting['twitter_url'] !!}"
       target="_blank"
       ng-show="'{{ $homeSetting['twitter_url'] }}'">
        <i class="fa fa-twitter"></i>
    </a>
    &nbsp;
    <a href="{!! $homeSetting['instagram_url'] !!}"
       target="_blank"
       ng-show="'{{ $homeSetting['instagram_url'] }}'">
        <i class="fa fa-instagram"></i>
    </a>
    &nbsp;
    <a href="{!! $homeSetting['youtube_url'] !!}"
       target="_blank"
       ng-show="'{{ $homeSetting['youtube_url'] }}'">
        <i class="fa fa-youtube-play"></i>
    </a>
</div>

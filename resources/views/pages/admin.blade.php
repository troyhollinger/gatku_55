@extends('layouts.master')

@section('title')
	Admin
@stop

<div class="admin-container-new"  ng-controller="AdminMainController">

    <ul class="nav nav-tabs">
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#orders">
                <i class="fa fa-shopping-cart"></i>
                &nbsp;Orders
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#products">
                <i class="fa fa-dropbox"></i>
                &nbsp;Products
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#discounts">
                <i class="fa fa-usd"></i>
                &nbsp;Discounts
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#you">
                <i class="fa fa-user"></i>
                &nbsp;You
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#home-settings">
                <i class="fa fa-cogs"></i>
                &nbsp;Home Settings
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#" ng-click="adminLogout()">
                <i class="fa fa-times"></i>
                &nbsp;Logout
            </a>
        </li>
    </ul>

    <br>

	<div ng-view></div>

</div>

@extends('layouts.master')

@section('title')
	Admin
@stop

<div class="admin-container-new" ng-controller="AdminMainController" ng-cloak>

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
            <a class="nav-link" data-toggle="tab" href="#shelves">
                <i class="fa fa-bars"></i>
                &nbsp;Shelves
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#discounts">
                <i class="fa fa-usd"></i>
                &nbsp;Discounts
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#images">
                <i class="fa fa-picture-o"></i>
                &nbsp;Images
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#home-settings">
                <i class="fa fa-cogs"></i>
                &nbsp;Home Settings
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link" data-toggle="tab" href="#integration">
                <i class="fa fa-link"></i>
                &nbsp;Integration
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

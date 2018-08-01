(function () {
    app.controller('AdminImagesController', AdminImagesController);

    function AdminImagesController($scope, YouImage, Image, Product, $exceptionHandler) {

        var $ctrl = this;

        $ctrl.youImages = [];
        $ctrl.products = [];
        $ctrl.newYouImage = {};

        function getYouImages() {
            YouImage.all().then(function (response) {
                $ctrl.youImages = response.data;
                Squares.init();
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log("There was an error getting the You images");
            });
        }

        function getAllProducts() {
            Product.all().then(function(response) {
                $ctrl.products = response.data;
            }, function(error) {
                $exceptionHandler(JSON.stringify(error));
                console.log("Sorry, there was an error retrieving the products");
            });
        }

        $ctrl.uploadYouImage = function ($files) {
            var file = $files[0];

            if (!file) return false;

            var data = {
                url: '/you-image/upload',
                file: file
            };

            $ctrl.editState = true;

            Image.upload(data).then(function (response) {
                $ctrl.newYouImage.image = response.data;
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log('Something went wrong.');
            });
        };

        $ctrl.saveYouImage = function () {
            var nanobar = new Nanobar({bg: '#fff'});
            nanobar.go(40);

            YouImage.save($ctrl.newYouImage).then(function () {
                getYouImages();
                $ctrl.reset();
                nanobar.go(100);
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log('Something went wrong.');
            });
        };

        $ctrl.clearNewYouImage = function () {
            $ctrl.newYouImage = false;
        };

        $ctrl.reset = function() {
            $ctrl.newProduct = {};
            $ctrl.newYouImage = {};
            $ctrl.editState = false;
            $ctrl.editingNew = true;

        };

        getYouImages();
        getAllProducts();
    }
}());






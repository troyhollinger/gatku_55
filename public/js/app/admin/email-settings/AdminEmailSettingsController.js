(function () {
    app.controller('AdminEmailSettingsController', AdminEmailSettingsController);

    function AdminEmailSettingsController($scope, Image, EmailSetting, AlertService, $exceptionHandler) {

        var $ctrl = this;
        
        $ctrl.emailSettings = {};
        $ctrl.editState = false;
        $ctrl.editingNew = true;

        $ctrl.submitButton = 'Submit';

        // $ctrl.upload = function ($files, model) {
        //     var nanobar = new Nanobar({bg: '#fff'});
        //     var file = $files[0];
        //
        //     if (!file) return false;
        //
        //     var data = {
        //         url: '/product/image',
        //         file: file
        //     };
        //
        //     nanobar.go(40);
        //
        //     Image.upload(data).progress(function (evt) {
        //         var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        //     }).then(function (response) {
        //         $ctrl.newProduct[model] = response.data;
        //         nanobar.go(100);
        //     }, function (error) {
        //         $exceptionHandler(JSON.stringify(error));
        //         nanobar.go(100);
        //     });
        // };

        // email settings
        function getEmailSettings() {
            EmailSetting.all().then(function (response) {
                $ctrl.emailSettings = response.data.original ? response.data.original : {};
                Squares.init();
            }, function (error) {
                $exceptionHandler(JSON.stringify(error));
                console.log("There was an error getting the Email Settings");
            });
        }

        $ctrl.removeImage = function(variable) {
            var r = confirm('Do you want to remove image?');

            if (r) {
                 $ctrl.emailSettings[variable] = '';
            }
        };

        $ctrl.uploadEmailImage = function ($files, model) {
            var file = $files[0];

            if (!file) return false;

            var data = {
                url: '/email-image/upload',
                file: file
            };

            $ctrl.editState = true;

            Image.upload(data).then(function (response) {
console.log(model);
                $ctrl.emailSettings[model] = response.data;
            }, function(error) {
                $exceptionHandler(JSON.stringify(error));
                AlertService.broadcast('Sorry, there was an error, please try again', 'error');
            });

        };

        $ctrl.saveEmailSetting = function () {
            var nanobar = new Nanobar({bg: '#fff'});
            nanobar.go(40);

            EmailSetting.save($ctrl.emailSettings).then(function () {
                getEmailSettings();
                AlertService.broadcast('Photo was successfully updated.', 'success');
                nanobar.go(100);
            }, function(error) {
                $exceptionHandler(JSON.stringify(error));
                console.log('Something went wrong.');
            });
        };

        getEmailSettings();
    }
}());

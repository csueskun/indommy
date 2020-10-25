var app = angular.module("myApp", ["ngRoute"]);

app.config(routes);
app.factory('apiInterface', ApiInterface);
app.factory('snackbar', SnackBar);
app.factory('userInterface', User);

app.directive('demoFileModel', fileUploadDirective);

app.service('fileUploadService', function ($http, $q) {

    this.uploadFileToUrl = function (fileFormData, uploadUrl) {
        //FormData, object of key/value pair for form fields and values
        // var fileFormData = new FormData();
        // fileFormData.append('file', file);

        var deffered = $q.defer();
        $http.post(uploadUrl, fileFormData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}

        }).then(function (response) {
            deffered.resolve(response);
        });

        return deffered.promise;
    }
});

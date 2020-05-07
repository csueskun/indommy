var app = angular.module("myApp", ["ngRoute"]);

app.config(routes);
app.factory('apiInterface', ApiInterface);
app.factory('snackbar', SnackBar);

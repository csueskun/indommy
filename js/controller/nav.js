app.controller('navController', function($scope, apiInterface, snackbar, userInterface, $timeout, $routeParams) {
  $scope.user = {};
  
  loadUser();

  function loadUser(){
    $scope.logging = true;
    $timeout(() => {
      $scope.user = userInterface.getUser();
      $scope.logging = false;
    }, 1000);
  }

  $scope.logout = ()=>{
    $scope.logging = true;
    $timeout(() => {
      userInterface.logout();
      $scope.user = {};
      $scope.logging = false;
      window.location.href = '/#!/login';
    }, 1000);
  }

  $scope.goHome = function(){
    sessionStorage.setItem('empresa', "{}");
    window.location.href = '/';
  }

  
});
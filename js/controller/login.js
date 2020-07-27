app.controller('loginController', function($scope, apiInterface, snackbar, userInterface, $timeout) {
  // $('#main-nav').remove();
  // $('footer').remove();
  $scope.loginData = {};
  $scope.errorData = {};
  
  if(userInterface.auth()){
    $scope.user = userInterface.getUser();
  }
  else{
    $scope.user = {};
  }

  $scope.login = ()=>{
    $scope.errorData = {};
    $scope.loggingIn = true;
    let successCallback = data=>{
      if(data.status == 200){
        userInterface.login(data.data.user);
        $scope.errorData.success = true;
        $scope.loggingIn = false;
        $timeout(() => {
          window.location.href = '/';
        }, 1500);
      }
    }
    let errorCallback = error => {
      console.error(error);
      if(error.status == 401){
        $scope.errorData.error = error.data.msg;
      }
      $scope.loggingIn = false;
    }
    apiInterface.post('login', $scope.loginData, {}, successCallback, errorCallback);
  }

  $scope.save = function(){
    $scope.saving = true;
    let success = response => {
      $scope.saving = false;
      if(response.status == 200){
        $scope.saving = true;
        snackbar.green('Usuario registrado.');
        $scope.form.$setPristine();
        $timeout(() => {
          window.location.href = '/#!/login';
        }, 1500);
      }
    }
    let error = response=>{
      $scope.saving = false;
      if(response.status == 422) {
        $scope.formErrors = response.data;
        // updateFormValidation();
      }
      else{
        snackbar.red('Se presentó un error al guardar.');
      }
      $scope.saving = false;
    };
    if($scope.user.id){
      
    }
    else{
      apiInterface.post('usuario', $scope.user, {}, success, error);
    }
  }
  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
      $scope.form[k].$setPristine();
      
    })
  }
});
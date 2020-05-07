app.controller('claseController', function($scope, apiInterface, snackbar) {
  $scope.claseList = [];
  const apiName = 'clase';

  loadClase();

  function loadClase(){
    $scope.loadingClase = true;
    let success = data=>{
      if(data.status == 200){
        $scope.claseList = data.data.data;
        $scope.loadingClase = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingClase = false;
    };
    apiInterface.get(apiName, {}, success, error);
  }

  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(clase, event, index){
    $scope.claseIndex = index;
    $scope.clase = Object.assign({}, clase);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.claseList.splice($scope.claseIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.clase.id, {}, success, error);
  }

  $scope.prepareForm = function(clase={}, editable=true, index){
    $scope.claseIndex = index;
    $scope.editable = editable;
    $scope.clase = Object.assign({}, clase);
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.clase.id){
        $scope.editable = false;
      }
      else{
        $scope.clase = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadClase();
    };
    let error = error=>{
      snackbar.red('Se presentó un error al guardar.');
      console.log(error);
      if(error.status == 422) {
        $scope.formErrors = error.data;
        updateFormValidation();
      }
      $scope.saving = false;
    };
    $scope.saving = true;
    if($scope.clase.id){
      apiInterface.put(apiName+'/'+$scope.clase.id, $scope.clase, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.clase, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }
});
app.controller('ciudadController', function($scope, apiInterface, snackbar) {
  $scope.ciudadList = [];
  const apiName = 'ciudad';

  $scope.estados = [
    {des: 'Inactivo', val: 0},
    {des: 'Activo', val: 1}
  ]

  loadCiudad();

  function loadCiudad(){
    $scope.loadingCiudad = true;
    let success = data=>{
      if(data.status == 200){
        $scope.ciudadList = data.data.data;
        $scope.loadingCiudad = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingCiudad = false;
    };
    apiInterface.get(apiName, {}, success, error);
  }

  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(ciudad, event, index){
    $scope.ciudadIndex = index;
    $scope.ciudad = Object.assign({}, ciudad);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.ciudadList.splice($scope.ciudadIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.ciudad.id, {}, success, error);
  }

  $scope.prepareForm = function(ciudad={}, editable=true, index){
    $scope.ciudadIndex = index;
    $scope.editable = editable;
    $scope.ciudad = Object.assign({}, ciudad);
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.ciudad.id){
        $scope.editable = false;
      }
      else{
        $scope.ciudad = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadCiudad();
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
    if($scope.ciudad.id){
      apiInterface.put(apiName+'/'+$scope.ciudad.id, $scope.ciudad, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.ciudad, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }
});
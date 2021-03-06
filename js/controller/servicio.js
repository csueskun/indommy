app.controller('servicioController', function($scope, apiInterface, snackbar) {
  $scope.servicioList = [];
  const apiName = 'servicio';

  $scope.estados = [
    {des: 'Inactivo', val: 0},
    {des: 'Activo', val: 1}
    
  ]

  $scope.prioridades = [
    {des: '1', val: 1},
    {des: '2', val: 2},
    {des: '3', val: 3},
    {des: '4', val: 4},
    {des: '5', val: 5},
    {des: '6', val: 6},
    {des: '7', val: 7},
    {des: '8', val: 8},
    {des: '9', val: 9},
    {des: '10', val: 10}
  ]
  
  loadServicio();

  function loadServicio(){
    $scope.loadingServicio = true;
    let success = data=>{
      if(data.status == 200){
        $scope.servicioList = data.data.data;
        $scope.loadingServicio = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingServicio = false;
    };
    apiInterface.get(apiName, {}, success, error);
  }

  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(servicio, event, index){
    $scope.servicioIndex = index;
    $scope.servicio = Object.assign({}, servicio);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.servicioList.splice($scope.servicioIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.servicio.id, {}, success, error);
  }

  $scope.prepareForm = function(servicio={}, editable=true, index){
    $scope.servicioIndex = index;
    $scope.editable = editable;
    $scope.servicio = Object.assign({}, servicio);
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.servicio.id){
        $scope.editable = false;
      }
      else{
        $scope.servicio = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadServicio();
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
    if($scope.servicio.id){
      apiInterface.put(apiName+'/'+$scope.servicio.id, $scope.servicio, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.servicio, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }

});
app.controller('eventoController', function($scope, apiInterface, snackbar) {
  $scope.eventoList = [];
  $scope.empresaList = [];

  const apiName = 'evento';

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

  loadEvento();
  loadEmpresas();


  function loadEvento(){
    $scope.loadingEvento = true;
    let success = data=>{
      if(data.status == 200){
        $scope.eventoList = data.data.data;
        $scope.loadingEvento = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingEvento = false;
    };
    apiInterface.get(apiName, {}, success, error);
  }

  function loadEmpresas(){
    $scope.loadingEvento = true;
    let success = data=>{
      if(data.status == 200){
        $scope.empresaList = data.data.data;
        $scope.loadingEvento = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingEvento = false;
    };
    apiInterface.get('empresa', {}, success, error);
  }


  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(evento, event, index){
    $scope.eventoIndex = index;
    $scope.evento = Object.assign({}, evento);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.eventoList.splice($scope.eventoIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.evento.id, {}, success, error);
  }

  $scope.prepareForm = function(evento={}, editable=true, index){
    $scope.eventoIndex = index;
    $scope.editable = editable;
    $scope.evento = Object.assign({}, evento);
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.evento.id){
        $scope.editable = false;
      }
      else{
        $scope.evento = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadEvento();
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
    if($scope.evento.id){
      apiInterface.put(apiName+'/'+$scope.evento.id, $scope.evento, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.evento, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }
});
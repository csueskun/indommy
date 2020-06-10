app.controller('grupoempresaController', function($scope, apiInterface, snackbar) {
  $scope.grupoempresaList = [];
  $scope.empresaList = [];
  $scope.grupoList = [];

  const apiName = 'grupoempresa';
  
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

  loadEmpresa();
  loadGrupo();
  loadGrupoEmpresa();

  function loadGrupoEmpresa(){
    $scope.loadingGrupoEmpresa = true;
    let success = data=>{
      if(data.status == 200){
        $scope.grupoempresaList = data.data.data;
        $scope.loadingGrupoEmpresa = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingGrupoEmpresa = false;
    };
    apiInterface.get(apiName, {}, success, error);
  }
  
  function loadGrupo(){
    $scope.loadingGrupoEmpresa = true;
    let success = data=>{
      if(data.status == 200){
        $scope.grupoList = data.data.data;
        $scope.loadingGrupoEmpresa = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingGrupoEmpresa = false;
    };
    apiInterface.get('grupo', {}, success, error);
  }

  function loadEmpresa(){
    $scope.loadingGrupoEmpresa = true;
    let success = data=>{
      if(data.status == 200){
        $scope.empresaList = data.data.data;
        $scope.loadingGrupoEmpresa = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingGrupoEmpresa = false;
    };
    apiInterface.get('empresa', {}, success, error);
  }

  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(grupoempresa, event, index){
    $scope.grupoempresaIndex = index;
    $scope.grupoempresa = Object.assign({}, grupoempresa);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.grupoempresaList.splice($scope.grupoempresaIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.grupoempresa.id, {}, success, error);
  }

  $scope.prepareForm = function(grupoempresa={}, editable=true, index){
    $scope.grupoempresaIndex = index;
    $scope.editable = editable;
    $scope.grupoempresa = Object.assign({}, grupoempresa);
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.grupoempresa.id){
        $scope.editable = false;
      }
      else{
        $scope.grupoempresa = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadGrupoEmpresa();
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
    if($scope.grupoempresa.id){
      apiInterface.put(apiName+'/'+$scope.grupoempresa.id, $scope.grupoempresa, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.grupoempresa, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }
});
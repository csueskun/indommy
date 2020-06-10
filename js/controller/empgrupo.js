app.controller('empgrupoController', function($scope, apiInterface, snackbar) {
  $scope.empgrupoList = [];
  $scope.empresaList = [];
  $scope.grupoList = [];

  const apiName = 'empgrupo';
  
  $scope.estados = [
    {des: 'Inactivo', val: 0},
    {des: 'Activo', val: 1}
  ]

  loadEmpresa();
  loadGrupo();
  loadEmpGrupo();

  function loadEmpGrupo(){
    $scope.loadingEmpGrupos = true;
    let success = data=>{
      if(data.status == 200){
        $scope.empgrupoList = data.data.data;
        $scope.loadingEmpGrupos = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingEmpGrupos = false;
    };
    apiInterface.get(apiName, {}, success, error);
  }
  
  function loadGrupo(){
    $scope.loadingEmpGrupos = true;
    let success = data=>{
      if(data.status == 200){
        $scope.grupoList = data.data.data;
        $scope.loadingEmpGrupos = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingEmpGrupos = false;
    };
    apiInterface.get('grupo', {}, success, error);
  }

  function loadGrupo(){
    $scope.loadingEmpGrupos = true;
    let success = data=>{
      if(data.status == 200){
        $scope.empresaList = data.data.data;
        $scope.loadingEmpGrupos = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingEmpGrupos = false;
    };
    apiInterface.get('empresa', {}, success, error);
  }

  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(grupo, event, index){
    $scope.empgrupoIndex = index;
    $scope.empgrupo = Object.assign({}, grupo);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.empgrupoList.splice($scope.empgrupoIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.empgrupo.id, {}, success, error);
  }

  $scope.prepareForm = function(grupo={}, editable=true, index){
    $scope.empgrupoIndex = index;
    $scope.editable = editable;
    $scope.empgrupo = Object.assign({}, grupo);
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.empgrupo.id){
        $scope.editable = false;
      }
      else{
        $scope.empgrupo = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadEmpGrupo();
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
    if($scope.empgrupo.id){
      apiInterface.put(apiName+'/'+$scope.empgrupo.id, $scope.empgrupo, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.empgrupo, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }
});
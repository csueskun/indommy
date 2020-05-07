app.controller('grupoController', function($scope, apiInterface, snackbar) {
  $scope.grupoList = [];
  $scope.claseList = [];
  const apiName = 'grupo';

  loadClases();
  loadGrupos();

  function loadClases(){
    $scope.loadingGrupos = true;
    let success = data=>{
      if(data.status == 200){
        $scope.claseList = data.data.data;
        $scope.loadingGrupos = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingGrupos = false;
    };
    apiInterface.get('clase', {}, success, error);
  }

  function loadGrupos(){
    $scope.loadingGrupos = true;
    let success = data=>{
      if(data.status == 200){
        $scope.grupoList = data.data.data;
        $scope.loadingGrupos = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingGrupos = false;
    };
    apiInterface.get(apiName, {}, success, error);
  }

  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(grupo, event, index){
    $scope.grupoIndex = index;
    $scope.grupo = Object.assign({}, grupo);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.grupoList.splice($scope.grupoIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.grupo.id, {}, success, error);
  }

  $scope.prepareForm = function(grupo={}, editable=true, index){
    $scope.grupoIndex = index;
    $scope.editable = editable;
    $scope.grupo = Object.assign({}, grupo);
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.grupo.id){
        $scope.editable = false;
      }
      else{
        $scope.grupo = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadGrupos();
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
    if($scope.grupo.id){
      apiInterface.put(apiName+'/'+$scope.grupo.id, $scope.grupo, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.grupo, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }
});
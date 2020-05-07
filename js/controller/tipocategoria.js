app.controller('tipocategoriaController', function($scope, apiInterface, snackbar) {
  $scope.tipocategoriaList = [];
  const apiName = 'tipocategoria';

  loadTipocategoria();

  function loadTipocategoria(){
    $scope.loadingTipocategoria = true;
    let success = data=>{
      if(data.status == 200){
        $scope.tipocategoriaList = data.data.data;
        $scope.loadingTipocategoria = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingTipocategoria = false;
    };
    apiInterface.get(apiName, {}, success, error);
  }

  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(tipocategoria, event, index){
    $scope.tipocategoriaIndex = index;
    $scope.tipocategoria = Object.assign({}, tipocategoria);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.tipocategoriaList.splice($scope.tipocategoriaIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.tipocategoria.id, {}, success, error);
  }

  $scope.prepareForm = function(tipocategoria={}, editable=true, index){
    $scope.tipocategoriaIndex = index;
    $scope.editable = editable;
    $scope.tipocategoria = Object.assign({}, tipocategoria);
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.tipocategoria.id){
        $scope.editable = false;
      }
      else{
        $scope.tipocategoria = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadTipocategoria();
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
    if($scope.tipocategoria.id){
      apiInterface.put(apiName+'/'+$scope.tipocategoria.id, $scope.tipocategoria, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.tipocategoria, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }
});
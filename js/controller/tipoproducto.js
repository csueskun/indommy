app.controller('tipoproductoController', function($scope, apiInterface, snackbar) {
  $scope.tipoproductoList = [];
  const apiName = 'tipoproducto';

  loadTipoproducto();

  function loadTipoproducto(){
    $scope.loadingTipoproducto = true;
    let success = data=>{
      if(data.status == 200){
        $scope.tipoproductoList = data.data.data;
        $scope.loadingTipoproducto = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingTipoproducto = false;
    };
    apiInterface.get(apiName, {}, success, error);
  }

  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(tipoproducto, event, index){
    $scope.tipoproductoIndex = index;
    $scope.tipoproducto = Object.assign({}, tipoproducto);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.tipoproductoList.splice($scope.tipoproductoIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.tipoproducto.id, {}, success, error);
  }

  $scope.prepareForm = function(tipoproducto={}, editable=true, index){
    $scope.tipoproductoIndex = index;
    $scope.editable = editable;
    $scope.tipoproducto = Object.assign({}, tipoproducto);
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.tipoproducto.id){
        $scope.editable = false;
      }
      else{
        $scope.tipoproducto = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadTipoproducto();
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
    if($scope.tipoproducto.id){
      apiInterface.put(apiName+'/'+$scope.tipoproducto.id, $scope.tipoproducto, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.tipoproducto, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }
});
app.controller('ofertaController', function($scope, apiInterface, snackbar) {
  $scope.ofertaList = [];
  const apiName = 'oferta';

  loadOferta();

  function loadOferta(){
    $scope.loadingOferta = true;
    let success = data=>{
      if(data.status == 200){
        $scope.ofertaList = data.data.data;
        $scope.loadingOferta = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingOferta = false;
    };
    apiInterface.get(apiName, {}, success, error);
  }

  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(oferta, event, index){
    $scope.ofertaIndex = index;
    $scope.oferta = Object.assign({}, oferta);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.ofertaList.splice($scope.ofertaIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.oferta.id, {}, success, error);
  }

  $scope.prepareForm = function(oferta={}, editable=true, index){
    $scope.ofertaIndex = index;
    $scope.editable = editable;
    $scope.oferta = Object.assign({}, oferta);
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.oferta.id){
        $scope.editable = false;
      }
      else{
        $scope.oferta = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadOferta();
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
    if($scope.oferta.id){
      apiInterface.put(apiName+'/'+$scope.oferta.id, $scope.oferta, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.oferta, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
	console.log($scope.formErrors);
  }
});
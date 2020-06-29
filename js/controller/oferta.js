app.controller('ofertaController', function($scope, apiInterface, snackbar) {
  $scope.ofertaList = [];
  $scope.empresaList = [];

  const apiName = 'oferta';

  $scope.tiposoferta = [
    {des: '2x1', val: 0},
    {des: '3x2', val: 1},
    {des: 'Promoción día de la Madre', val: 2},
    {des: 'Promoción día del Padre', val: 3},
    {des: 'Viernes Negro', val: 4},
    {des: 'Navidad', val: 5}
  ]

  
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

  loadOferta();
  loadEmpresas();

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

  function loadEmpresas(){
    $scope.loadingOferta = true;
    let success = data=>{
      if(data.status == 200){
        $scope.empresaList = data.data.data;
        $scope.loadingOferta = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingOferta = false;
    };
    apiInterface.get('empresa', {}, success, error);
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
    if($scope.oferta.fechaini){
      $('#fechainiPicker>input').val($scope.oferta.fechaini);
      $scope.oferta._fechaini = formatDateFromIso($scope.oferta.fechaini);
    }
    if($scope.oferta.fechafin){
      $('#fechafinPicker>input').val($scope.oferta.fechafin);
      $scope.oferta._fechafin = formatDateFromIso($scope.oferta.fechafin);
    }
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

  $scope.updateDateField = function(){
    $scope.oferta.fechaini = $('#fechainiPicker>input').val();
    $scope.oferta._fechaini = $('#_fechaini').val();
    $scope.oferta.fechafin = $('#fechafinPicker>input').val();
    $scope.oferta._fechafin = $('#_fechafin').val();
  }


  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
	console.log($scope.formErrors);
  }
});
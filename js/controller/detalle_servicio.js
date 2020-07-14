app.controller('detalle_servicioController', function($scope, apiInterface, snackbar) {
  $scope.detalle_servicioList = [];
  $scope.empresaList = [];
  $scope.servicioList = [];
  
  $scope.pagination = {per_page: 20};
  $scope.empresaPagination = {per_page: 10};
  $scope.paginationForm = {};


  const apiName = 'detalle_servicio';
  
  $scope.perPageOptions = [
    {des: '10', val: 10},
    {des: '20', val: 20},
    {des: '50', val: 50},
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

  loadDetalle_Servicio();
  loadEmpresa();
  loadServicio();
 
  function loadDetalle_Servicio(){
    $scope.loadingDetalle_Servicio = true;
    let success = data=>{
      console.log(data)
      if(data.status == 200){
        $scope.detalle_servicioList = data.data.data.data;
        $scope.pagination = data.data.data.pagination;
        $scope.loadingDetalle_Servicio = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingDetalle_Servicio = false;
    };
    apiInterface.get('paginated/detalle_servicio', {params: $scope.pagination}, success, error);
  }

  $scope.setPaginationPage = function(page){
    $scope.pagination.current_page = page;
    loadDetalle_Servicio();
  }
  $scope.setPerPage = function(){
    $scope.pagination.current_page = 1;
    loadDetalle_Servicio();
  }
  
  function loadServicio(){
    $scope.loadingDetalle_Servicio = true;
    let success = data=>{
      if(data.status == 200){
        $scope.servicioList = data.data.data;
        $scope.loadingDetalle_Servicio = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingDetalle_Servicio = false;
    };
    apiInterface.get('servicio', {}, success, error);
  }

//modal de empresa
function loadEmpresa(){
  $scope.loadingEmpresaModal = true;
  let success = data=>{
    console.log(data)
    if(data.status == 200){
      $scope.empresaList = data.data.data.data;
      $scope.empresaPagination = data.data.data.pagination;
      $scope.loadingEmpresaModal = false;
    }};
  let error = error=>{
    console.log(error);
    $scope.loadingEmpresaModal = false;
  };
  apiInterface.get('paginated/empresa', {params: $scope.empresaPagination}, success, error);
}

$scope.searchEmpresaFromModal = function(){
  loadEmpresa();
}
$scope.setEmpresaPaginationPage = function(page){
  $scope.empresaPagination.current_page = page;
  loadEmpresa();
}

$scope.elegirEmpresaFromModal = function(id, nombre){
  $("#modalBuscarEmpresa").modal('hide');
  $scope.detalle_servicio.empresa_id = id;
  $scope.detalle_servicio._empresa_id = nombre;
}
//fin de modal de empresa
  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(detalle_servicio, event, index){
    $scope.detalle_servicioIndex = index;
    $scope.detalle_servicio = Object.assign({}, detalle_servicio);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.detalle_servicioList.splice($scope.detalle_servicioIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.detalle_servicio.id, {}, success, error);
  }

  $scope.prepareForm = function(detalle_servicio={}, editable=true, index){
    $scope.detalle_servicioIndex = index;
    $scope.editable = editable;
    $scope.detalle_servicio = Object.assign({}, detalle_servicio);
    if($scope.detalle_servicio.empresa){
      $scope.detalle_servicio._empresa_id = $scope.detalle_servicio.empresa.nombre;
    }
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.detalle_servicio.id){
        $scope.editable = false;
      }
      else{
        $scope.detalle_servicio = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadDetalle_Servicio();
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
    if($scope.detalle_servicio.id){
      apiInterface.put(apiName+'/'+$scope.detalle_servicio.id, $scope.detalle_servicio, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.detalle_servicio, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }
});
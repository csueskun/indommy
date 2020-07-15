app.controller('atencionController', function($scope, apiInterface, snackbar) {
  $scope.atencionList = [];
  $scope.empresaList = [];

  const apiName = 'atencion';

  $scope.perPageOptions = [
    {des: '10', val: 10},
    {des: '20', val: 20},
    {des: '50', val: 50},
  ]

  $scope.pagination = {per_page: 20};
  $scope.empresaPagination = {per_page: 10};
  $scope.paginationForm = {};

  $scope.estados = [
    {des: 'Inactivo', val: 0},
    {des: 'Activo', val: 1}   
  ]

  loadAtencion();
  loadEmpresas();

  function loadAtencion(){
    $scope.loadingAtencion = true;
    let success = data=>{
      if(data.status == 200){
        $scope.atencionList = data.data.data;
        $scope.loadingAtencion = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingAtencion = false;
    };
    apiInterface.get(apiName, {}, success, error);
  }

  //paginacion
  $scope.setPaginationPage = function(page){
    $scope.pagination.current_page = page;
    loadAtencion();
  }
  $scope.setPerPage = function(){
    $scope.pagination.current_page = 1;
    loadAtencion();
  }

  function loadEmpresas(){
    $scope.loadingAtencion = true;
    let success = data=>{
      if(data.status == 200){
        $scope.empresaList = data.data.data.data;
        $scope.empresaPagination = data.data.data.pagination;
        $scope.loadingAtencion = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingAtencion = false;
    };
    apiInterface.get('paginated/empresa', {params: $scope.empresaPagination}, success, error);
  }

  $scope.searchEmpresaFromModal = function(){
    loadEmpresas();
  }
  $scope.setEmpresaPaginationPage = function(page){
    $scope.empresaPagination.current_page = page;
    loadEmpresas();
  }

  $scope.elegirEmpresaFromModal = function(id, nombre){
    $("#modalBuscarEmpresa").modal('hide');
    $scope.atencion.empresa_id = id;
    $scope.atencion._empresa_id = nombre;
  }
  //fin de modal de empresa


  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(atencion, event, index){
    $scope.atencionIndex = index;
    $scope.atencion = Object.assign({}, atencion);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.atencionList.splice($scope.atencionIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.atencion.id, {}, success, error);
  }

  $scope.prepareForm = function(atencion={}, editable=true, index){
    $scope.atencionIndex = index;
    $scope.editable = editable;
    $scope.atencion = Object.assign({}, atencion);
    if($scope.atencion.empresa){
      $scope.atencion._empresa_id = $scope.atencion.empresa.nombre;
    }
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.atencion.id){
        $scope.editable = false;
      }
      else{
        $scope.atencion = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadAtencion();
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
    if($scope.atencion.id){
      apiInterface.put(apiName+'/'+$scope.atencion.id, $scope.atencion, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.atencion, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }

  $scope.searchEmpresas = function(){
    loadEmpresas();
  }
});
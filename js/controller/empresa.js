app.controller('empresaController', function($scope, apiInterface, snackbar) {
  $scope.empresaList = [];
  $scope.ciudadList = [];
  $scope.pagination = {per_page: 12};
  $scope.paginationForm = {};

  const apiName = 'empresa';
  
  $scope.perPageOptions = [
    {des: '6', val: 6},
    {des: '12', val: 12},
    {des: '24', val: 24},
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

  loadCiudades();
  loadEmpresas();

  function loadEmpresas(){
    $scope.loadingEmpresas = true;
    let success = data=>{
      if(data.status == 200){
        $scope.empresaList = data.data.data.data;
        $scope.pagination = data.data.data.pagination;
        $scope.loadingEmpresas = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingEmpresas = false;
    };
    apiInterface.get('paginated/empresa', {params: $scope.pagination}, success, error);
  }

  $scope.setPaginationPage = function(page){
    $scope.pagination.current_page = page;
    loadEmpresas();
  }
  $scope.setPerPage = function(){
    $scope.pagination.current_page = 1;
    loadEmpresas();
  }

  function loadCiudades(){
    $scope.loadingEmpresas = true;
    let success = data=>{
      if(data.status == 200){
        $scope.ciudadList = data.data.data;
        $scope.loadingEmpresas = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingEmpresas = false;
    };
    apiInterface.get('ciudad', {}, success, error);
  }


  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(empresa, event, index){
    $scope.empresaIndex = index;
    $scope.empresa = Object.assign({}, empresa);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.empresaList.splice($scope.empresaIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.empresa.id, {}, success, error);
  }

  $scope.prepareForm = function(empresa={}, editable=true, index){
    $scope.empresaIndex = index;
    $scope.editable = editable;
    $scope.empresa = Object.assign({}, empresa);
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.empresa.id){
        $scope.editable = false;
      }
      else{
        $scope.empresa = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadEmpresas();
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
    if($scope.empresa.id){
      apiInterface.put(apiName+'/'+$scope.empresa.id, $scope.empresa, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.empresa, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }
});
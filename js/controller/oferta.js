app.controller('ofertaController', function($scope, apiInterface, snackbar, fileUploadService, $timeout) {
  $scope.ofertaList = [];
  $scope.empresaList = [];

  $scope.pagination = {per_page: 20};
  $scope.empresaPagination = {per_page: 10};
  $scope.paginationForm = {};
  $scope.imgLocation = apiInterface.getImgUrl();
  $scope.cache = new Date().getTime();

  const apiName = 'oferta';

  $scope.perPageOptions = [
    {des: '10', val: 10},
    {des: '20', val: 20},
    {des: '50', val: 50},
  ]

  $scope.tiposoferta = [
    {des: '2x1', val: '0'},
    {des: '3x2', val: '1'},
    {des: 'Promoción día de la Madre', val: '2'},
    {des: 'Promoción día del Padre', val: '3'},
    {des: 'Viernes Negro', val: '4'},
    {des: 'Navidad', val: '5'}
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
  loadEmpresa();

  function loadOferta(){
    $scope.loadingOferta = true;
    let success = data=>{
      if(data.status == 200){
        $scope.ofertaList = data.data.data.data;
        $scope.pagination = data.data.data.pagination;
        $scope.loadingOferta = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingOferta = false;
    };
    apiInterface.get('paginated/oferta', {params: $scope.pagination}, success, error);
  }
  
  //paginacion
  $scope.setPaginationPage = function(page){
    $scope.pagination.current_page = page;
    loadOferta();
  }
  $scope.setPerPage = function(){
    $scope.pagination.current_page = 1;
    loadOferta();
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
    $scope.oferta.empresa_id = id;
    $scope.oferta._empresa_id = nombre;
  }
  //fin de modal de empresa

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
    if($scope.oferta.empresa){
      $scope.oferta._empresa_id = $scope.oferta.empresa.nombre;
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
  }
  
  //console.log($scope.formErrors);
  
  $scope.searchEmpresas = function(){
    loadOferta();
  }

  $scope.prepareImages = function(oferta={}){
    $scope.oferta = oferta;
    $("#modalArchivos").modal('show');
  }

  $scope.uploadFile = function (ofertaId, property) {
    $scope.saving = true;
    var file = $scope.myFile;
    var fileFormData = new FormData();
    fileFormData.append('file', file);
    fileFormData.append('property', property);
    fileFormData.append('location',  'img/promociones');
    fileFormData.append('id', ofertaId);
    var uploadUrl = apiInterface.getApiUrl()+"upload/oferta?api_token="+apiInterface.getApiToken(), //Url of webservice/api/server
        promise = fileUploadService.uploadFileToUrl(fileFormData, uploadUrl);

    promise.then(function (response) {
        if(response.status == 200){
          $scope.oferta[response.data.property] = response.data.saved;
          $scope.cache = new Date().getTime();
          $timeout(() => {
            $scope.saving = false;
          }, 1000);
        }
        else{
          $scope.saving = false;
        }
      }, function () {
        $scope.serverResponse = 'An error has occurred';
        $scope.saving = false;
    })
  };
  
});
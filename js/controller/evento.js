app.controller('eventoController', function($scope, apiInterface, snackbar, fileUploadService, $timeout) {
  $scope.eventoList = [];
  $scope.empresaList = [];

  $scope.pagination = {per_page: 20};
  $scope.empresaPagination = {per_page: 10};
  $scope.paginationForm = {};
  $scope.imgLocation = apiInterface.getImgUrl();
  $scope.cache = new Date().getTime();


  const apiName = 'evento';

  $scope.perPageOptions = [
    {des: '10', val: 10},
    {des: '20', val: 20},
    {des: '50', val: 50},
  ]

  $scope.estados = [
    {des: 'Inactivo', val: 0},
    {des: 'Activo'  , val: 1}   
  ]

  $scope.prioridades = [
    {des: '0', val: 0},
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

  loadEvento();
  loadEmpresas();


  function loadEvento(){
    $scope.loadingEvento = true;
    let success = data=>{
      if(data.status == 200){
        $scope.eventoList = data.data.data.data;
        $scope.pagination = data.data.data.pagination;
        $scope.loadingEvento = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingEvento = false;
    };
    apiInterface.get('paginated/evento', {params: $scope.pagination}, success, error);
  }

  //paginacion
  $scope.setPaginationPage = function(page){
    $scope.pagination.current_page = page;
    loadEvento();
  }
  $scope.setPerPage = function(){
    $scope.pagination.current_page = 1;
    loadEvento();
  }

  //modal de empresa
   function loadEmpresas(){
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
    loadEmpresas();
  }
  $scope.setEmpresaPaginationPage = function(page){
    $scope.empresaPagination.current_page = page;
    loadEmpresas();
  }

  $scope.elegirEmpresaFromModal = function(id, nombre){
    $("#modalBuscarEmpresa").modal('hide');
    $scope.evento.empresa_id = id;
    $scope.evento._empresa_id = nombre;
  }
  //fin de modal de empresa



  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(evento, event, index){
    $scope.eventoIndex = index;
    $scope.evento = Object.assign({}, evento);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.eventoList.splice($scope.eventoIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.evento.id, {}, success, error);
  }

  $scope.prepareForm = function(evento={}, editable=true, index){
    $scope.eventoIndex = index;
    $scope.editable = editable;
    $scope.evento = Object.assign({}, evento);
    if($scope.evento.fechaini){
      $('#fechainiPicker>input').val($scope.evento.fechaini);
      $scope.evento._fechaini = formatDateFromIso($scope.evento.fechaini);
    }
    if($scope.evento.fechafin){
      $('#fechafinPicker>input').val($scope.evento.fechafin);
      $scope.evento._fechafin = formatDateFromIso($scope.evento.fechafin);
    }
    if($scope.evento.empresa){
      $scope.evento._empresa_id = $scope.evento.empresa.nombre;
    }
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.evento.id){
        $scope.editable = false;
      }
      else{
        $scope.evento = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadEvento();
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
    if($scope.evento.id){
      apiInterface.put(apiName+'/'+$scope.evento.id, $scope.evento, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.evento, {}, success, error);
    }
  }

  $scope.updateDateField = function(){
    $scope.evento.fechaini = $('#fechainiPicker>input').val();
    $scope.evento._fechaini = $('#_fechaini').val();
    $scope.evento.fechafin = $('#fechafinPicker>input').val();
    $scope.evento._fechafin = $('#_fechafin').val();
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }

  $scope.searchEmpresas = function(){
    loadEvento();
  }

  $scope.prepareImages = function(evento={}){
    $scope.evento = evento;
    $("#modalArchivos").modal('show');
  }

  $scope.uploadFile = function (eventoId, property) {
    $scope.saving = true;
    var file = $scope.myFile;
    var fileFormData = new FormData();
    fileFormData.append('file', file);
    fileFormData.append('property', property);
    fileFormData.append('location',  'img/eventos');
    fileFormData.append('id', eventoId);
    var uploadUrl = apiInterface.getApiUrl()+"upload/evento?api_token="+apiInterface.getApiToken(), //Url of webservice/api/server
        promise = fileUploadService.uploadFileToUrl(fileFormData, uploadUrl);

    promise.then(function (response) {
        if(response.status == 200){
          $scope.evento[response.data.property] = response.data.saved;
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
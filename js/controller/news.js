app.controller('newsController', function($scope, apiInterface, snackbar) {
  $scope.newsList = [];
  $scope.empresaList = [];

  const apiName = 'news';

  $scope.pagination = {per_page: 20};
  $scope.empresaPagination = {per_page: 10};
  $scope.paginationForm = {};

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

  loadNews();
  loadEmpresas();


  function loadNews(){
    $scope.loadingNews = true;
    let success = data=>{
      if(data.status == 200){
        $scope.newsList = data.data.data.data;
        $scope.pagination = data.data.data.pagination;
        $scope.loadingNews = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingNews = false;
    };
    apiInterface.get('paginated/news', {params: $scope.pagination}, success, error);
  }

  //paginacion
  $scope.setPaginationPage = function(page){
    $scope.pagination.current_page = page;
    loadNews();
  }
  $scope.setPerPage = function(){
    $scope.pagination.current_page = 1;
    loadNews();
  }

  //modal de empresa
  function loadEmpresas(){
    $scope.loadingNews = true;
    let success = data=>{
      if(data.status == 200){
        $scope.empresaList = data.data.data.data;
        $scope.empresaPagination = data.data.data.pagination;
        $scope.loadingNews = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingNews = false;
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
    $scope.news.empresa_id = id;
    $scope.news._empresa_id = nombre;
  }
  //fin de modal de empresa

  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(news, event, index){
    $scope.newsIndex = index;
    $scope.news = Object.assign({}, news);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.newsList.splice($scope.newsIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.news.id, {}, success, error);
  }

  $scope.prepareForm = function(news={}, editable=true, index){
    $scope.newsIndex = index;
    $scope.editable = editable;
    $scope.news = Object.assign({}, news);
    if($scope.news.fechaini){
      $('#fechainiPicker>input').val($scope.news.fechaini);
      $scope.news._fechaini = formatDateFromIso($scope.news.fechaini);
    }
    if($scope.news.fechafin){
      $('#fechafinPicker>input').val($scope.news.fechafin);
      $scope.news._fechafin = formatDateFromIso($scope.news.fechafin);
    }
    if($scope.news.empresa){
      $scope.news._empresa_id = $scope.news.empresa.nombre;
    }
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.news.id){
        $scope.editable = false;
      }
      else{
        $scope.news = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadNews();
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
    if($scope.news.id){
      apiInterface.put(apiName+'/'+$scope.news.id, $scope.news, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.news, {}, success, error);
    }
  }

  $scope.updateDateField = function(){
    $scope.news.fechaini = $('#fechainiPicker>input').val();
    $scope.news._fechaini = $('#_fechaini').val();
    $scope.news.fechafin = $('#fechafinPicker>input').val();
    $scope.news._fechafin = $('#_fechafin').val();
  }


  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
    console.log($scope.formErrors);
  }
});
app.controller('newsController', function($scope, apiInterface, snackbar) {
  $scope.newsList = [];
  $scope.empresaList = [];

  const apiName = 'news';

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
        $scope.newsList = data.data.data;
        $scope.loadingNews = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingNews = false;
    };
    apiInterface.get(apiName, {}, success, error);
  }

  function loadEmpresas(){
    $scope.loadingNews = true;
    let success = data=>{
      if(data.status == 200){
        $scope.empresaList = data.data.data;
        $scope.loadingNews = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingNews = false;
    };
    apiInterface.get('empresa', {}, success, error);
  }


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

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }
});
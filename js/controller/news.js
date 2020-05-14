app.controller('newsController', function($scope, apiInterface, snackbar) {
  $scope.newsList = [];
  const apiName = 'news';

  loadNews();

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
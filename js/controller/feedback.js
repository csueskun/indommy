app.controller('feedbackController', function($scope, apiInterface, snackbar) {
  $scope.feedbackList = [];
  $scope.empresaList = [];

  const apiName = 'feedback';

  $scope.estados = [
    {des: 'Inactivo', val: 0},
    {des: 'Activo', val: 1}   
  ]

  loadFeedback();
  loadEmpresas();

  function loadFeedback(){
    $scope.loadingFeedback = true;
    let success = data=>{
      if(data.status == 200){
        $scope.feedbackList = data.data.data;
        $scope.loadingFeedback = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingFeedback = false;
    };
    apiInterface.get(apiName, {}, success, error);
  }

  function loadEmpresas(){
    $scope.loadingFeedback = true;
    let success = data=>{
      if(data.status == 200){
        $scope.empresaList = data.data.data;
        $scope.loadingFeedback = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingFeedback = false;
    };
    apiInterface.get('empresa', {}, success, error);
  }


  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(feedback, event, index){
    $scope.feedbackIndex = index;
    $scope.feedback = Object.assign({}, feedback);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.feedbackList.splice($scope.feedbackIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.feedback.id, {}, success, error);
  }

  $scope.prepareForm = function(feedback={}, editable=true, index){
    $scope.feedbackIndex = index;
    $scope.editable = editable;
    $scope.feedback = Object.assign({}, feedback);
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.feedback.id){
        $scope.editable = false;
      }
      else{
        $scope.feedback = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadFeedback();
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
    if($scope.feedback.id){
      apiInterface.put(apiName+'/'+$scope.feedback.id, $scope.feedback, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.feedback, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }
});
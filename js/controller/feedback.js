app.controller('feedbackController', function($scope, apiInterface, snackbar) {
  $scope.feedbackList = [];
  $scope.empresaList = [];

  const apiName = 'feedback';

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

  loadFeedback();
  loadEmpresas();

  function loadFeedback(){
    $scope.loadingFeedback = true;
    let success = data=>{
      if(data.status == 200){
        $scope.feedbackList = data.data.data.data;
        $scope.pagination = data.data.data.pagination;
        $scope.loadingFeedback = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingFeedback = false;
    };
    apiInterface.get('paginated/feedback', {params: $scope.pagination}, success, error);
  }

   //paginacion
   $scope.setPaginationPage = function(page){
    $scope.pagination.current_page = page;
    loadFeedback();
  }
  $scope.setPerPage = function(){
    $scope.pagination.current_page = 1;
    loadFeedback();
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
    if($scope.feedback.empresa){
      $scope.feedback._empresa_id = $scope.feedback.empresa.nombre;
    }
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

  $scope.searchEmpresas = function(){
    loadFeedback();
  }
});
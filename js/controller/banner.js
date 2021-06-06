app.controller('bannerController', function($scope, apiInterface, snackbar, fileUploadService, $timeout) {
  $scope.bannerList = [];
  $scope.empresaList = [];

  $scope.pagination = {per_page: 20};
  $scope.empresaPagination = {per_page: 10};
  $scope.paginationForm = {};
  $scope.imgLocation = apiInterface.getImgUrl();
  $scope.cache = new Date().getTime();


  const apiName = 'banner';

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

  loadBanners();


  function loadBanners(){
    $scope.loadingBanners = true;
    let success = data=>{
      if(data.status == 200){
        $scope.bannerList = data.data.data.data;
        $scope.bannerList.forEach(function(banner){
          banner.estado_ = banner.estado == 1 ? 'Activo':'Inactivo';
        });
        $scope.pagination = data.data.data.pagination;
        $scope.loadingBanners = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingBanners = false;
    };
    apiInterface.get('paginated/banner', {params: $scope.pagination}, success, error);
  }

  //paginacion
  $scope.setPaginationPage = function(page){
    $scope.pagination.current_page = page;
    loadBanners();
  }
  $scope.setPerPage = function(){
    $scope.pagination.current_page = 1;
    loadBanners();
  }

  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(banner, event, index){
    $scope.bannerIndex = index;
    $scope.banner = Object.assign({}, banner);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.bannerList.splice($scope.bannerIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.banner.id, {}, success, error);
  }

  $scope.prepareForm = function(banner={}, editable=true, index){
    $scope.bannerIndex = index;
    $scope.editable = editable;
    $scope.banner = Object.assign({}, banner);
    if($scope.banner.vence){
      $('#vencePicker>input').val($scope.banner.fechaini);
      $scope.banner._vence = formatDateFromIso($scope.banner.fechaini);
    }
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.banner.id){
        $scope.editable = false;
      }
      else{
        $scope.banner = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadBanners();
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
    if($scope.banner.id){
      apiInterface.put(apiName+'/'+$scope.banner.id, $scope.banner, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.banner, {}, success, error);
    }
  }

  $scope.updateDateField = function(){
    $scope.banner.vence = $('#vencePicker>input').val();
    $scope.banner._vence = $('#_vence').val();
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }

  $scope.prepareImages = function(banner={}){
    $scope.banner = banner;
    $("#modalArchivos").modal('show');
  }

  $scope.searchBanners = function(){
    loadBanners();
  }

  $scope.uploadFile = function (bannerId, property) {
    $scope.saving = true;
    var file = $scope.myFile;
    var fileFormData = new FormData();
    fileFormData.append('file', file);
    fileFormData.append('property', property);
    fileFormData.append('location',  'img/banners');
    fileFormData.append('id', bannerId);
    var uploadUrl = apiInterface.getApiUrl()+"upload/banner?api_token="+apiInterface.getApiToken(), //Url of webservice/api/server
        promise = fileUploadService.uploadFileToUrl(fileFormData, uploadUrl);

    promise.then(function (response) {
        if(response.status == 200){
          $scope.banner[response.data.property] = response.data.saved;
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
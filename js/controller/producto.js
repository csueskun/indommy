app.controller('productoController', function($scope, apiInterface, snackbar) {
  $scope.productoList = [];
  $scope.empresaList = [];
  $scope.tipoproductoList = [];
  $scope.tipocategoriaList = [];

  const apiName = 'producto';

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

  loadProducto();
  loadEmpresas();
  
  loadTipoproducto();
  loadTipocategoria();

  function loadTipocategoria(){
    $scope.loadingProducto = true;
    let success = data=>{
      if(data.status == 200){
        $scope.tipocategoriaList = data.data.data;
        $scope.loadingProducto = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingProducto = false;
    };
    apiInterface.get('tipocategoria', {}, success, error);
  }

  function loadTipoproducto(){
    $scope.loadingProducto = true;
    let success = data=>{
      if(data.status == 200){
        $scope.tipoproductoList = data.data.data;
        $scope.loadingProducto = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingProducto = false;
    };
    apiInterface.get('tipoproducto', {}, success, error);
  }

  function loadEmpresas(){
    $scope.loadingProducto = true;
    let success = data=>{
      if(data.status == 200){
        $scope.empresaList = data.data.data;
        $scope.loadingProducto = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingProducto = false;
    };
    apiInterface.get('empresa', {}, success, error);
  }

  function loadProducto(){
    $scope.loadingProducto = true;
    let success = data=>{
      if(data.status == 200){
        $scope.productoList = data.data.data;
        $scope.loadingProducto = false;
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingProducto = false;
    };
    apiInterface.get(apiName, {}, success, error);
  }

  $scope.show = function(section){
    $('.collapse.show').collapse('toggle');
    $('.collapse#'+section).collapse('toggle');
  }

  $scope.prepareDelete = function(producto, event, index){
    $scope.productoIndex = index;
    $scope.producto = Object.assign({}, producto);
    showToast('.toast.delete', event.clientY - 40);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.productoList.splice($scope.productoIndex, 1);
      }
      hideToast('.toast.delete');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.producto.id, {}, success, error);
  }

  $scope.prepareForm = function(producto={}, editable=true, index){
    $scope.productoIndex = index;
    $scope.editable = editable;
    $scope.producto = Object.assign({}, producto);
    $scope.show('form');
  }

  $scope.save = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.producto.id){
        $scope.editable = false;
      }
      else{
        $scope.producto = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadProducto();
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
    if($scope.producto.id){
      apiInterface.put(apiName+'/'+$scope.producto.id, $scope.producto, {}, success, error);
    }
    else{
      apiInterface.post(apiName, $scope.producto, {}, success, error);
    }
  }

  function updateFormValidation(){
    const keys = Object.keys($scope.formErrors);
    keys.forEach(k=>{
      $scope.form[k].$setValidity('unique', false);
    })
  }
});
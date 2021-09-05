app.controller('empresaController', function($scope, apiInterface, snackbar, fileUploadService, $timeout) {
  $scope.empresaList = [];
  $scope.ciudadList = [];
  $scope.grupoList = [];
  $scope.tipoproductoList = [];
  $scope.tipocategoriaList = [];
  $scope.pagination = {per_page: 20};
  $scope.pagination2 = {per_page: 20};
  $scope.paginationForm = {};
  $scope.imgLocation = apiInterface.getImgUrl();
  $scope.cache = new Date().getTime();

  const apiName = 'empresa';
  
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

  loadCiudades();
  loadEmpresas();
  loadTipoproducto();
  loadTipocategoria();
  loadGrupo();
  
  function loadGrupo(){
    $scope.loadingEmpresas = true;
    let success = data=>{
      if(data.status == 200){
        $scope.grupoList = data.data.data;
        $scope.loadingEmpresas = false;
      }};
    let error = error=>{
      $scope.loadingEmpresas = false;
    };
    apiInterface.get('grupo', {}, success, error);
  }

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

  function loadProductos(){
    $scope.loadingEmpresas = true;
    let success = data=>{
      if(data.status == 200){
        $scope.productoList = data.data.data.data;
        $scope.pagination2 = data.data.data.pagination;
        $scope.loadingEmpresas = false;
        $("#modalProductos").modal('show');
      }};
    let error = error=>{
      console.log(error);
      $scope.loadingEmpresas = false;
    };
    apiInterface.get('paginated/producto', {params: $scope.pagination2}, success, error);
  }

  $scope.setPaginationPage = function(page){
    $scope.pagination.current_page = page;
    loadEmpresas();
  }
  $scope.setPerPage = function(){
    $scope.pagination.current_page = 1;
    loadEmpresas();
  }
  $scope.setPagination2Page = function(page){
    $scope.pagination2.current_page = page;
    loadEmpresas();
  }
  $scope.setPerPage2 = function(){
    $scope.pagination2.current_page = 1;
    loadProductos();
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


  $scope.show = function(section, parent='.empresa'){
    $(parent+'.collapse.show').collapse('toggle');
    $(parent+'.collapse#'+section).collapse('toggle');
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
    if(empresa.id){
      $scope.show('form');
      return false;
    }
    let success = data=>{
      if(data.status == 200){
        $scope.empresa = Object.assign({}, data.data);
        $scope.show('form');
      }};
    let error = error=>{
      console.error(error);
      $scope.show('form');
    };
    apiInterface.get('next/empresa', {}, success, error);

  }

  $scope.save = function(){
    $scope.form['nombre'].$setValidity('unique', true);
    if($scope.form.$invalid){
      $scope.form.$setDirty();
      scrollToError();
      return false;
    }
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
      if(error.status == 422) {
        snackbar.red('Se encontraron errores en el formulario.');
        $scope.formErrors = error.data;
        updateFormValidation();
        $scope.form.$setDirty();
      }
      else{
        snackbar.red('Se presentó un error al guardar.');
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
  function scrollToError(){
    const e = $('.invalid-feedback')[0];
    scrollToElement(e,-140);
  }

  function updateFormValidation(){
    var keys = [];
    try {
      keys = Object.keys($scope.formErrors);
    } catch (error) {
    }
    for (var index = 0; index < keys.length; index++) {
      const element = keys[index];
      $scope.form[element].$setValidity('unique', false);
    }
    $timeout(scrollToError,100);
  }
  
  $scope.searchEmpresas = function(){
    loadEmpresas();
  }


  $scope.uploadFile = function (empresaId, property) {
    $scope.saving = true;
    var file = $scope.myFile;
    var fileFormData = new FormData();
    fileFormData.append('file', file);
    fileFormData.append('property', property);
    fileFormData.append('location',  'img/empresas');
    fileFormData.append('id', empresaId);

    var uploadUrl = apiInterface.getApiUrl()+"upload/empresa?api_token="+apiInterface.getApiToken(), //Url of webservice/api/server
        promise = fileUploadService.uploadFileToUrl(fileFormData, uploadUrl);

    promise.then(function (response) {
        if(response.status == 200){
          $scope.empresa[response.data.property] = response.data.saved;
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

  $scope.prepareImages = function(empresa={}){
    $scope.empresa = empresa;
    $("#modalArchivos").modal('show');
  }

  $scope.prepareProductos = function(empresa){
    $scope.empresa = empresa;
    $scope.pagination2.empresa = empresa.id;
    loadProductos();
  }

  $scope.prepareImagesProducto = function(producto={}){
    $scope.producto = producto;
    $scope.show("archivos", ".producto");
  }

  $scope.prepareFormProducto = function(producto={}, editable=true, index){
    $scope.show("list", ".producto");
    $scope.productoIndex = index;
    $scope.editableProducto = editable;
    $scope.producto = Object.assign({}, producto);
    $scope.producto.empresa_id = $scope.empresa.id;
    if($scope.producto.empresa){
      $scope.producto._empresa_id = $scope.producto.empresa.nombre;
    }
    $scope.show('formProducto', '.producto');
  }


  $scope.saveProducto = function(){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.producto.id){
        $scope.editableProducto = false;
      }
      else{
        $scope.producto = Object.assign({}, {});
        $scope.form.$setPristine();
      }
      loadProductos();
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
      apiInterface.put('producto'+'/'+$scope.producto.id, $scope.producto, {}, success, error);
    }
    else{
      apiInterface.post('producto', $scope.producto, {}, success, error);
    }
  }

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


  $scope.uploadFileProducto = function (productoId, property) {
    $scope.saving = true;
    var file = $scope.myFile;
    var fileFormData = new FormData();
    fileFormData.append('file', file);
    fileFormData.append('property', property);
    fileFormData.append('location',  'img/productos');
    fileFormData.append('id', productoId);
    var uploadUrl = apiInterface.getApiUrl()+"upload/producto?api_token="+apiInterface.getApiToken(), //Url of webservice/api/server
        promise = fileUploadService.uploadFileToUrl(fileFormData, uploadUrl);

    promise.then(function (response) {
        if(response.status == 200){
          $scope.producto[response.data.property] = response.data.saved;
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

  $scope.prepareDeleteProducto = function(producto, event, index){
    $scope.productoIndex = index;
    $scope.producto = Object.assign({}, producto);
    showToast('.toast.producto.delete', event.clientY - 140);
  }

  $scope.prepareGrupos = function(empresa){
    $scope.empresa = empresa;
    $scope.empresaGrupos = [];
    try {
      $scope.empresa.grupos.forEach(function(g){
        $scope.empresaGrupos.push(g.grupo.id);
      });
    } catch (error) {}
    $("#modalGrupos").modal('show');
  }

  $scope.deleteGrupo = function(grupo){
    $scope.removingGrupos = true;
    var grupoEmpresaIndex = -1;
    var ge = -1;
    for (let i = 0; i < $scope.empresa.grupos.length; i++) {
      const grupoEmpresa = $scope.empresa.grupos[i];
      if(grupoEmpresa.grupo.id==grupo){
        grupoempresaIndex = i;
        ge = grupoEmpresa.id;
        break;
      }      
    }
    let success = data=>{
      $scope.removingGrupos = false;
      snackbar.green('Se ha borrado la asociación.');
      $scope.empresa.grupos.splice(grupoempresaIndex, 1);
      $scope.empresaGrupos = $scope.empresaGrupos.filter(function(g){
        return g != grupo;
      });
    };
    let error = error=>{
    };
    apiInterface.delete('grupoempresa/'+ge, {}, success, success);
  }

  $scope.addGrupo = function(grupo){
    $scope.addingGrupos = true;
    let success = data=>{
      if(data.status == 200){
        $scope.empresaGrupos.push(grupo);
        var grupoEmpresa = data.data.data;
        grupoEmpresa.grupo = {id: grupo};
        $scope.empresa.grupos.push(grupoempresa);
        $scope.addingGrupos = false;
      }
    };
    let error = error=>{
      snackbar.red('No se ha asociado el grupo.');
      $scope.deletingGrupo = false;
      $scope.addingGrupos = false;
    };
    var ge = {empresa_id: $scope.empresa.id, grupo_id:grupo, estado:1, prioridad:1};
    apiInterface.post('grupoempresa', ge, {}, success, error);
  }

});
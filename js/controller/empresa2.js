app.controller('empresa2Controller', function($scope, apiInterface, snackbar, fileUploadService, $timeout) {
  $scope.empresaList = [];
  $scope.ciudadList = [];
  $scope.grupoList = [];
  $scope.tipoproductoList = [];
  $scope.tipocategoriaList = [];
  $scope.horarioList = [];
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
  $scope.days = [
    {v: '8', d: 'Lunes-Viernes'},
    {v: '9', d: 'Lunes-Sábado'},
    {v: '10', d: 'Lunes-Domingo'},
    {v: '1', d: 'Lunes'},
    {v: '2', d: 'Martes'},
    {v: '3', d: 'Miércoles'},
    {v: '4', d: 'Jueves'},
    {v: '5', d: 'Viernes'},
    {v: '6', d: 'Sábado'},
    {v: '7', d: 'Domingo'}
  ];

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

  $scope.setPaginationPage = function(page){
    $scope.pagination.current_page = page;
    loadEmpresas();
  }
  $scope.setPerPage = function(){
    $scope.pagination.current_page = 1;
    loadEmpresas();
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

  $scope.prepareDelete = function(empresa, event, index){
    $scope.empresaIndex = index;
    $scope.empresa = Object.assign({}, empresa);
    showToast('.toast.empresa', event.clientY - 40, event.clientX-250);
  }

  $scope.delete = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.empresaList.splice($scope.empresaIndex, 1);
      }
      hideToast('.toast.empresa');
      $scope.saving = false;
    };let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete(apiName+'/'+$scope.empresa.id, {}, success, error);
  }

  $scope.prepareForm = function(empresa={}, editable=true, index){
    $scope.editable = true;
    $scope.empresaIndex = index;
    $scope.empresa = Object.assign({}, empresa);
    if(empresa.id){
      showForm();
      prepareGrupos();
      loadProductos();
      loadHorarios();
      return false;
    }
    let success = data=>{
      if(data.status == 200){
        $scope.empresa = Object.assign({}, data.data);
        showForm();
      }};
    let error = error=>{
      showForm();
    };
    apiInterface.get('next/empresa', {}, success, error);
  }

  $scope.save = function(){
    $scope.empresaForm.$setDirty();
    $scope.empresaForm['nombre'].$setValidity('unique', true);
    if($scope.empresaForm.$invalid){
      scrollToError();
      return false;
    }
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      if($scope.empresa.id){
      }
      else{
        $scope.empresa.id = data.data.data.id;
        $scope.editable = true;
        $scope.empresaForm.$setPristine();
      }
      loadEmpresas();
    };
    let error = error=>{
      if(error.status == 422) {
        snackbar.red('Se encontraron errores en el formulario.');
        $scope.empresaFormErrors = error.data;
        updateFormValidation();
        $scope.empresaForm.$setDirty();
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
      keys = Object.keys($scope.empresaFormErrors);
    } catch (error) {
    }
    for (var index = 0; index < keys.length; index++) {
      const element = keys[index];
      const error = $scope.productoFormErrors[element][0];
      if(error.includes('unique')){
        $scope.empresaForm[element].$setValidity('unique', false);
      }
      else if(error.includes('required')){
        $scope.empresaForm[element].$setValidity('required', false);
      }
    }
    $timeout(scrollToError,100);
  }

  function updateFormProductoValidation(){
    var keys = [];
    try {
      keys = Object.keys($scope.productoFormErrors);
    } catch (error) {
    }
    console.log($scope.productoFormErrors);
    for (var index = 0; index < keys.length; index++) {
      const element = keys[index];
      const error = $scope.productoFormErrors[element][0];
      if(error.includes('unique')){
        $scope.productoForm[element].$setValidity('unique', false);
      }
      else if(error.includes('required')){
        $scope.productoForm[element].$setValidity('required', false);
      }
    }
    $timeout(scrollToError,100);
  }
  
  $scope.searchEmpresas = function(){
    loadEmpresas();
  }


  $scope.uploadFile = function (empresaId, property, element) {
    var fileFormData = new FormData();
    fileFormData.append('file', document.getElementById(element).files[0]);
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

  $scope.backToList = function(){
    $scope.editable = true;
    doCollapse('list');
  }

  var showForm = function(){
    if($('#form.section').hasClass('show')){
      return false;
    }
    doCollapse('form');
  }

  var prepareGrupos = function(){
    $scope.empresaGrupos = [];
    try {
      $scope.empresa.grupos.forEach(function(g){
        $scope.empresaGrupos.push(g.grupo.id);
      });
    } catch (error) {}
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
        snackbar.green('Grupo asociado.');
        $scope.empresaGrupos.push(grupo);
        var grupoEmpresa = data.data.data;
        grupoEmpresa.grupo = {id: grupo};
        $scope.empresa.grupos.push(grupoEmpresa);
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


  // PRODUCTOS

  var loadProductos = function(){
    $scope.loadingEmpresas = true;
    let success = data=>{
      if(data.status == 200){
        $scope.productoList = data.data.data.data;
        $scope.pagination2 = data.data.data.pagination;
        $scope.loadingEmpresas = false;
      }};
    let error = error=>{
      $scope.loadingEmpresas = false;
    };
    apiInterface.get('paginated/producto', {params: $scope.pagination2}, success, error);
  }

  $scope.setPagination2Page = function(page){
    $scope.pagination2.current_page = page;
    loadEmpresas();
  }
  $scope.setPerPage2 = function(){
    $scope.pagination2.current_page = 1;
    loadProductos();
  }
  $scope.prepareFormProducto = function(producto={}, editable=true, index){
    $scope.productoIndex = index;
    $scope.editableProducto = true;
    $scope.producto = Object.assign({}, producto);
    $scope.producto.empresa_id = $scope.empresa.id;
    if($scope.producto.empresa){
      $scope.producto._empresa_id = $scope.producto.empresa.nombre;
    }
    doCollapse("producto-form", "sub-section");
  }


  $scope.saveProducto = function(){
    $scope.productoForm.$setDirty();
    $scope.productoForm['descripcion'].$setValidity('unique', true);
    if($scope.productoForm.$invalid){
      $scope.productoForm.$setDirty();
      scrollToError();
      return false;
    }
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
        // $scope.productoList.push(data.data.data);
      }
      $scope.saving = false;
      if($scope.producto.id){
      }
      else{
        $scope.producto.id = data.data.data.id;
        $scope.productoForm.$setPristine();
      }
      loadProductos();
    };
    let error = error=>{
      snackbar.red('Se presentó un error al guardar.');
      if(error.status == 422) {
        $scope.productoFormErrors = error.data;
        updateFormProductoValidation();
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


  $scope.uploadFileProducto = function (productoId, property, element) {
    $scope.saving = true;
    var file = $scope.myFile;
    var fileFormData = new FormData();
    fileFormData.append('file', document.getElementById(element).files[0]);
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
    showToast('.toast.producto', event.clientY - 40, event.clientX-250);
  }
  $scope.deleteProducto = function(){
    $scope.saving = true;
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Se ha borrado el registro.');
        $scope.productoList.splice($scope.productoIndex, 1);
      }
      hideToast('.toast.producto');
      $scope.saving = false;
    };
    let error = error=>{
      snackbar.red('No se ha borrado el registro.');
      $scope.saving = false;
      console.log(error);
    };
    apiInterface.delete('producto/'+$scope.producto.id, {}, success, error);
  }

  $scope.prepareImagesProducto = function(producto={}){
    $scope.producto = producto;
    doCollapse("producto-images", "sub-section");
  }

  var fillHours = function(init=true){
    var start = init?0:1;
    var end = init?23:24;
    var hours = [];
    var hour = '';
    for (var index = start; index <= end; index++) {
      hour = ''
      if(index<10){
        hour = '0';
      }
      hours.push(hour+index+':00');      
    }
    return hours;
  }

  // HORARIOS

  $scope.initHours = fillHours();
  $scope.endHours = fillHours(false);
  $scope.dayName = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  function loadHorarios(){
    $scope.newHorario = {empresa_id:$scope.empresa.id};
    $scope.loadingHorarios = true;
    let success = data=>{
      if(data.status == 200){
        $scope.horarioList = data.data.data;
        $scope.loadingHorarios = false;
      }};
    let error = error=>{
      $scope.loadingHorarios = false;
    };
    apiInterface.get('horario', {params: {empresa_id:$scope.empresa.id, order_asc:'day'}}, success, error);
  }

  $scope.saveNewHorario = function(form){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
        $scope.newHorario = {empresa_id:$scope.newHorario.empresa_id};
        loadHorarios();
      }
      $scope.saving = false;
      form.$setPristine();
    };
    let error = error=>{
      snackbar.red('Se presentó un error al guardar.');
      $scope.saving = false;
      loadHorarios();
    };
    $scope.saving = true;
    apiInterface.post('horario', $scope.newHorario, {}, success, error);
  }

  $scope.saveHorario = function(form){
    let success = data=>{
      if(data.status == 200){
        snackbar.green('Guardado exitosamente.');
      }
      $scope.saving = false;
      form.$setPristine();
      $('#modalEditarHorario').modal('hide');
    };
    let error = error=>{
      snackbar.red('Se presentó un error al guardar.');
      $scope.saving = false;
      $('#modalEditarHorario').modal('hide');
      loadHorarios();
    };
    $scope.saving = true;
    apiInterface.put('horario/'+$scope.selectedHorario.id, $scope.selectedHorario, {}, success, error);
  }

  $scope.deleteHorario = function(id, index){
    let success = data=>{
      if(data.status == 200){
        $scope.horarioList.splice(index, 1);
      }
    };
    let err = error=>{
    };
    apiInterface.delete('horario/' + id, {}, success, err);
  }

  $scope.editarHorario = function(horario){
    $scope.selectedHorario = horario;
    $scope.selectedHorario.day = String(horario.day);
    $('#modalEditarHorario').modal('show');
  }

});
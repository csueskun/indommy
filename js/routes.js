function routes($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/view/home.html"
  })
  .when("/empresa", {
    templateUrl : "/view/empresa/index.html",
    controller: 'empresaController',
    auth: 'perro'
  })
  .when("/empresa2", {
    templateUrl : "/view/empresa2/index.html",
    controller: 'empresa2Controller',
  })
  .when("/clase", {
    templateUrl : "/view/clase/index.html",
    controller: 'claseController'
  })
  .when("/tipocategoria", {
    templateUrl : "/view/tipocategoria/index.html",
    controller: 'tipocategoriaController'
  })
  .when("/servicio", {
    templateUrl : "/view/servicio/index.html",
    controller: 'servicioController'
  })
  .when("/grupo", {
    templateUrl : "/view/grupo/index.html",
    controller: 'grupoController'
  })
  .when("/detalle_servicio", {
    templateUrl : "/view/detalle_servicio/index.html",
    controller: 'detalle_servicioController'
  })
 
  .when("/evento", {
    templateUrl : "/view/evento/index.html",
    controller: 'eventoController'
  })
 
  .when("/oferta", {
    templateUrl : "/view/oferta/index.html",
    controller: 'ofertaController'
  })
  .when("/news", {
    templateUrl : "/view/news/index.html",
    controller: 'newsController'
  })
  .when("/feedback", {
    templateUrl : "/view/feedback/index.html",
    controller: 'feedbackController'
  })
  .when("/producto", {
    templateUrl : "/view/producto/index.html",
    controller: 'productoController'
  })
  .when("/atencion", {
    templateUrl : "/view/atencion/index.html",
    controller: 'atencionController'
  })
  
  .when("/ciudad", {
    templateUrl : "/view/ciudad/index.html",
    controller: 'ciudadController'
  })
  .when("/grupoempresa", {
    templateUrl : "/view/grupoempresa/index.html",
    controller: 'grupoempresaController'
  })
  .when("/tipoproducto", {
    templateUrl : "/view/tipoproducto/index.html",
    controller: 'tipoproductoController'
  })
  .when("/new_usuario", {
    templateUrl : "/view/new_usuario.html",
    controller: 'loginController'
  })
  .when("/banner", {
    templateUrl : "/view/banner/index.html",
    controller: 'bannerController'
  })
  .when("/login", {
    templateUrl : "/view/login.html",
    controller: 'loginController'
  });
}
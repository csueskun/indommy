function routes($routeProvider) {
  $routeProvider
  .when("/", {
    templateUrl : "/view/home.html"
  })
  .when("/empresa", {
    templateUrl : "/view/empresa/index.html",
    controller: 'empresaController'
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
  .when("/tipoproducto", {
    templateUrl : "/view/tipoproducto/index.html",
    controller: 'tipoproductoController'
  });
}
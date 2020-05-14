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

  .when("/tipoproducto", {
    templateUrl : "/view/tipoproducto/index.html",
    controller: 'tipoproductoController'
  });
}
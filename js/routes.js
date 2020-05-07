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
  .when("/tipoproducto", {
    templateUrl : "/view/tipoproducto/index.html",
    controller: 'tipoproductoController'
  });
}
<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/
$router->get('/', function () use ($router) {
    return $router->app->version();
});
$router->post('/login', 'LoginController@login');


// GRUPO DE RUTAS QUE NECESITAN AUTENTICACION
$router->group(['middleware' => 'auth'], function () use ($router) {

    $router->get('/logout', 'LoginController@logout');

    // INGREDIENTES
    $router->get('/ingredientes', 'IngredienteController@all');
    $router->post('/ingrediente', 'IngredienteController@new');
    $router->put('/ingrediente/{id}', 'IngredienteController@put');
    $router->patch('/ingrediente/{id}', 'IngredienteController@patch');
    $router->delete('/ingrediente/{id}', 'IngredienteController@delete');
    
    
    $router->get('/usuario/data', 'UserController@profile');
});
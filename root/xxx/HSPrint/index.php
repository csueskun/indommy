<?php
$drawer = $_GET['drawer']?:0;
$stack = $_POST['stack'];
$dedicadas = array();
$stack = json_decode(json_encode($stack), FALSE);
if(!$stack){
    $stack = $_GET['stack'];
    $stack = json_decode($stack);
}

require 'escpos-php/autoload.php';

use Mike42\Escpos\Printer;
use Mike42\Escpos\EscposImage;
use Mike42\Escpos\PrintConnectors\FilePrintConnector;
use Mike42\Escpos\PrintConnectors\WindowsPrintConnector;
use Mike42\Escpos\PrintConnectors\UriPrintConnector;

$impresora = '';
$i = 0;
$quitar = array();
foreach($stack as $instruccion){
    if($instruccion->i == 'impresora'){
        $impresora = $instruccion->v;
        $connector = new WindowsPrintConnector('//localhost:631//CUPS-BRF-Printer');
        $printer = new Printer($connector);
        $printer -> setFont(Printer::FONT_A);
        $printer -> setTextSize(1, 1);
    }
    if($instruccion->i == 'texto'){
        $printer -> text($instruccion->v);
    }
    if($instruccion->i == 'producto_pedido'){
        if($instruccion->impresora == '' || $instruccion->impresora == $impresora){
            $printer -> text($instruccion->v);
            array_unshift($quitar,$i);
        }
        else{
            if (!in_array($instruccion->impresora, $dedicadas)){
                $dedicadas[] = $instruccion->impresora;
            }
        }
    }
    else if($instruccion->i == 'imagen'){
        $imagen = EscposImage::load('./img/'.$instruccion->v, false);
        $printer -> bitImage($imagen);
    }
    else if($instruccion->i == 'logo'){
        $imagen = EscposImage::load('./img/logo.png', false);
        $printer -> bitImage($imagen);
    }
    else if($instruccion->i == 'doble'){
        $printer -> setFont(Printer::FONT_B);
        $printer-> setTextSize(2, 2);
    }
    else if($instruccion->i == 'sencilla'){
        $printer -> setFont(Printer::FONT_A);
        $printer-> setTextSize(1, 1);
    }
    else if($instruccion->i == 'gaveta'){
        $printer -> setFont(Printer::FONT_A);
        $printer-> setTextSize(1, 1);
    }
    else if($instruccion->i == 'solo-gaveta'){
        $printer -> pulse();
        $printer -> pulse(1);
        $printer -> pulse(0, 100, 100);
        $printer -> pulse(0, 300, 300);
        $printer -> pulse(1, 100, 100);
        $printer -> pulse(1, 300, 300);
        $printer->close();
        die();
    }
    $i++;
}

if($drawer == 1){
    $printer -> pulse();
    $printer -> pulse(1);
    $printer -> pulse(0, 100, 100);
    $printer -> pulse(0, 300, 300);
    $printer -> pulse(1, 100, 100);
    $printer -> pulse(1, 300, 300);
}

//if(count($quitar)>0){
//    if(count($stack)>1){
//        $printer->feed(3);
//        $printer->cut();
//    }
//    $printer->close();
//}


$printer->feed(3);
$printer->cut();
$printer->close();


foreach($dedicadas as $impresora_dedicada){
    $stack[0] = ["i"=>"impresora","v"=>$impresora_dedicada];
    foreach ($quitar as $i){
        unset($stack[$i]);
    }
    header("Location: http://localhost/HSPrint?stack=".json_encode($stack));
    die();
}

//}

//
//foreach($dedicadas as $impresora_dedicada){
//    $connector = new WindowsPrintConnector($impresora_dedicada);
//    $printer = new Printer($connector);
//    foreach($stack as $instruccion){
//        if($instruccion->i == 'texto'){
//            // echo($instruccion->v);
//            $printer -> text($instruccion->v);
//        }
//        if($instruccion->i == 'producto_pedido'){
//            if($instruccion->impresora != null && $instruccion->impresora == $impresora_dedicada){
//                // echo($instruccion->v);
//                $printer -> text($instruccion->v);
//            }
//        }
//        else if($instruccion->i == 'doble'){
//            $printer-> setTextSize(2, 2);
//        }
//        else if($instruccion->i == 'sencilla'){
//            $printer-> setTextSize(1, 1);
//        }
//    }
//    $printer->feed(3);
//    $printer->cut();
//}
<?php
header('Content-Type: application/x-javascript;charset=utf-8');
$main=preg_replace("/^[\/]?([a-zA-Z\-]+)([.]js)?([?][^?]*)?$/is", "$1", $_SERVER['PATH_INFO']);
$root=dirname(__FILE__)."/";
$path=$root.$main."/j.".$main.".php";
if(!file_exists($path))return;
include_once($path);
?>
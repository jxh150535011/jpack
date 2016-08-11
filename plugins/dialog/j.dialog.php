<?php

$root=dirname(__FILE__)."/";
$filename = $root.'j.dialog_config.js';
$handle = fopen ($filename, "r");
$contents = fread ($handle, filesize ($filename));
fclose ($handle);
ob_end_clean();
echo $contents;
?>
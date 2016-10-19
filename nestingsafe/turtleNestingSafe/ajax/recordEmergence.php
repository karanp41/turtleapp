<?php
include_once("db.inc.php");
error_log(print_r($_GET['content'],true));
//parse_str($_GET, $GET);
//$_GET = unserialize($_GET['content']);
error_log(print_r($_GET,true));

$sql = "INSERT INTO emergence VALUES(".
		"0,".
		"'".$_GET['rfid']."',".
		"now(),".
		"'".$_GET['un']."',".
		"".$_GET['dead'].",".
		"".$_GET['alive'].",".
		"".$_GET['tracks'].",".
		"".$_GET['toSea'].",".
		"".$_GET['deadInTransit'].",".
		"'".$_GET['cause']."',".
		"".$_GET['incubation'].",".
		"".$_GET['comment'].",".
		"FROM_UNIXTIME(".strtotime($_GET['emergDate'])."),".
		"'".$_GET['nestEmpty']."');";
$sql = str_replace(",,",",NULL,",$sql);
$sql = str_replace(",,",",NULL,",$sql);
$sql = str_replace(",)",",NULL)",$sql);
$sql = str_replace(", ,",",NULL,",$sql);
error_log($sql);

mysqli_query($db,$sql);
?>

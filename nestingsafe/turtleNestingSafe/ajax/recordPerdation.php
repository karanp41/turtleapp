<?php
include_once("db.inc.php");
error_log(print_r($_GET['content'],true));
//parse_str($_GET, $GET);
//$_GET = unserialize($_GET['content']);
error_log(print_r($_GET,true));

$sql = "INSERT INTO predation VALUES(".
		"0,".
		"'".$_GET['rfid']."',".
		"now(),".
		"'".$_GET['un']."',".
		"'".$_GET['predator']."',".
		"'".$_GET['gridcover']."',".
		"".$_GET['clawedEggs'].",".
		"".$_GET['fertilized'].",".
		"".$_GET['unfertilized'].",".
		"".$_GET['earlyEmbryonic'].",".
		"".$_GET['middleEmbryonic'].",".
		"".$_GET['lateEmbryonic'].",".
		"".$_GET['dead'].",".
		"".$_GET['alive'].",".
		"".$_GET['deadOutside'].",".
		"".$_GET['aliveOutside'].",".
		"'".$_GET['comment']."',".
		"FROM_UNIXTIME(".strtotime($_GET['predationDate'])."),".
		"'".$_GET['nestEmpty']."');";
$sql = str_replace(",,",",NULL,",$sql);
$sql = str_replace(",,",",NULL,",$sql);
$sql = str_replace(",)",",NULL)",$sql);
$sql = str_replace(", ,",",NULL,",$sql);
error_log($sql);

mysqli_query($db,$sql);
?>

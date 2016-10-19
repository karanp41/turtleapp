<?php
include_once("db.inc.php");
error_log(print_r($_GET['content'],true));
//parse_str($_GET, $GET);
//$_GET = unserialize($_GET['content']);
error_log(print_r($_GET,true));

$sql = "INSERT INTO uncover VALUES(".
		"0,".
		"'".$_GET['rfid']."',".
		"now(),".
		"'".$_GET['un']."',".
		"'".$_GET['predatorInNest']."',".
		"".$_GET['drySand'].",".
		"".$_GET['wetSand'].",".
		"".$_GET['diaEggChamb'].",".
		"".$_GET['predatedEggs'].",".
		"".$_GET['dead'].",".
		"".$_GET['alive'].",".
		"".$_GET['deadOutside'].",".
		"".$_GET['aliveOutside'].",".
		"".$_GET['emptyshells'].",".
		"".$_GET['unfertilized'].",".
		"".$_GET['earlyEmbryonic'].",".
		"".$_GET['middleEmbryonic'].",".
		"".$_GET['late'].",".
		"".$_GET['deadEmbr'].",".
		"".$_GET['eggsInNest'].",".
		"".$_GET['samples'].",".
		"'".$_GET['comment']."',".
		"FROM_UNIXTIME(".strtotime($_GET['controlDate'])."),".
		"'".$_GET['nestEmpty']."');";
$sql = str_replace(",,",",NULL,",$sql);
$sql = str_replace(",,",",NULL,",$sql);
$sql = str_replace(",)",",NULL)",$sql);
$sql = str_replace(", ,",",NULL,",$sql);
error_log($sql);

mysqli_query($db,$sql);
?>

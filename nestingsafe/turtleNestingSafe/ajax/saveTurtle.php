<?php
include_once("db.inc.php");
error_log(print_r($_GET['content'],true));
//parse_str($_GET, $GET);
//$_GET = unserialize($_GET['content']);
error_log(print_r($_GET,true));

$sql = "INSERT INTO turtles VALUES(".
		"'".$_GET['dbid']."',".
		"'".$_GET['tagID']."',".
		"'".$_GET['replacedID']."',".
		"'".$_GET['tagDate']."',".
		"'".$_GET['replacedDate']."',".
		"'".$_GET['nameOfMeasurer']."',".
		"'".$_GET['scl']."',".
		"'".$_GET['scw']."',".
		"'".$_GET['ccl']."',".
		"'".$_GET['ccw']."',".
		"'".$_GET['n']."',".
		"'".$_GET['cr']."',".
		"'".$_GET['cl']."',".
		"'".$_GET['v']."',".
		"'".$_GET['mr']."',".
		"'".$_GET['ml']."',".
		"'".$_GET['sc']."',".
		"'".$_GET['devices']."',".
		"'".$_GET['notes']."'".
		")".
		"ON DUPLICATE KEY UPDATE ".
		"tagID=VALUES(tagID),".
		"replacedID=VALUES(replacedID)".
		";";
$sql = str_replace(",,",",NULL,",$sql);
$sql = str_replace(",,",",NULL,",$sql);
$sql = str_replace(",)",",NULL)",$sql);
$sql = str_replace(", ,",",NULL,",$sql);
error_log($sql);

mysqli_query($db,$sql);
?>

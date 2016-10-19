<?php
$data = file_get_contents("php://input");
error_log($data);
include_once("db.inc.php");
error_log(print_r($_GET['content'],true));
//$_GET = unserialize($_GET['content']);
error_log(print_r($_GET,true));
$un=$_GET['un'];
$sql = "SELECT * from users where username like '$un';";
$result = mysqli_query($db,$sql);
$inserted = 0;
$discarded = 0;
$user = mysqli_fetch_assoc($result);
$input = json_decode($data,true);
foreach ($input as $id=>$val){
	$sense = json_decode($val);
	foreach ( $sense as $timestamp => $senseval){
//		$sql += "0,'".$senseval[0]."','$id',1,".$senseval[1]."),";
		$sql = "INSERT INTO sensorLog (id, timestamp, rfid, sensortype, sensorvalue)".
			"SELECT * FROM (SELECT 0, '".$senseval[0]."', '$id',1,".$senseval[1].") AS tmp ".
			"WHERE NOT EXISTS (".
			"    SELECT timestamp,rfid FROM sensorLog WHERE timestamp = '".$senseval[0]."' AND rfid='$id' ".
			") LIMIT 1;";
		$result = mysqli_query($db,$sql);
		if (mysqli_affected_rows($db)==1)
			$inserted++;
		else
			$discarded++;
	}
}
//error_log(print_r($input,true));
error_log($sql);
echo "New temps: $inserted\nDiscarded temps: $discarded";
?>

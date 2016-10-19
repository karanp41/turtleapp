<?php
$search = $_GET['rfid'];
$dbid = $_GET['dbid'];
include_once("db.inc.php");
$sql = "SELECT * from nests where rfid like '$search' order by nestingDate;";
if (!empty($dbid)){
	$sql = "SELECT * from nests where id=$dbid order by nestingDate;";
}
error_log($sql);

$result = mysqli_query($db,$sql);

$jsonData = array();

while ($array = mysqli_fetch_assoc($result)) {
	$search = $array['rfid'];
	error_log(print_r($array,true));
    $jsonData[] = $array;
}

$sql2 = "SELECT count(*) as tempValCount from sensorLog where rfid like '$search' order by id;";
error_log($sql2);
$result2 = mysqli_query($db,$sql2);
$counts = mysqli_fetch_assoc($result2);
$jsonData[0]['tempCount'] = $counts['tempValCount'];

$data =  json_encode($jsonData);

echo str_replace("null","\"\"",$data);
//json_encode()

?>

<?php
include_once("db.inc.php");
$un = $_GET['un'];
$type = $_GET['type'];
$rfid = $_GET['rfid'];
$dbid = $_GET['dbid'];


$sql = "SELECT * from users where username like '$un';";
$result = mysqli_query($db,$sql);
$user = mysqli_fetch_assoc($result);
if (!empty($rfid))
	$sql = "SELECT * FROM sensorLog where rfid like '$rfid' order by timestamp desc";


$result = mysqli_query($db,$sql);

$jsonData = array();
while ($array = mysqli_fetch_assoc($result)) {
    $array['nestingDate']=date("d/m/Y", strtotime($array['nestingDate']));
    $jsonData[] = $array;
}

$result = mysqli_query($db,$sql);
$aaData=array();
while ($array = mysqli_fetch_row($result)) {
//    array_unshift($array,date("d/m/Y", strtotime($array['5'])));
//    $array[2] = "<a href='#' onClick='processTagDbId(".$array[1].");'>".$array[2]."</a>";
    $aaData[] = $array;
}


if ($_GET['output'] == "aaData")
echo json_encode(array("aaData"=>($aaData)));
else
echo json_encode($jsonData);

//json_encode()

?>

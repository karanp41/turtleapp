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
$sql = "SELECT * from nests where origLat not like '' and origLong not like '' and groupId = ".$user['group']."  and rfid like '$rfid' and DATE(nestingDate) > DATE( DATE_SUB( NOW() , INTERVAL 180 DAY ) );";
else if (!empty($dbid)){
//        $sql = "SELECT * from predation where id=$dbid order by nestingDate;";
	$sql = "SELECT * from nests where origLat not like '' and origLong not like '' and groupId = ".$user['group']."  and id like '$dbid' and DATE(nestingDate) > DATE( DATE_SUB( NOW() , INTERVAL 180 DAY ) );";

}

else
$sql = "SELECT * from nests where origLat not like '' and origLong not like '' and groupId = ".$user['group']." and DATE(nestingDate) > DATE( DATE_SUB( NOW() , INTERVAL 180 DAY ) );";
error_log($sql);


$result = mysqli_query($db,$sql);

$jsonData = array();
while ($array = mysqli_fetch_assoc($result)) {
    $array['nestingDate']=date("d/m/Y", strtotime($array['nestingDate']));
    $jsonData[] = $array;
}

$result = mysqli_query($db,$sql);
$aaData=array();
while ($array = mysqli_fetch_row($result)) {
    array_unshift($array,date("d/m/Y", strtotime($array['5'])));
    $array[2] = "<a href='#' onClick='processTagDbId(".$array[1].");'>".$array[2]."</a>";
    $aaData[] = $array;
}


if ($_GET['output'] == "aaData")
echo json_encode(array("aaData"=>($aaData)));
else
echo json_encode($jsonData);

//json_encode()

?>

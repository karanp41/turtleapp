<?php
$search = $_GET['rfid'];
$dbid = $_GET['dbid'];
include_once("db.inc.php");
if (!empty($search)){
$sql = "SELECT * from predation where rfid like '$search' order by timestamp DESC;";
if (!empty($dbid)){
        $sql = "SELECT * from predation where id=$dbid order by nestingDate;";
}

$result = mysqli_query($db,$sql);
$jsonData = array();
while ($array = mysqli_fetch_assoc($result)) {
    $jsonData[] = $array;
}
echo json_encode($jsonData);
}
//json_encode()

?>

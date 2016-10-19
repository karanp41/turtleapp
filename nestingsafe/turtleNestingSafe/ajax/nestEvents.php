<?php
$search = $_GET['rfid'];
include_once("db.inc.php");
$sql = "SELECT * from predation where rfid like '$search' order by timestamp DESC;";
$result = mysqli_query($db,$sql);
$jsonData = array();
while ($array = mysqli_fetch_assoc($result)) {
    $jsonData[] = $array;
}
echo json_encode($jsonData);
//json_encode()

?>

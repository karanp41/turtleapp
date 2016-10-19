<?php
$qr = trim($_GET['qr']);
$rfid = $_GET['rfid'];
include_once("db.inc.php");
$sql = "UPDATE  nests set adoptId='$qr' where rfid = '$rfid';";
error_log($sql);
$result = mysqli_query($db,$sql);
if (1){
$resp['response']= "1";
}
else {
$resp['response']= "0";
}
echo json_encode($resp);
?>

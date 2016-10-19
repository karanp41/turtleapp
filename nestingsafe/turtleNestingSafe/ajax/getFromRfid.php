
<?php
include_once("db.inc.php");

header('Content-Type: application/json');
$rfid = $_GET['rfid'];

$sql = "SELECT * from locations where rfid like '$rfid'";
$result = mysqli_query($db,$sql);
$row = mysqli_fetch_assoc($result);
$lokid = $row['loc_id'];
$lokname = $row['name'];
$lokinfo = $row['info'];
$comment = $row['comment'];

$sql = "INSERT into readlog VALUES(0,now(),'$rfid');";
$result = mysqli_query($db,$sql);


?>
{
  "id": "<?=$rfid;?>",
  "lokid": "<?=$lokid;?>",
  "lokname": "<?=$lokname;?>",
  "lokinfo": "<?=$lokinfo;?>",
  "comment": "<?=$comment;?>"
}

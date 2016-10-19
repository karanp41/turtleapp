<?php
include_once("db.inc.php");
$un = $_GET['un'];
$type = $_GET['type'];
$tagid = $_GET['tagid'];

//$sql = "SELECT * from users where username like '$un';";
//$result = mysqli_query($db,$sql);
//$user = mysqli_fetch_assoc($result);
if (!empty($tagid))
	$sql = "SELECT * from turtles where tagID like '$tagid';";
else
	$sql = "SELECT * from turtles ;";


error_log($sql);
$result = mysqli_query($db,$sql);

$jsonData = array();
while ($array = mysqli_fetch_assoc($result)) {
    $array['nestingDate']=date("d/m/Y", strtotime($array['nestingDate']));
    $jsonData[] = $array;
}
echo json_encode($jsonData);
//json_encode()

?>

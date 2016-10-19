<?php
$un = trim($_GET['un']);
$pw = $_GET['psw'];
include_once("db.inc.php");
$sql = "SELECT * from users where username like '$un';";

$result = mysqli_query($db,$sql);
$row =  mysqli_fetch_assoc($result);
$num_rows =  mysqli_num_rows($result);
error_log("login:".$un." ".$pw);
if (0<$num_rows && $row['psw']==$pw){
$resp['response']= "1";
$resp['group']= $row['group'];
$resp['role']= $row['role'];
}
else {
$resp['response']= "0";
}
echo json_encode($resp);
?>

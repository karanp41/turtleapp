<?php
include_once("db.inc.php");
error_log(print_r($_GET['content'],true));
//$_GET = unserialize($_GET['content']);
error_log(print_r($_GET,true));
$un=$_GET['un'];
$sql = "SELECT * from users where username like '$un';";
$result = mysqli_query($db,$sql);
$user = mysqli_fetch_assoc($result);

$group = $user['group'];
$dbid=$_GET['dbid'];
if ($dbid=="new"){
	$dbid="null";
}

$sql = "INSERT INTO nests VALUES(".
		"$dbid,".
		"'".$_GET['nestID']."',".
		"'".$_GET['rfid']."',".
		"'',".
		"'".$_GET['turtleId']."',".
		"FROM_UNIXTIME(".strtotime($_GET['nestingDate'])."),".
		"'".$_GET['certain']."',".
		"'".$_GET['species']."',".
		$_GET['dist'].",".
		$_GET['wetSand'].",".
		$_GET['drySand'].",".
		$_GET['diaEggChamb'].",".
		$_GET['probability'].",".
		"FROM_UNIXTIME(".strtotime($_GET['alt_date'])."),".
		"'".$_GET['altTimeOptions']."',".
		$_GET['lat'].",".
		$_GET['long'].",".
		$_GET['alt_lat'].",".
		$_GET['alt_long'].",".
		$_GET['wetZoneAlt'].",".
		$_GET['tideZoneAlt'].",".
		$_GET['drySandZoneAlt'].",".
		$_GET['distanceSeaAlt'].",".
		$_GET['success'].",".
		$_GET['dataLoggerId'].",".
		"'".$_GET['un']."',".
		$group.",".
		"now(),".
		"'".$_GET['gridcover']."',".
		"'".$_GET['gridcoverAlt']."',".
		$_GET['wetZone'].",".
		$_GET['tideZone'].",".
		$_GET['drySand'].",".
		$_GET['wetSand'].",".
		"'".$_GET['vegetation']."',".
		"'".$_GET['leftLandMark']."',".
		$_GET['leftMarkNum'].",".
		$_GET['leftMarkDist'].",".
		"'".$_GET['rightLandMark']."',".
		"".$_GET['rightMarkNum'].",".
		"".$_GET['rightMarkDist'].",".
		"'".$_GET['nestLoc']."',".
		"".$_GET['dmgEggs'].",".
		"'".$_GET['leftLandmarkAlt']."',".
		"".$_GET['leftMarkNumAlt'].",".
		"".$_GET['leftMarkDistAlt'].",".
		"'".$_GET['rightLandmarkAlt']."',".
		"".$_GET['rightMarkNumAlt'].",".
		"".$_GET['rightMarkDistAlt'].",".
		"'".$_GET['comment']."',".
		"'".$_GET['commentAlt']."',".
		"'".$_GET['devices']."',".
		"'".$_GET['devicesAlt']."'".
		")ON DUPLICATE KEY UPDATE".
		" id=VALUES(id),".
		" NestID=VALUES(NestID),".
		" turtleId=VALUES(turtleId),".
		" nestingDate=VALUES(nestingDate),".
		" certain=VALUES(certain),".
		" species=VALUES(species),".
		" distanceFromSea=VALUES(distanceFromSea),".
		" heightOfWetSand=VALUES(heightOfWetSand),".
		" diameterEggChamber=VALUES(diameterEggChamber),".
		" probability=VALUES(probability),".
		" alternationTime=VALUES(alternationTime),".
		" origLat=VALUES(origLat),".
		" origLong=VALUES(origLong),".
		" alt_lat=VALUES(alt_lat),".
		" alt_long=VALUES(alt_long),".
		" alt_wetZone=VALUES(alt_wetZone),".
		" alt_dryZone=VALUES(alt_dryZone),".
		" alt_tideZone=VALUES(alt_tideZone),".
		" alt_distSea=VALUES(alt_distSea),".
		" dataLoggerId=VALUES(dataLoggerId),".
		" gridCover=VALUES(gridCover),".
		" wetZone=VALUES(wetZone),".
		" tideZone=VALUES(tideZone),".
		" drySand=VALUES(drySand),".
		" vegetation=VALUES(vegetation),".
		" leftLandMark=VALUES(leftLandMark),".
		" leftMarkNum=VALUES(leftMarkNum),".
		" leftMarkDist=VALUES(leftMarkDist),".
		" rightLandMark=VALUES(rightLandMark),".
		" rightMarkNum=VALUES(rightMarkNum),".
		" rightMarkDist=VALUES(rightMarkDist),".
		" nestLoc=VALUES(nestLoc)".
		";";
$sql = str_replace(",,",",NULL,",$sql);
$sql = str_replace(",,",",NULL,",$sql);
$sql = str_replace(",)",",NULL)",$sql);
$sql = str_replace(", ,",",NULL,",$sql);
$sql = str_replace("FROM_UNIXTIME()","0",$sql);
error_log($sql);

mysqli_query($db,$sql);
?>

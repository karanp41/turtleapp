<html>
<head>
<meta charset="utf-8" />
<meta name="format-detection" content="telephone=no" />
<meta name="msapplication-tap-highlight" content="no" />
<meta http-equiv="sip" content="manual" />  
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<!-- WARNING: for iOS 7, remove the width=device-width and height=device-height attributes. See https://issues.apache.org/jira/browse/CB-4323 -->
<meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, target-densitydpi=device-dpi" />
<link rel="stylesheet" href="js/jquery-ui-1.11.2/jquery-ui.min.css" />
<link rel="stylesheet" href="js/jquery.mobile-1.4.5.min.css" />
<link rel="stylesheet" href="js/km.css" />
<script src="js/jquery-1.11.2.min.js"></script>
<script src="js/jquery-ui-1.11.2/jquery-ui.min.js"></script>
<script src="js/jquery.mobile-1.4.5.min.js"></script>
<script src="js/km.js"></script>
</head>
<body>
<div data-role="page">
<div data-role="header" style="overflow:hidden;"   data-position="fixed">
<h1>Tag Plate Scanner</h1>
<!--    <a href="#options" data-icon="gear" class="ui-btn-right">Options</a>-->
<img src="identec.jpg" height="50px"  class="ui-btn-left"></img>

</div><!-- /header -->
<div role="main" class="ui-content">
<div id="scan-div">
<input disabled="disabled"  id="rfid-scan" type="text" placeholder="Ready to scan..." ></input>
<!--<input  id="rfid-scan" type="text" placeholder="Scan tagplate" onChange="tagInput($('#rfid-scan').val());"></input>-->
</div>
<div id="info-div" class="ui-corner-all custom-corners">
  <div  style="height:30px" class="ui-bar ui-bar-a">
    <h3 id="info-title">Ready to scan...</h3>
  </div>
  <div class="ui-body ui-body-a">
	<div class="ui-grid-a">
	  <div class="ui-block-a"><div class="ui-bar ui-bar-a" style="height:30px">RFID:</div></div>
	  <div class="ui-block-b"><div id="rfid-info" class="ui-bar ui-bar-a" style="height:30px"></div></div>
	  <div class="ui-block-a"><div class="ui-bar ui-bar-a" style="height:60px">Location:</div></div>
	  <div class="ui-block-b"><div id="name-info" class="ui-bar ui-bar-a" style="height:60px"></div></div>
	  <div class="ui-block-a"><div class="ui-bar ui-bar-a" >Info:</div></div>
	  <div class="ui-block-b"><div id="info-info" class="ui-bar ui-bar-a" >&nbsp; </div></div>
<!--	  <div class="ui-block-a"><div class="ui-bar ui-bar-a" style="height:30px">Comment:</div></div>
	  <div class="ui-block-b"><div id="comment-info" class="ui-bar ui-bar-a" style="height:30px"></div></div>-->
	</div><!-- /grid-a -->

  </div>
</div>

</div>
<div data-role="footer" data-position="fixed"   data-fullscreen="true">
<h3 id="server-status">Server status: Online</h3>
</div>
</div><!-- /page -->
</body>
</html>


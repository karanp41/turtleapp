<!DOCTYPE html>
<!--
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
     KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes" />
        <meta name="format-detection" content="telephone=yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <!-- WARNING: for iOS 7, remove the width=device-width and height=device-height attributes. See https://issues.apache.org/jira/browse/CB-4323 -->
        <link rel="stylesheet" type="text/css" href="css/index.css" />
        <link rel="stylesheet" type="text/css" href="css/jquery.mobile.min.css" />
        <link rel="stylesheet" type="text/css" href="css/jquery.mobile.datepicker.css" />
        <link rel="stylesheet" href="leaflet/leaflet.css" />
        <link rel="stylesheet" type="text/css" href="css/RFIDNest.css" />
<link rel="stylesheet" href="https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css" />
<link rel="stylesheet" href="http://cdn.datatables.net/1.10.10/css/jquery.dataTables.css" />
<link rel="stylesheet" href="https://cdn.datatables.net/buttons/1.1.0/css/buttons.dataTables.min.css" />
<link rel="stylesheet" type="text/css" href="css/jquery.mobile.min.css" />
<script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
        <script type="text/javascript" src="js/jquery.mobile.min.js"></script>
<script src="//cdn.datatables.net/1.10.10/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/buttons/1.1.0/js/dataTables.buttons.min.js"></script>
<script src="//cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/pdfmake.min.js"></script>
<script src="//cdn.rawgit.com/bpampuch/pdfmake/0.1.18/build/vfs_fonts.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"></script>
<script src="//cdn.datatables.net/buttons/1.1.0/js/buttons.html5.min.js"></script>
<!-- <script src="https://cdn.datatables.net/buttons/1.1.0/js/dataTables.buttons.min.js"></script>-->
<script src="//cdn.datatables.net/buttons/1.1.0/js/buttons.colVis.min.js"></script>
<script src="js/RFIDNest.js"></script>

<script>
username="<?=$_GET['user'];?>";
</script>
        <title>RFIDNesting</title>
    </head>
    <body>
    
	    <div data-role="page" id="menuPage">
			<div data-role="header">
				<h1>v0.999 RFIDNesting </h1>

				<a href="#popupLogin" id="loginButton" data-rel="popup" data-position-to="window" class="ui-btn-right ui-btn ui-btn-b ui-btn-inline ui-mini ui-corner-all" data-transition="pop">Sign in</a>
				
			</div><!-- /header -->
		
			<div role="main" id="frontPage" class="ui-content">
				<p id="message" class="message"></p>
				<p id="id" hidden="hidden" class="message"></p>
				<div class="ui-field-contain">
				<ul id="menu" data-role="listview">
<!--					<li data-role="list-divider">Record</li>
					<li><a href="record-nest.html">New nest</a></li>
					<li><a href="predation.html">Predation</a></li>
					<li><a href="emergence.html">Emergence</a></li>
					<li><a href="uncoverControl.html">Uncover for Control</a></li>-->
					<li data-role="list-divider">View</li>
					<li><a href="map.html">Map</a></li> 
					<li><a href="nestList.html">NestList</a></li>
					<li><a href="table.php">TableView</a></li>
					<li><a href="temp.php">TemperatureView</a></li>

				</ul>
				</div>
			</div><!-- /content -->
		
			<div data-role="footer" data-position="fixed">
			</div><!-- /footer -->
		<div data-role="popup" id="popupLogin" data-theme="a"
			class="ui-corner-all">
			    
			<form>
				        
				<div style="padding: 10px 20px;">
					            
					<h3>Please sign in</h3>
					            <label for="un" class="ui-hidden-accessible">Username:</label>
					            <input type="text" name="user" id="un" value=""
						placeholder="username" data-theme="a">             <label
						for="pw" class="ui-hidden-accessible">Password:</label>
					            <input type="password" name="pass" id="pw" value=""
						placeholder="password" data-theme="a">             
					<button type="submit"
						class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left ui-icon-check" onClick="login($('#un').val(),$('#pw').val());">Sign
						in</button>
					        
				</div>
				    
			</form>
		</div>
	</div><!-- /page -->
		
<!--        <script type="text/javascript" src="js/jquery.min.js"></script>
        <script type="text/javascript" src="js/jquery.mobile.min.js"></script>
        <script type="text/javascript" src="js/jquery.ui.datepicker.js"></script>
        <script type="text/javascript" src="js/jquery.mobile.datepicker.js"></script>
        
		<script src="leaflet/leaflet.js"></script>
        <script type="text/javascript" src="js/RFIDNest.js"></script>
        <script type="text/javascript" src="js/index.js"></script>-->
        
    </body>
</html>

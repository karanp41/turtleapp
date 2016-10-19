/**
 * 
 */
var id="";
var ownID="turleDemo";
var interval=null;

var lat=59.9084561;
var long=10.734591;
var accurazy = "1";
var alt_lat="";
var alt_long="";
var alt_accurazy = "";
var msgType = "GTFRI";
var map = null;
var tags = [];
var allTags = {};
var curTag = "";
var curDbId = "";
var nestID = "";
var curPos =null;
var curCircle = null;
var username = "";
var rfidRunning;

function tableView(url,targets,sort){
	tabel = $('#hendelser').DataTable( {
        "bProcessing": true,
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": true,
        "bSort": true,
        "bJQueryUI": true,
        "dom": 'Bfrtip',
        "stateSave": false,
        "buttons": [
                "copyHtml5",
                { extend: 'excelHtml5', title: 'nests', extension: '.xlsx' },
//              "excelHtml5",
                "colvis"

        ],
        "oLanguage": {
         "sProcessing": "Henter informasjon. Vennligst vent...",
         "sLoadingRecords": "Vennligst vent. Henter informasjon....",
         "sEmptyTable":"Ingen hendelser funnet"
        },
                "bInfo": false,
        "bAutoWidth": true,
        "aaSorting": [[ sort, "asc" ]],
        "columnDefs": [
            {
                "targets": targets,
                "visible": false,
                "searchable": true
            },
            {
                "targets": [1],
                "type": "datetime",
                "format": "YYYY-MM-DD HH:mm"
            }
            ],
//        "sAjaxSource": "transactions.php"
        "ajax": url
    });

}

function showTemp(tag){
	curTag=tag;
	$.mobile.changePage("temp-view.php");
}

window.setInterval(function(){
	$.each(allTags,function(key,val){
		var now = Math.floor(new Date() / 1000);
		var diff = now - val;
//		alert (key+" is " +diff+ "old");
		if (diff > 10){
			//alert (key+" is " +diff+ ": too old");
			tags = jQuery.grep(tags, function(value) {
				return value != key;
			});
			$('#'+key).remove();
			$('#taglist').listview("refresh");

		}
	});
}, 5000);

function mapInit(){
	setTimeout(function(){
		map = L.map('map');
		map.options.maxZoom = 25;
//		map.on('locationfound', function (){alert("found");});
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap 2</a> contributors'
		}).addTo(map);
		updateMap();
//		map.locate({setView: true, maxZoom: 18, watch: false});
//		navigator.geolocation.getCurrentPosition(onLocationFound, function({alert("geo error");}));
	}, 1);
//	map.on('click', onMapClick);
	options = {maximumAge:600, timeout:50000, enableHighAccuracy: true};
	navigator.geolocation.getCurrentPosition(onLocationFound, function(){alert("no location found");}, options);
	setInterval(function(){
		options = {maximumAge:600, timeout:50000, enableHighAccuracy: true};
		navigator.geolocation.getCurrentPosition(onLocationFound, function(){alert("no location found");}, options);
	},10000);
}

function editNest(edNestID){
//	alert("editing "+edNestID);
	$.mobile.changePage("record-nest.html");
	$.ajax({
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		dataType:"json",
		url: "http://test.qrlogistic.com/turtleNestingSafe/ajax/findNests.php?un="+username+"&dbid="+edNestID,
		success: function(data) {
			
			var eventTime = (new Date(data[0].timestamp)).toDateString();
			var nestingDate = (new Date(data[0].nestingDate)).toDateString();
			$('#dbid').val(data[0].id);
			$('#rfid').val(data[0].rfid);
			$('#nestID').val(data[0].NestID);
			$('#species').val(data[0].specie).selectmenu("refresh");
			$('#gridcover').val(data[0].gridCover).selectmenu("refresh");
			$('#alt_lat').val(data[0].alt_lat);
			$('#alt_long').val(data[0].alt_long);
			$('#alt_loc').val(data[0].alt_lat + "," + data[0].alt_long);
			$('#lat').val(data[0].origLat);
			$('#long').val(data[0].origLong);
			$('#loc').val(data[0].origLat + 	"," + data[0].origLong);
			$('#alt_date').val(data[0].alternationTime);
			$('#alt_drySand').val(data[0].alt_drySand);
			$('#alt_wetSand').val(data[0].alt_wetSand);
			$('#alt_diaEggChamb').val(data[0].origLong);
			$('#alt_dmgEggs').val(data[0].alt_dmgEggs);
			$('#alt_totEggs').val(data[0].alt_totEggs);
			$('#nestingDate').attr("disabled");
			$('#certain').val(data[0].certain);
			$('#wetZone').val(data[0].wetZone);
			$('#drySandZone').val(data[0].drySandZone);
			$('#vegetation').val(data[0].vegetation);
			$('#dist').val(data[0].distanceFromSea);
			$('#leftLandMark').val(data[0].leftLandMark).selectmenu("refresh");
			$('#leftMarkNum').val(data[0].leftMarkNum);
			$('#leftMarkDist').val(data[0].leftMarkDist);
			$('#rightLandMark').val(data[0].rightLandMark).selectmenu("refresh");
			$('#rightMarkNum').val(data[0].rightMarkNum);
			$('#rightMarkDist').val(data[0].rightMarkDist);
			$('#nestLoc').val(data[0].nestLoc).selectmenu("refresh");
			$('#turtleId').val(data[0].turtleId);
			
			$('#successfulButton').html("Save").button("refresh");
			$('#unsuccessfulButton').attr("display", "none").button("refresh");
		}	
	});
}


function updateMap(){
	$.ajax({
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		
		url: "http://test.qrlogistic.com/turtleNestingSafe/ajax/listNests.php?un="+username,
		success: function(data) {
			$.each( data, function( key, val ) {
				//rigLat);
				circle = new L.circle([val.origLat, val.origLong], 5, {
				    color: 'red',
				    fillColor: '#f03',
				    fillOpacity: 0.5
				});
				circle.bindPopup("<b>Nest ID: "+val.NestID+"</b><br />Nestingdate: "+val.nestingDate+
					"<br/><button onClick='processTag(\""+val.rfid+"\");' value='nestInfo'>nestInfo</button>").addTo(map);
			});

		},
		dataType:"json"
		});
	map.invalidateSize();
}

function populateNestList(){
	$.ajax({
//		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
//		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: "http://test.qrlogistic.com/turtleNestingSafe/ajax/listNests.php?un="+username,
		success: function(data) {
			$.each( data, function( key, val ) {
				$('#nestList').append("<li>"+
//						"<a href='#' onClick='processTag(\""+val.rfid+"\");'><b>Nest ID: "+val.NestID+"</b><br />Nestingdate: "+val.nestingDate+"</a></li>");
						"<a href='#' onClick='processTagDbId(\""+val.id+"\");'><b>Nest ID: "+val.NestID+"</b><br />Nestingdate: "+val.nestingDate+"</a></li>");
			});
			$('#nestList').listview("refresh");
		},
		dataType:"json"
		});
	
}

function onLocationFound(position) {
	var latlng =L.latLng(position.coords.latitude , position.coords.longitude);
	var radius = position.coords.accuracy / 2;
	if (curPos == null){
//	if (curPos == null){
		map.setView(latlng,16);
		curPos = L.marker(latlng).addTo(map);
		curCircle = L.circle(latlng, radius).addTo(map);
	} else {
		curPos.setLatLng(latlng).update();
		curCircle.setLatLng(latlng).update();
		curCircle.setRadius(radius).update();
	}
//	.bindPopup("You are within " + radius + " meters from this point"); 

}



function locate(){
	id = getQueryVariable("id");
	$("#id").html("RequestID="+id);
	options = { enableHighAccuracy: true, timeout: 120000 };
	//options = {maximumAge:60000, timeout:50000, enableHighAccuracy: true};
	//navigator.geolocation.getCurrentPosition(onGotLocation, onError, options);
//	navigator.geolocation.watchPosition(onGotLocation, onError, options);
	i = 0;
	text = "Finding location";
	interval = setInterval(function() {
		$("#location").html(text+Array((++i % 4)+1).join("."));
		if (i===10) text = "Finding location";
	}, 500);
}

function locateGSM(){
	options = { enableHighAccuracy: false, timeout: 20000 };
	navigator.geolocation.getCurrentPosition(onGotLocation, onError, options);
	i = 0;
	text = "Finding location";
//	interval = setInterval(function() {
//	$("#location").html(text+Array((++i % 4)+1).join("."));
//	if (i===10) text = "Finding location";
//	}, 500);
}


function onGotLocation(position){
//	alert(position.coords.latitude.toFixed(5)+", "+position.coords.longitude.toFixed(5));
	$("#loc").val(position.coords.latitude.toFixed(5)+", "+position.coords.longitude.toFixed(5));
	$("#loc").button("refresh");
	lat = position.coords.latitude;
	long = position.coords.longitude;
	$("#lat").val(position.coords.latitude);
	$("#long").val(position.coords.longitude);
	$("#accurazy").val(position.coords.accurazy);
	accurazy = position.coords.accurazy;
}

function getCurLoc(){
	options = {maximumAge:600, timeout:50000, enableHighAccuracy: true};
	navigator.geolocation.getCurrentPosition(onGotLocation, function(){alert("no location found");}, options);
}

function altGetCurLoc(){
	options = {maximumAge:600, timeout:50000, enableHighAccuracy: true};
	navigator.geolocation.getCurrentPosition(altGetCurLocSuccess, function(){alert("no location found");}, options);
}

function altGetCurLocSuccess(position){
	$("#alt_loc").val(position.coords.latitude.toFixed(5)+", "+position.coords.longitude.toFixed(5));
	$("#alt_loc").button("refresh");
	alt_lat = position.coords.latitude;
	alt_long = position.coords.longitude;
	alt_accurazy = position.coords.accurazy;
	$("#alt_lat").val(position.coords.latitude);
	$("#alt_long").val(position.coords.longitude);
	$("#alt_accurazy").val(position.coords.accurazy);
}

function onError(msg){
	//alert("error: "+msg);
	clearInterval(interval);
	$("#location").html("couldn't get your position. Trying GSM");
	options = { enableHighAccuracy: false, timeout: 20000 };
	navigator.geolocation.getCurrentPosition(onGotLocation, onErrorGSM, options);
	map.on('locationfound', onLocationFound);
}

function onErrorGSM(msg){
	//alert("error: "+msg);
	clearInterval(interval);
	$("#location").html("couldn't get your position at all.");
}


function record(){
	var success = $("#success").is(':checked') ? 1 : 0;
	alert(success);
}

function scanRFID(){
	Caenrfid.scanRFID(function(data){rfidRunning=true;scanRFIDSuccess(data.substring(4)+"");navigator.notification.beep(1);},function (err){alert("error"+err)});    
}

function stopRFID(){
	rfidRunning = false;
	Caenrfid.stopRFID(function(data){alert("rfid stopped");},function (err){alert("error"+err)});    
}

function scanRFIDSuccess(rfid){
	var hex = rfid;
	$('#rfidHEX').val(hex);
	$('#rfid').val(hex);
//	$.ajax({
//	beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
//	complete: function() { $.mobile.loading('hide'); }, //Hide spinner
//	url: "http://capture.qrlogistic.com/hextoepc.php?hex="+hex,
//	success: function(data) {
//	$('#rfid').val(data);
//	}
//	});
}

function confirm(func){
	  $(function() {
	    $( "#dialog-confirm" ).dialog({
	      resizable: false,
	      height:140,
	      modal: true,
	      buttons: {
	        "Yes": function() {
	          $( this ).dialog( "close" );
	          func();
	        },
	        Cancel: function() {
	          $( this ).dialog( "close" );
	        }
	      }
	    });
	  });
}

function showDataInConfirm(){
	var fields=$('#NestData').serializeArray();
	
	$( "#summaryNewRec" ).empty();
	$( "#summaryNewRec" ).append( "test" );
    jQuery.each( fields, function( i, field ) {
      $( "#summaryNewRec" ).append(field.name+":" +field.value + "<br/> " );
    });
    
}

function recordNewNest(){
	var disabled = $('#NestData').find(':input:disabled').removeAttr('disabled');
	var content=$('#NestData').serialize();
	disabled.attr('disabled','disabled');
	var url = "http://test.qrlogistic.com/turtleNestingSafe/ajax/addNest.php?un="+username+"&mac="+ownID+"&"+content;
	$.ajax({
 		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: url,
		success: function(data) {
			$.mobile.changePage("index.html");
			alert("Nest data recorded");
		}
	});
}

function recordNewNestUnsuccessful(){
	$('#rfid').val("");
	var disabled = $('#NestData').find(':input:disabled').removeAttr('disabled');
	var content=$('#NestData').serialize();
	disabled.attr('disabled','disabled');
	var url = "http://test.qrlogistic.com/turtleNestingSafe/ajax/addNest.php?un="+username+"&mac="+ownID+"&"+content;
	$.ajax({
 		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: url,
		success: function(data) {
			$.mobile.changePage("index.html");
			alert("Nest data recorded");
		}
	});
}

function recordPerdation(){
	var content=$('#PredationData').serialize();
	var url = "http://test.qrlogistic.com/turtleNestingSafe/ajax/recordPerdation.php?un="+username+"&mac="+ownID+"&"+content;
	$.ajax({
 		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: url,
		success: function(data) {
			$.mobile.changePage("index.html");
			alert("Perdation data recorded");
		}
	});
}


function recordEmerg(){
	var content=$('#EmergData').serialize();
	var url = "http://test.qrlogistic.com/turtleNestingSafe/ajax/recordEmergence.php?un="+username+"&mac="+ownID+"&"+content;
	$.ajax({
 		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: url,
		success: function(data) {
			$.mobile.changePage("index.html");
			alert("Emergence data recorded");
		}
	});
}

function recordUncover(){
	alert("Almost finished :)");
//	var content=encodeURIComponent($('#UncoverData').serialize());
//	var url = "http://capture.qrlogistic.com/?hex="+$('#rfidHEX').val()+"&mac="+ownID+"&antenna=0&latitude="+lat+"&longitude="+long+"&accurazy="+accurazy+"&content="+content+"&msg=TURTLE_UNCOVER";
//
//	//alert(url);
//	$.ajax({
//		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
//		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
//		url: url,
//		success: function(data) {
//			$.mobile.changePage("index.html");
//			alert("Uncover data recorded");
//		}
//	});
}

function populateNests(){
	var url = "http://gpstest.hrafn.no/ajax/getDeviceLastPos.php?un="+username+"&mac=turleDemo&count=10";
	$.ajax({
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: url,
		success: function(data) {
			$.each(data, function (key, val) {
//				$('#nests-list').append("<li><a href='#' onClick=\"searchRFID('"+val.epc+"');\">"+val.epc+"<br/><small>"+val.content+"</small></li>").listview( "refresh" );
				$('#nests-list').append("<li><a href='#' onClick=\"searchRFID('"+val.epc+"');\">"+val.epc+"<br/><small>"+val.content+"</small></li>").listview( "refresh" );
			});
		}
	});
}


function searchRFID(rfidSearch){
	Caenrfid.scanRFID(function(data){searchRFIDSuccess(data.substring(4)+"",rfidSearch);},function (err){alert("error"+err)});    
}

function scanOnce(){
	rfidRunning = 1;
	Caenrfid.scanRFID(function(data){scanOnceSuccess(data.substring(4)+"");},function (err){alert("error"+err)});
}

function scanOnceSuccess(rfid){
	
	//alert(rfidRunning+"");
	if ($.inArray(rfid,tags)==-1){
		if (rfidRunning==1){
			stopRFID();
			
			alert("running and true");
		}
		if ($('#rfid').val()==""){
			alert(rfid);
			$('#rfid').val(rfid+"");
		}
		tags.push(rfid);
	}
}

function dummyRead(rfidSearch){
	var random = Math.floor(Math.random() * (999 - 100)) + 100;
	searchRFIDSuccess("3415AF99E800000000000"+random,rfidSearch)
	return "testing";
}

function searchRFIDSuccess(rfid,search){
	var hex = rfid;
	if ($.inArray(rfid,tags)==-1){
		navigator.notification.beep(2);
		$.ajax({
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
			complete: function() { $.mobile.loading('hide'); }, //Hide spinner
//			url: "http://capture.qrlogistic.com/hextoepc.php?hex="+hex,
			url: "http://test.qrlogistic.com/turtleNestingSafe/ajax/findNests.php?un="+username+"&rfid="+hex,
			dataType:"json",
			success: function(data) {
				var output = "<li id='"+hex+"' hex='"+hex+"'>"+data[0].NestID+"</li>";
				$('#taglist').append(output).listview('refresh');
				var selector = '#'+hex+'';
				$(selector).on("click",nestListClick);
				data=" "+data+" ";
//				if (data.indexOf(search)>-1){
//					navigator.notification.beep(1)
//				}
			}
		});
		tags.push(rfid);
	}   
	allTags[rfid] = Math.floor(new Date() / 1000);
}


function checkInfo(tag){
	
	var value=false;
	$.ajax({
//		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
//		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: "http://test.qrlogistic.com/turtleNestingSafe/ajax/findNests.php?un="+username+"&rfid="+tag,
		async:false,
		success: function(data) {
			if (data.length>0){
				value = 1;
			}else{
				value = false;
			}

		},
		dataType:"json"
		});
//	if (tag=="test-Nest1"){
//		return 1;
//	}
//	return false;
	return value;
}

function processTag(tag){
	if(rfidRunning == true){
		//alert("Stopping RFID");
		stopRFID();
	} else{
		//alert("RFID not running");
	}
	curTag = tag;
	switch (checkInfo(tag)) {
	case false:
		$("body").pagecontainer("change", "record-nest.html", {reloadPage: true});
		$("#rfid").val(curTag);
		break;
	case 1:
		$("body").pagecontainer("change", "nestInfo.html", {reloadPage: true});
		break;
	default:
		break;
	}
}

function processTagDbId(id){
	if(rfidRunning == true){
		//alert("Stopping RFID");
		stopRFID();
	} else{
		//alert("RFID not running");
	}
	curDbId= id;
	$("body").pagecontainer("change", "nestInfo.html", {reloadPage: true});
}

function populateNestInfo(curTag){
	$("#nestInfo").html("");
	$.ajax({
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: "http://test.qrlogistic.com/turtleNestingSafe/ajax/findNests.php?un="+username+"&rfid="+curTag+"&dbid="+curDbId,
		success: function(data) {
			
			var eventTime = (new Date(data[0].timestamp)).toDateString();
			var nestingDate = (new Date(data[0].nestingDate)).toDateString();
			
			var htmlInfo = "<div data-role='collapsible' ><h3>"+data[0].NestID+"</h3><p><div class='ui-grid-a'>";
			$.each(data[0],function (key,val){
				htmlInfo = htmlInfo + "<div class='ui-block-a'><div class='ui-bar ui-bar-a' style='height:30px'>"+key+"</div></div>"+
				"<div class='ui-block-b'><div class='ui-bar ui-bar-a' id='nest"+key+"' style='height:30px'>"+val+"</div></div>";
			});
			nestID = data[0].NestID;
			curDbId = data[0].id;
			curTag = data[0].rfid;
			htmlInfo = htmlInfo + "</div><!-- /grid-a --></p></div>";
//			$("#nestInfo").html(htmlInfo);
			if (data[0].adoptId != ""){
				$("#linkaAdoptAnestButton").button( "disable" );
			}
			if (data[0].tempCount != "" && data[0].tempCount>0 ){
				$("#showTempLog").removeAttr("disabled");
				$("#showTempLog").attr("onClick", "showTemp('"+curTag+"');");
			} else {
				$("#showTempLog").attr("disabled", "disabled");
			}
//			
			$("#nestInfo").html(htmlInfo);
	
			fillPredationTable(curTag);
		},
		dataType:"json"
		});
	
//			$.each( data[0], function( key, val ) {
//				var curhtml = $("#nestInfo").html();
//				$("#nestInfo").html(curhtml+key+": " + val +"<br/>");
//			});
			
	
//	var jsonDummy = '{"hex":"testhex1",'+
//	'"nestId":"id1",'+
//	'"recordedDate":"2015-01-23T12:15:01Z"}';
//	var jsonInfo =  $.parseJSON(jsonDummy);
//	$.each(jsonInfo,function (key,value){
//		var curhtml = $("#nestInfo").html();
//		$("#nestInfo").html(curhtml+key+": " + value +"<br/>");
//	});
}

$(document).on('pageinit','#recordNestPage', function(){
	getCurLoc();
	$('#rfid').val(curTag);
	$('#rfidHEX').val(curTag);
});


$(document).on('pageinit','#nestInfoPage', function(){
	populateNestInfo(curTag);
});

$(document).on('pageinit','#tablePage', function(){
	tableView("http://test.qrlogistic.com/turtleNestingSafe/ajax/listNests.php?un=dekamer&output=aaData",[ 1,3,4,6,7,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53 ],4);
});

$(document).on('pageinit','#tempView', function(){
	tableView("http://test.qrlogistic.com/turtleNestingSafe/ajax/getTemp.php?rfid="+curTag+"&output=aaData",[ 0,2,3 ],1);
//	$( "#tabs").tabs();

});


$(document).on('pageinit','#mainPage', function(){
	curCircle=null;
	curPos=null;
	mapInit();
});

$(document).on('pageshow','#mainPage', function(){
//	updateMap();
});

$(document).on('pageinit','#predationPage', function(){
	$('#locationPred').html(lat.toFixed(5)+", "+long.toFixed(5));
	$('#rfid').val(curTag);
	$('#nestID').val(nestID);
});

$(document).on('pageinit','#emergPage', function(){
	$('#locationEmerg').html(lat.toFixed(5)+", "+long.toFixed(5));
	$('#rfid').val(curTag);
	$('#nestID').val(nestID);
});

$(document).on('pageinit','#uncoverPage', function(){
	$('#locationUncover').html(lat.toFixed(5)+", "+long.toFixed(5));
	$('#rfid').val(curTag);
	$('#nestID').val(nestID);
});

$(document).on('pageinit','#nestListPage', function(){
	populateNestList();
});

$(document).on('popupafteropen','#popupConfirm', function () {
	showDataInConfirm();
});

function nestListClick() {
	processTag($(this).attr('hex'));
}

$("#taglist li").not('.emptyMessage').on("click",nestListClick);

function login(un,pw){
	var url="http://test.qrlogistic.com/turtleNestingSafe/ajax/login.php?un="+un+"&psw="+pw;
	$.ajax({
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: url,
		success: function(data) {
			if (data.response=="1"){
				alert(un+" logged in.");
				username = un;
//				$('button').button( "enable" );
				//function() { $.mobile.loading('hide'); }, //Hide spinner
				localStorage.setItem("turtle_nesting_username", un);
				
			}else{
				alert("Username or password incorrect");
				username ="";
				$('button').button( "disable" );
			}

		},
		dataType:"json"
		});
}

function linkAdoptANest(){
	cordova.plugins.barcodeScanner.scan(
		      function (result) {
		          alert("We got a barcode\n" +
		                "Result: " + result.text + "\n" +
		                "Format: " + result.format + "\n" +
		                "Cancelled: " + result.cancelled);
		          var qr = result.text.split("=");
		          qr = qr[1];
		          var url="http://test.qrlogistic.com/turtleNestingSafe/ajax/linkAdoptNest.php?rfid="+curTag+"&username="+username+"&qr="+qr;
		      		$.ajax({
		      		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		      		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		      		url: url,
		      		success: function(data) {
		      			if (data.response=="1"){
		      				alert("Nest linked to AdoptANest system.");
		      			}else{
		      				alert("Something went wrong.");
		      			}

		      		},
		      		dataType:"json"
		      		});
		      }, 
		      function (error) {
		          alert("Scanning failed: " + error);
		      }
		   );
}

function fillPredationTable(){

tabel = $('#hendelser').DataTable( {
        "bProcessing": true,
        "bPaginate": false,
        "bLengthChange": false,
        "bFilter": true,
        "bSort": true,
        "bJQueryUI": true,
        "dom": 'Bfrtip',
        "stateSave": true,
        "buttons": [
                "copyHtml5",
                { extend: 'excelHtml5', title: 'predation', extension: '.xlsx' },
//              "excelHtml5",
                "pdfHtml5",
                "colvis"

        ],
        "oLanguage": {
         "sProcessing": "Henter informasjon. Vennligst vent...",
         "sLoadingRecords": "Vennligst vent. Henter informasjon....",
                  "sEmptyTable":"Ingen hendelser funnet"
	         },
	                 "bInfo": false,
	         "bAutoWidth": true,
	         "aaSorting": [[ 0, "asc" ]],
	         "columnDefs": [
	             {
	                 "targets": [ 1 ],
	                 "visible": false,
	                 "searchable": true
	             },
	             {
	                 "targets": [4],
	                 "type": "datetime",
	                 "format": "YYYY-MM-DD HH:mm"
	             }
	             ],
	 //        "sAjaxSource": "transactions.php"
	         "ajax": "http://test.qrlogistic.com/turtleNestingSafe/ajax/listNests.php?un=dekamer&output=aaData"
	     });


}

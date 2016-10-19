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
	navigator.geolocation.getCurrentPosition(onLocationFound, function(){/*alert("no location found");*/}, options);
	//	navigator.geolocation.watchPosition(onLocationFound, function(){alert("no location found");}, options);
	setInterval(function(){
		options = {maximumAge:600, timeout:50000, enableHighAccuracy: true};
		navigator.geolocation.getCurrentPosition(onLocationFound, function(){alert("no location found");}, options);
	},10000);
}

function mapInitFind(rfid){
	
	setTimeout(function(){
		map = L.map('map');
		map.options.maxZoom = 25;
	//		map.on('locationfound', function (){alert("found");});
		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap 2</a> contributors'
		}).addTo(map);
		updateMapFind(rfid);
	//		map.locate({setView: true, maxZoom: 18, watch: false});
	//		navigator.geolocation.getCurrentPosition(onLocationFound, function({alert("geo error");}));
	}, 1);
	//	map.on('click', onMapClick);
	options = {maximumAge:600, timeout:50000, enableHighAccuracy: true};
	navigator.geolocation.getCurrentPosition(onLocationFound, function(){/*alert("no location found");*/}, options);
	//	navigator.geolocation.watchPosition(onLocationFound, function(){alert("no location found");}, options);
	setInterval(function(){
		options = {maximumAge:600, timeout:50000, enableHighAccuracy: true};
		navigator.geolocation.getCurrentPosition(onLocationFound, function(){alert("no location found");}, options);
	},10000);
}

function findNest(tag){
	curTag=tag;
	$.mobile.changePage("findNest.html");	
}


function editNest(edNestID){
	//	alert("editing "+edNestID);
	$.mobile.changePage("record-nest.html");
	$.ajax({
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		dataType:"json",
		url: HOST + API_PATH + "findNests.php?un="+username+"&dbid="+edNestID,
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
			
		url: HOST + API_PATH + "listNests.php?un="+username,
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

function updateMapFind(rfid){
	console.log(rfid)
	window.markers = [];

	var requestData = {};
	requestData.id = rfid;

	$.ajax({
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner		
		// url: HOST + API_PATH + "listNests.php?rfid="+rfid+"&un="+username+"&dbid="+curDbId,
		url: HOST + API_PATH + FIND_NESTS,
		data:requestData,
		type: "POST",
		success: function(data) {
			console.log(data)
			val = data.data.Nest;
			console.log(val.origLat, val.origLong)
			// $.each( data.data.Nest, function( key, val ) {
				// console.log(val)
				window.markers.push(new L.LatLng(val.origLat, val.origLong));
				//alert(window.markers.length);
				circle = new L.circle([val.origLat, val.origLong], 5, {
				    color: 'orange',
				    fillColor: '#f09',
				    fillOpacity: 0.5
				});
				circle.bindPopup("<b>Nest ID: "+val.NestID+"</b><br />Nestingdate: "+val.nestingDate+
					"<br/><button onClick='processTag(\""+val.rfid+"\");' value='nestInfo'>nestInfo</button>").addTo(map);
			// });

		},
		dataType:"json"
		});
	map.invalidateSize();
}


function populateNestList(){
	var data = {user_id:localStorage.getItem('user_id')}
	$.ajax({
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: HOST + API_PATH + LIST_NESTS,
		data:data,
		type: "POST",
		success: function(data) {
			$.each( data.data, function( key, val ) {
				$('#nestList').append("<li>"+
					//	"<a href='#' onClick='processTag(\""+val.rfid+"\");'><b>Nest ID: "+val.NestID+"</b><br />Nestingdate: "+val.nestingDate+"</a></li>");
					"<a href='#' onClick='processTagDbId(\""+val.Nest.id+"\");'><b>Nest ID: "+val.Nest.NestID+"</b><br />Nestingdate: "+val.Nest.nestingDate+"</a></li>");
			});
			
			function refreshList(){
			  	//$('#nestList').listview("refresh");
			}
			setTimeout(refreshList, 1000);
		},
		dataType:"json"
		});
	
}

function populateTurtlesList(){
	var data = {user_id:localStorage.getItem('user_id')}
	$.ajax({
		//		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		//		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		// url: HOST + API_PATH + "listTurtles.php?un="+username,
		url: HOST + API_PATH + LIST_TURTLES,
		data:data,
		type: "POST",
		success: function(data) {
			$.each( data.data, function( key, val ) {
				console.log(val)
				$('#turtlesAutoComplete').append("<li>"+
				//"<a href='#' onClick='processTag(\""+val.rfid+"\");'><b>Nest ID: "+val.NestID+"</b><br />Nestingdate: "+val.nestingDate+"</a></li>");
				"<a href='#' onClick='$(\"#turtleTagID\").val(\""+val.Turtle.tagID+"\");$(\"#turtleId\").val(\""+val.Turtle.id+"\");$(\"#turtlesAutoComplete\").hide();'>"+val.Turtle.tagID+"("+val.Turtle.replacedID+")</a></li>");
			});
			
			function refreshList(){
			  	$('#turtlesAutoComplete').listview("refresh");
			}
			setTimeout(refreshList, 500);
		},
		dataType:"json"
		});
	
}


function populateTurtlesListView(){
	var data = {user_id:localStorage.getItem('user_id')}
	$.ajax({
		//		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		//		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: HOST + API_PATH + LIST_TURTLES,
		data:data,
		type: "POST",
		success: function(data) {
			console.log(data)
			$.each( data.data, function( key, val ) {
				console.log('val',val)
				$('#turtlesList').append("<li>"+
					//	"<a href='#' onClick='processTag(\""+val.rfid+"\");'><b>Nest ID: "+val.NestID+"</b><br />Nestingdate: "+val.nestingDate+"</a></li>");
					"<a href='#' onClick='viewTurtle(\""+val.Turtle.tagID+"\");'>"+val.Turtle.tagID+"("+val.Turtle.replacedID+")</a></li>");
			});
			$('#turtlesList').listview("refresh");
		},
		dataType:"json"
	});
	
}


function onLocationFound(position) {
	var latlng = L.latLng(position.coords.latitude , position.coords.longitude);
	var radius = position.coords.accuracy / 2;
	if (curPos == null){
	//	if (curPos == null){
		map.setView(latlng,16);
		curPos = L.marker(latlng).addTo(map);
		curCircle = L.circle(latlng, radius).addTo(map);
	} else {
		curPos.setLatLng(latlng).update();
		curCircle.setLatLng(latlng);
		curCircle.setRadius(radius);
	}
	//	.bindPopup("You are within " + radius + " meters from this point");
	var polyline_options = {
		    color: 'red'
		  };
	var line = [];	
	line.push(latlng);
	line.push(new L.latLng(window.markers[0].lat,window.markers[0].lng));
	if (window.polyline == null){
		window.polyline = L.polyline(line, polyline_options).addTo(map);
	} else {
		window.polyline.setLatLngs(line).addTo(map);
	}
	
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
	if (watchID!=null)
	navigator.geolocation.clearWatch(watchID);
	options = {maximumAge:600, timeout:50000, enableHighAccuracy: true};
	watchID = navigator.geolocation.watchPosition(onGotLocation, function(){/*alert("no location found");*/}, options);
	//	navigator.geolocation.getCurrentPosition(onGotLocation, function(){alert("no location found");}, options);
}

function altGetCurLoc(){	

    // navigator.geolocation.getCurrentPosition(altGetCurLocSuccess, onError);
    navigator.geolocation.watchPosition(altGetCurLocSuccess, onError, POS_OPTIONS);
    // navigator.geolocation.getCurrentPosition(altGetCurLocSuccess, function(){/*alert("no location found");*/}, options);

    function onError(error) {
    	console.log(error);
    }
}

function altGetCurLocSuccess(position){
	
	console.log(position);

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
	$.mobile.loading('hide');
	rfidRunning = false;
	Caenrfid.stopRFID(function(data){alert("rfid stopped");},function (err){alert("error"+err)});
	
}

function saveToFile(data){
	window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
        console.log("got main dir",dir);
        dir.getFile("log.txt", {create:true}, function(file) {
            console.log("got the file", file);
            logOb = file;
            writeLog(data);          
        });
    });
}

function writeLog(str) {
	
    if(!logOb) return;
    var log = str + " [" + (new Date()) + "]\n";
    console.log("going to log "+log);
    alert(logOb);
    logOb.createWriter(function(fileWriter) {
        
        fileWriter.seek(fileWriter.length);
        
        var blob = new Blob([log], {type:'text/plain'});
        fileWriter.write(blob);
        console.log("ok, in theory i worked");
    }, fail);
}

function copyToClipboard() {
	var data= $('#tempData').val();
	cordova.plugins.clipboard.copy(data);
	alert("TempData copied: "+data );
}

function openFile(tagid){
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
		var fileDate = new Date();
		var filename = tagid + "_" + fileDate.getFullYear()+("0"+(fileDate.getMonth()+1)).slice(-2)+("0"+fileDate.getDate()).slice(-2)+("0"+fileDate.getHours()).slice(-2)+("0"+fileDate.getMinutes()).slice(-2);
		  //  console.log("got main dir",dir);
		  //  alert("got main dir");
		    dir.getFile(filename + ".csv", {create:true}, function(file) {
		        console.log("got the file", file);
		        logOb = file;
		        if (tagid!="newNest")
		        	saveToFile();
		    });
		});
}

function saveToFile(){
	var data = $('#tempData').val();
	
	 if(!logOb) return;
	 //var log = data + " [" + (new Date()) + "]\n";
	 var log = data;
	// console.log("going to log "+log);
	 logOb.createWriter(function(fileWriter) {
		 //fileWriter.seek(fileWriter.length);

		 var blob = new Blob([log], {type:'text/plain'});
		 fileWriter.write(blob);
		 alert("file written");
	 },  function fail(e) {
			alert("FileSystem Error");
			alert(e);
	 });
}

function saveEventToFile(event){
	
	
	if(!logOb) return;
	 //var log = data + " [" + (new Date()) + "]\n";
	// console.log("going to log "+log);
	 logOb.createWriter(function(fileWriter) {
		 //fileWriter.seek(fileWriter.length);

		 var blob = new Blob([event], {type:'text/plain'});
		 fileWriter.write(blob);
		 alert("file written" + event);
	 },  function fail(e) {
			alert("FileSystem Error");
			alert(e);
	 });
}

function readFromFile(filename){
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
        console.log("got main dir",dir);
        dir.getFile(filename, {create:false}, function(file) {
            console.log("got the file", file);
            logOb = file;
        });
    });
	 logOb.file(function(file) {
		 var reader = new FileReader();

		 reader.onloadend = function(e) {
	//			 alert("inside"+this.result);
			 plotTemperature(this.result,false);
		 };

		 reader.readAsText(file);
	 }, function fail(e) {
			alert("FileSystem Error");
			alert(e);
	 });
}

function renameFile(currentName, currentDir, newName, successFunction) {

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {

        fileSystem.root.getFile(currentDir + currentName, null, function (fileEntry) {
            fileSystem.root.getDirectory(currentDir, {create: true}, function (dirEntry) {
                parentEntry = new DirectoryEntry(currentName, currentDir + currentName);

                fileEntry.moveTo(dirEntry, newName, function () {

                    successFunction();

                }, renameFail);
            }, renameFail);
        }, renameFail);

    }, renameFail);
}

function uploadTempFromFile(filename){
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
        console.log("got main dir" + filename,dir);
        dir.getFile(filename, {create:false}, function(file) {
            console.log("got the file", file);
            logOb = file;
        });
    });
	 logOb.file(function(file) {
		 var reader = new FileReader();

		 reader.onloadend = function(e) {
			 //alert("inside:"+this.result);
			 $.ajax({
					beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
					complete: function() { $.mobile.loading('hide'); }, //Hide spinner
					type: "POST",
					url: HOST + API_PATH + "uploadTemp.php?un="+un,
					data: this.result,
					success: function(data) {
						//$.mobile.changePage("index.html");
						alert(data);
						logOb.remove(function(file){
				            console.log("File removed!");
				            listOfflineTemps();
				        },function(){
				            console.log("error deleting the file " + error.code);
				            });
					},
					error: function(data) {
						alert("Something went wrong. Error message: " + data);
					}
				});
	//			 plotTemperature(this.result,false); Should be to execute eent into database.
		 };

		 reader.readAsText(file);
	 }, function fail(e) {
			alert("FileSystem Error");
			alert(e);
	 });
}


function readEventFromFile(filename){
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
        console.log("got main dir" + filename,dir);
        dir.getFile(filename, {create:false}, function(file) {
            console.log("got the file", file);
            logOb = file;
        });
    });
	 logOb.file(function(file) {
		 var reader = new FileReader();

		 reader.onloadend = function(e) {
			 //alert("inside:"+this.result);
			 $.ajax({
					beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
					complete: function() { $.mobile.loading('hide'); }, //Hide spinner
					url: this.result,
					success: function(data) {
						//$.mobile.changePage("index.html");
						alert("Nest data recorded");
					},
					error: function(data) {
						alert("Something went wrong. Error message: " + data);
					}
				});
	//			 plotTemperature(this.result,false); Should be to execute eent into database.
		 };

		 reader.readAsText(file);
	 }, function fail(e) {
			alert("FileSystem Error");
			alert(e);
	 });
}


function listOfflineTemps(){
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,
		    function (fileSystem) {
		      var reader = fileSystem.createReader();
		      var list="";
		      reader.readEntries(
		        function (entries) {
		        	var i;
		        	var htmlInset = ""; 
		        	for (i=0; i<entries.length; i++) {
		        		if (typeof entries[i] == 'undefined'){
		        			continue;
		        		}
		        		$("#fileList").html("");
		        		htmlInset += "<li><a href='#' onclick='readFromFile(\""+entries[i].name+"\");'>"+
						"<h3>"+entries[i].name+"</h3></a> ";
		        		if (entries[i].name.search("finished_")==-1){
		        			htmlInset += "<a href='#' onclick='uploadTempFromFile(\""+entries[i].name+"\");'>upload</a> ";
		        		}
						htmlInset += "</li>";
		        	}
		        	$("#fileList").html(htmlInset);
		        	$("#fileList").listview('refresh');
		        	
		        },
		        function (err) {
		          alert(err);
		        }
		      );
		      //alert(list);
		    }, function (err) {
		      alert(err);
		    }
		  );
}

function listOfflineEvents(){
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,
		    function (fileSystem) {
		      var reader = fileSystem.createReader();
		      var list="";
		      reader.readEntries(
		        function (entries) {
		        	var i;
		        	var htmlInset = ""; 
		        	for (i=0; i<entries.length; i++) {
		        		if (typeof entries[i] == 'undefined'){
		        			continue;
		        		}
		        		$("#fileList").html("");
		        		htmlInset += "<li><a href='#' onclick='readEventFromFile(\""+entries[i].name+"\");'>"+
						"<h3>"+entries[i].name+"</h3></a> ";
		        		if (entries[i].name.search("finished_")==-1){
		        			htmlInset += "<a href='#' onclick='alert(\"upload data\");'>1st link</a> ";
		        		}
						htmlInset += "</li>";
		        	}
		        	$("#offlineList").html(htmlInset);
		        	$("#offlineList").listview('refresh');
		        	
		        },
		        function (err) {
		          alert(err);
		        }
		      );
		      //alert(list);
		    }, function (err) {
		      alert(err);
		    }
		  );
}

function readTemp(){
	$.mobile.loading( 'show', {
		text: 'Loading temperature',
		textVisible: true,
		theme: 'z',
		html: ""
	});
	var power = $('#pow').val();
	Caenrfid.readTemp(function(data){
		$('#tempData').val(data);
		plotTemperature(data,true);
		listOfflineTemps();
		$.mobile.loading( 'hide');
	},function (err){alert("error"+err)},[power]);
}

function plotTemperature(data,write){
	
	jsonData = $.parseJSON(data);
	$.each(jsonData,function (key,value){
		if (write)
			openFile(key);
		var data2 = eval(value);
		$("#chartdiv").html("");
		var plot1 = $.jqplot("chartdiv", [data2], {
            seriesColors: ["rgba(78, 135, 194, 0.7)"],
            title: 'Temperature plot:'+key,
            highlighter: {
                show: true,
                sizeAdjust: 1,
                tooltipOffset: 9
            },
            grid: {
                background: 'rgba(57,57,57,0.0)',
                drawBorder: false,
                shadow: false,
                gridLineColor: '#666666',
                gridLineWidth: 2
            },
            legend: {
                show: false,
                placement: 'outside'
            },
            seriesDefaults: {
                rendererOptions: {
                    smooth: true,
                    animation: {
                        show: true
                    }
                },
                showMarker: false
            },
            series: [
                {
                    fill: false,
                    label: key
                }
            ],
            axesDefaults: {
                rendererOptions: {
                    baselineWidth: 1.5,
                    baselineColor: '#444444',
                    drawBaseline: false
                }
            },
            axes: {
                xaxis: {
                    renderer: $.jqplot.DateAxisRenderer,
                    tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                    tickOptions: {
                        formatString: "%b %e %H:%M:%S'",
                        angle: -30,
                        textColor: '#dddddd'
                    },
                    
                    tickInterval: "1 hour",
                    drawMajorGridlines: false
                },
                yaxis: {
                    
                    pad: 0,
                    rendererOptions: {
                        minorTicks: 1
                    },
                    tickOptions: {
                        formatString: "%'dC",
                        showMark: false
                    }
                }
            }
        });
	});
	

}

function showTemp(){

	var prevYear = [["2016-04-10 21:23:59",23.0],["2016-04-10 21:25:51",23.0],["2016-04-10 21:26:47",23.0],["2016-04-10 21:27:43",23.0],["2016-04-10 21:27:43",23.0],["2016-04-10 21:26:47",23.0],["2016-04-10 21:27:43",23.0],["2016-04-10 21:28:39",23.0],["2016-04-10 21:31:27",23.0],["2016-04-10 21:27:43",23.0],["2016-04-10 21:28:39",23.0],["2016-04-10 21:29:35",23.0],["2016-04-10 21:35:11",23.0],["2016-04-10 21:28:39",23.0],["2016-04-10 21:29:35",23.0],["2016-04-10 21:30:31",23.0],["2016-04-10 21:38:55",23.0],["2016-04-10 21:29:35",23.0],["2016-04-10 21:30:31",23.0],["2016-04-10 21:31:27",23.0],["2016-04-10 21:42:39",23.0],["2016-04-10 21:30:31",23.0],["2016-04-10 21:31:27",23.0],["2016-04-10 21:32:23",23.0],["2016-04-10 21:46:23",23.0],["2016-04-10 21:31:27",23.0],["2016-04-10 21:32:23",23.0],["2016-04-10 21:33:19",23.0],["2016-04-10 21:50:07",23.0],["2016-04-10 21:32:23",23.0],["2016-04-10 21:33:19",23.0],["2016-04-10 21:34:15",23.0],["2016-04-10 21:53:51",22.0],["2016-04-10 21:33:19",22.0],["2016-04-10 21:34:15",22.0],["2016-04-10 21:35:11",22.0],["2016-04-10 21:57:35",22.0],["2016-04-10 21:34:15",22.0],["2016-04-10 21:35:11",22.0],["2016-04-10 21:36:07",22.0],["2016-04-10 22:01:19",22.0],["2016-04-10 21:35:11",22.0],["2016-04-10 21:36:07",22.0],["2016-04-10 21:37:03",22.0],["2016-04-10 22:05:03",22.0],["2016-04-10 21:36:07",22.0],["2016-04-10 21:37:03",22.0],["2016-04-10 21:37:59",22.0],["2016-04-10 22:08:47",22.0],["2016-04-10 21:37:03",22.0],["2016-04-10 21:37:59",22.0],["2016-04-10 21:38:55",22.0],["2016-04-10 22:12:31",22.0],["2016-04-10 21:37:59",22.0],["2016-04-10 21:38:55",22.0],["2016-04-10 21:39:51",22.0],["2016-04-10 22:16:15",22.0],["2016-04-10 21:38:55",22.0],["2016-04-10 21:39:51",22.0],["2016-04-10 21:40:47",22.0],["2016-04-10 22:19:59",22.0],["2016-04-10 21:39:51",22.0],["2016-04-10 21:40:47",22.0],["2016-04-10 21:41:43",22.0],["2016-04-10 22:23:43",22.0],["2016-04-10 21:40:47",22.0],["2016-04-10 21:41:43",22.0],["2016-04-10 21:42:39",22.0],["2016-04-10 22:27:27",22.0],["2016-04-10 21:41:43",22.0],["2016-04-10 21:42:39",22.0],["2016-04-10 21:43:35",22.0],["2016-04-10 22:31:11",22.0],["2016-04-10 21:42:39",22.0],["2016-04-10 21:43:35",22.0],["2016-04-10 21:44:31",22.0],["2016-04-10 22:34:55",22.0],["2016-04-10 21:43:35",22.0],["2016-04-10 21:44:31",22.0],["2016-04-10 21:45:27",22.0],["2016-04-10 22:38:39",22.0],["2016-04-10 21:44:31",22.0],["2016-04-10 21:45:27",22.0],["2016-04-10 21:46:23",21.0],["2016-04-10 22:42:23",21.0],["2016-04-10 21:45:27",21.0],["2016-04-10 21:46:23",22.0],["2016-04-10 21:47:19",22.0],["2016-04-10 22:46:07",22.0],["2016-04-10 21:46:23",22.0],["2016-04-10 21:47:19",22.0],["2016-04-10 21:48:15",22.0],["2016-04-10 22:49:51",22.0],["2016-04-10 21:47:19",22.0],["2016-04-10 21:48:15",22.0],["2016-04-10 21:49:11",22.0],["2016-04-10 22:53:35",22.0],["2016-04-10 21:48:15",22.0],["2016-04-10 21:49:11",22.0],["2016-04-10 21:50:07",22.0]];
	             
	             
	                var plot1 = $.jqplot("chartdiv", [prevYear], {
	                    seriesColors: ["rgba(78, 135, 194, 0.7)"],
	                    title: 'Monthly TurnKey Revenue',
	                    highlighter: {
	                        show: true,
	                        sizeAdjust: 1,
	                        tooltipOffset: 9
	                    },
	                    grid: {
	                        background: 'rgba(57,57,57,0.0)',
	                        drawBorder: false,
	                        shadow: false,
	                        gridLineColor: '#666666',
	                        gridLineWidth: 2
	                    },
	                    legend: {
	                        show: true,
	                        placement: 'outside'
	                    },
	                    seriesDefaults: {
	                        rendererOptions: {
	                            smooth: true,
	                            animation: {
	                                show: true
	                            }
	                        },
	                        showMarker: false
	                    },
	                    series: [
	                        {
	                            fill: false,
	                            label: '2010'
	                        },
	                        {
	                            label: '2011'
	                        }
	                    ],
	                    axesDefaults: {
	                        rendererOptions: {
	                            baselineWidth: 1.5,
	                            baselineColor: '#444444',
	                            drawBaseline: false
	                        }
	                    },
	                    axes: {
	                        xaxis: {
	                            renderer: $.jqplot.DateAxisRenderer,
	                            tickRenderer: $.jqplot.CanvasAxisTickRenderer,
	                            tickOptions: {
	                                formatString: "%b %e %H:%M:%S'",
	                                angle: -30,
	                                textColor: '#dddddd'
	                            },
	                            min: "2016-04-10 00:01:00",
	                            max: "2016-04-10 23:59:00",
	                            tickInterval: "6 hour",
	                            drawMajorGridlines: false
	                        },
	                        yaxis: {
	                            renderer: $.jqplot.LogAxisRenderer,
	                            pad: 0,
	                            rendererOptions: {
	                                minorTicks: 1
	                            },
	                            tickOptions: {
	                                formatString: "%'d",
	                                showMark: false
	                            }
	                        }
	                    }
	                });
}

function restartTemp(){
	var tempInt = $("#tempint").val();
	Caenrfid.restartTemp(function(data){alert(data);},function (err){alert("error"+err)},[tempInt]);
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

function showDataInConfirm(fields,target){
	console.log(fields,target)
	$( target ).empty();
    jQuery.each( fields, function( i, field ) {
    	if (typeof $("label[for='"+field.name+"']").html() != "undefined"){
    		console.log(field.name, field.value)
    		$( target ).append('<div class="summary-single-field">')
    		if ( jQuery.inArray( field.name, DYNAMIC_FIELDS_ARRAY)>=0 ) {
	    		$( target ).append("<b>"+$("label[for='"+field.name+"']").html()+":</b> " + $("#"+field.name+" option[value='"+field.value+"']").text() + "<br/> " );
	    	}else{	    		
	    		$( target ).append("<b>"+$("label[for='"+field.name+"']").html()+":</b> " +field.value + "<br/> " );
	    	}
	    	$( target ).append('</div>')
    	}
    });
}

function recordNewNest(){
	var connected = $('#connected').val();
	
	// var disabled = $('#NestData').find(':input:disabled').removeAttr('disabled');
	// var content=$('#NestData').serialize();
	// disabled.attr('disabled','disabled');

	var data = jQuery('#NestData').serializeArray();
	var requestData = {};
	for (var i = 0, l = data.length; i < l; i++) {
	    requestData[data[i].name] = data[i].value;
	}
	requestData.user_id = localStorage.getItem('user_id')

	// var url = HOST + API_PATH + "addNest.php?un="+username+"&mac="+ownID+"&"+content;
	var url = HOST + API_PATH + SAVE_NEST;
	console.log('requestData',requestData)
	if (connected=="online"){	
		var data = {}
		$.ajax({
			type: "POST",
			data: requestData,
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
			complete: function() { $.mobile.loading('hide'); }, //Hide spinner
			url: url,
			success: function(data) {
				console.log(data)				
				alert("Nest data recorded");
				$.mobile.changePage("index.html");
			},
			error: function(data) {
				alert("Seems like Something went wrong. " + data.message);
			}
		});
	} else {
		openFile("newNest");
		saveEventToFile(url);
	}
}

function recordNewNestUnsuccessful(){
	$('#rfid').val("");
	var disabled = $('#NestData').find(':input:disabled').removeAttr('disabled');
	var content=$('#NestData').serialize();
	disabled.attr('disabled','disabled');
	var url = HOST + API_PATH + "addNest.php?un="+username+"&mac="+ownID+"&"+content;
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

	var data = jQuery('#PredationData').serializeArray();
	var requestData = {};
	for (var i = 0, l = data.length; i < l; i++) {
	    requestData[data[i].name] = data[i].value;
	}
	requestData.user_id = localStorage.getItem('user_id')

	// var url = HOST + API_PATH + "recordPerdation.php?un="+username+"&mac="+ownID+"&"+content;
	var url = HOST + API_PATH + SAVE_PREDATIONS;
	
	$.ajax({
		data:requestData,
		type: "POST",
 		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: url,
		success: function(data) {
			$.mobile.changePage("index.html");
			alert("Perdation data recorded");
		}
	});
}

function saveTurtle(){

	var data = jQuery('#turtleInfoForm').serializeArray();
	var requestData = {};
	for (var i = 0, l = data.length; i < l; i++) {
	    requestData[data[i].name] = data[i].value;
	}
	requestData.user_id = localStorage.getItem('user_id');

	// var url = HOST + API_PATH + "saveTurtle.php?un="+username+"&mac="+ownID+"&"+content;
	var url = HOST + API_PATH + SAVE_TURTLE;

	$.ajax({
		data:requestData,
		type: "POST",
 		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: url,
		success: function(data) {
			// data = JSON.parse(data);
			if(data.code == '201'){
				console.log(data.message)
				showToast(data.message, 'center', 'long')				
			}else{
				console.log(data.message)
				showToast(data.message, 'center', 'long')
				// $.mobile.loadPage( "record-nest.html" );
				$.mobile.changePage("record-nest.html");
			}
		},
		dataType:"json"
	});
}

function viewTurtle(tagid){
	$("body").pagecontainer("change", "turtleInfo.html", {reloadPage: true});
	populateTurtleInfo(tagid);
}

function populateTurtleInfo(tagid){
	var data = {tagID:tagid}
	$.ajax({
		//		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		//		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: HOST + API_PATH + LIST_TURTLES,
		data:data,
		type: "POST",
		success: function(data) {
			val = data.data.Turtle;
			$('#dbid').val(val.id);
			$('#replacedID').val(val.replacedID);
			$('#tagid').val(val.tagID);
			$('#tagDate').val(val.taggingDate);
			$('#replacedDate').val(val.replacedDate);
			$('#nameOfMeasurer').val(val.nameOfMeasurer);
			$('#scl').val(val.straight_carapace_length);
			$('#scw').val(val.straight_carapace_width);
			$('#ccl').val(val.curved_carapace_length);
			$('#ccw').val(val.curved_carapace_width);
			$('#n').val(val.nuchal);
			$('#cr').val(val.costal_right);
			$('#cl').val(val.costal_left);
			$('#v').val(val.vertbral);
			$('#mr').val(val.marginal_right);
			$('#ml').val(val.marginal_left);
			$('#sc').val(val.supracaudal);
			$('#devices').val(val.devices);
			$('#notes').val(val.notes);
			
		},
		dataType:"json"
		});
	
}

function recordEmerg(){

	var data = jQuery('#EmergData').serializeArray();
	var requestData = {};
	for (var i = 0, l = data.length; i < l; i++) {
	    requestData[data[i].name] = data[i].value;
	}
	requestData.user_id = localStorage.getItem('user_id')
	// var url = HOST + API_PATH + "recordEmergence.php?un="+username+"&mac="+ownID+"&"+content;
	var url = HOST + API_PATH + SAVE_EMERGENCE;
	$.ajax({
		data:requestData,
		type: "POST",
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

	var data = jQuery('#UncoverData').serializeArray();
	var requestData = {};
	for (var i = 0, l = data.length; i < l; i++) {
	    requestData[data[i].name] = data[i].value;
	}
	requestData.user_id = localStorage.getItem('user_id');

	var url = HOST + API_PATH + SAVE_UNCOVER;
	// var url = HOST + API_PATH + "recordUncover.php?un="+username+"&mac="+ownID+"&"+content;
	$.ajax({
		data:requestData,
		type: "POST",
 		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: url,
		success: function(data) {
			$.mobile.changePage("index.html");
			alert("Uncover for Control recorded");
		}
	});
}


function populateNests(){
	var url = "http://gpstest.hrafn.no/ajax/getDeviceLastPos.php?un="+username+"&mac=turleDemo&count=10";
	$.ajax({
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: url,
		success: function(data) {
			$.each(data, function (key, val) {
				//$('#nests-list').append("<li><a href='#' onClick=\"searchRFID('"+val.epc+"');\">"+val.epc+"<br/><small>"+val.content+"</small></li>").listview( "refresh" );
				$('#nests-list').append("<li><a href='#' onClick=\"searchRFID('"+val.epc+"');\">"+val.epc+"<br/><small>"+val.content+"</small></li>").listview( "refresh" );
			});
		}
	});
}


function searchRFID(rfidSearch){
	// alert('search pressed')
	
	Caenrfid.scanRFID(function(data){
		// alert(JSON.stringify(data), '  :  '+data);
		// alert(JSON.stringify(data));
		searchRFIDSuccess(data.substring(0)+"",rfidSearch);
	},function (err){
		alert("error"+err)
	});    
}

function scanOnce(){
	rfidRunning = 1;
	Caenrfid.scanSingle(function(data){
		scanOnceSuccess(data.substring(0)+"");
	},function (err){
		alert("error"+err)
	});
}

function scanOnceSuccess(rfid){
	//navigator.notification.beep(2);
	//alert(rfidRunning+"");
	if ($.inArray(rfid,tags)==-1){
		curTag = rfid;
		if (rfidRunning==1){
	//			stopRFID();
			$.mobile.loading('hide');
	//			alert("running and true");
		}
		if ($('#rfid').val()==""){
	//			alert(rfid);
			$.mobile.loading('hide');
			$('#rfid').val(rfid+"");
			
		}
		$.ajax({
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
			complete: function() { $.mobile.loading('hide'); }, //Hide spinner
			url: HOST + API_PATH + "findNests.php?un="+username+"&rfid="+curTag+"&dbid="+curDbId,
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
				$('#nestID').val(nestID);
				var htmlInfo = htmlInfo + "</div><!-- /grid-a --></p></div>";
				
			}
		});
		//tags.push(rfid);
	}
}

function dummyRead(rfidSearch){
	var random = Math.floor(Math.random() * (999 - 100)) + 100;
	searchRFIDSuccess("3415AF99E800000000000"+random,rfidSearch)
	return "testing";
}

function searchRFIDSuccess(rfid,search){
	var hex = rfid;
	//alert(rfid+" "+search);
	// alert('search: '+search);
	navigator.notification.beep(1);
	if (rfid==search){
		navigator.notification.beep(2);
	}
	var requestData = {};
	requestData.id = rfid;
	if ($.inArray(rfid,tags)==-1){
		//	navigator.notification.beep(2);
		$.ajax({
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
			complete: function() { $.mobile.loading('hide'); }, //Hide spinner
			//			url: "http://capture.qrlogistic.com/hextoepc.php?hex="+hex,
			// url: HOST + API_PATH + "findNests.php?un="+username+"&rfid="+hex,
			dataType:"json",

			url: HOST + API_PATH + FIND_NESTS_BY_RFID,
			data:requestData,
			type: "POST",

			success: function(data) {
				alert(JSON.stringify(data));
				var output = "<li id='"+hex+"' hex='"+hex+"'>"+"New Tag"+" ("+hex+")</li>";
				if (typeof data.data.Nest.NestID != "undefined")
				output = "<li id='"+hex+"' hex='"+hex+"'>"+data.data.Nest.NestID+" ("+hex+")</li>";
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
			url: HOST + API_PATH + "findNests.php?un="+username+"&rfid="+tag,
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
	console.log('id: '+id)
	window.curTag = id;
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
	var requestData = {};
	requestData.id = curTag;
	$.ajax({
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: HOST + API_PATH + FIND_NESTS,
		// url: HOST + API_PATH + "findNests.php?un="+username+"&rfid="+curTag+"&dbid="+curDbId,
		data:requestData,
		type: "POST",
		success: function(data) {
			// window.curTag = data.data.Nest.rfid;

			var eventTime = (new Date(data.data.Nest.timestamp)).toDateString();
			var nestingDate = (new Date(data.data.Nest.nestingDate)).toDateString();
			
			var htmlInfo = "<div data-role='collapsible' ><h3>"+data.data.Nest.NestID+"</h3><p><div class='ui-grid-a'>";
			$.each(data.data.Nest,function (key,val){
				
				if (key == "rfid"){
					// window.curTag = val;
				}
				htmlInfo = htmlInfo + "<div class='ui-block-a'><div class='ui-bar ui-bar-a' style='height:30px'>"+key+"</div></div>"+
				"<div class='ui-block-b'><div class='ui-bar ui-bar-a' id='nest"+key+"' style='height:30px'>"+val+"</div></div>";
			});
			nestID = data.data.Nest.NestID;
			curDbId = data.data.Nest.id;
			nestData = data.data.Nest;
			htmlInfo = htmlInfo + "</div><!-- /grid-a --></p></div>";
	//			$("#nestInfo").html(htmlInfo);
			if (data.data.Nest.adoptId != ""){
	//				$("#linkaAdoptAnestButton").button( "disable" );
			}
	//			
			$("#nestInfo").html(htmlInfo );
			$('div[data-role=collapsible]').collapsible();
			htmlInfo="";
			$.ajax({
				beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
				complete: function() { $.mobile.loading('hide'); }, //Hide spinner
				// url: HOST + API_PATH + "nestPredation.php?un="+username+"&rfid="+window.curTag+"&dbid="+curDbId,
				url: HOST + API_PATH + NEST_PREDATION,
				data:{rfid:data.data.Nest.rfid},
				type:'POST',
				success: function(data) {
					htmlInfo = $("#nestInfo").html();
					if (data.length>0){
						var eventTime = (new Date(nestData.timestamp)).toDateString();
						var nestingDate = (new Date(nestData.nestingDate)).toDateString();

						htmlInfo = htmlInfo + "<div id='predation'>"; 
						$.each(data,function (key,val){
							htmlInfo = htmlInfo +
							"<div data-role='collapsible' >"+
							"<h3>Predation: "+val.timestamp+"</h3><p><div class='ui-grid-a'>";
							$.each(nestData,function (key,val){
								htmlInfo = htmlInfo + "<div class='ui-block-a'><div class='ui-bar ui-bar-a' style='height:30px' id='"+key+"'>"+key+"</div></div>"+
								"<div class='ui-block-b'><div class='ui-bar ui-bar-a' style='height:30px'>"+val+"</div></div>";
							});
							htmlInfo = htmlInfo + "</div><!-- /grid-a --></p>"+
							"</div>";

						});
						htmlInfo = htmlInfo + "</div>";
					}
					// $("#nestInfo").html(htmlInfo);
					$('div[data-role=collapsible]').collapsible();
					//$( "#predation" ).collapsibleset( "refresh" );
					if (nestData.adoptId != ""){
						$("#linkaAdoptAnestButton").button( "disable" );
					}
				},
				dataType:"json"
				});

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

$(document).on('popupafteropen','#popupConfirm', function () {
	showDataInConfirm($('#NestData').serializeArray(),"#summary");
});

$(document).on('popupafteropen','#popupConfirm2', function () {
	showDataInConfirm($('#NestData').serializeArray(),"#summary2");
});

$(document).on('popupafteropen','#popupConfirmTurtleInfo', function () {
	showDataInConfirm($('#turtleInfoForm').serializeArray(),"#summary");
});

$(document).on('popupafteropen','#popupConfirmPred', function () {
	showDataInConfirm($('#PredationData').serializeArray(),"#summary");
});

$(document).on('popupafteropen','#popupConfirmEmerg', function () {
	showDataInConfirm($('#EmergData').serializeArray(),"#summary");
});

$(document).on('popupafteropen','#popupConfirmUncover', function () {
	showDataInConfirm($('#UncoverData').serializeArray(),"#summary");
});


function nestListClick() {
	processTag($(this).attr('hex'));
}

$("#taglist li").not('.emptyMessage').on("click",nestListClick);



function login(username,password){
	// var url= HOST + API_PATH + "login.php?un="+un+"&psw="+pw;
	var url= HOST + API_PATH + LOGIN;
	var data = { username: username, password: password }
	$.ajax({
		type: "POST",
		data: data,
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: url,
		success: function(data) {
			console.log(data)
			$.mobile.loading('hide'); 
			
			if (data.code=="200"){				
				console.log(data);
				showToast('Successfully Logged In', 'bottom', 'long')
				localStorage.setItem("group_id", data.data.Group.id);
				localStorage.setItem("user_id", data.data.User.id);
				$.mobile.navigate( "#menuPage" );
			}else if(data.code=="201"){
				showToast('Username or password is incorrect.', 'bottom', 'long')
				$('button').button( "disable" );
			}else{
				showToast('Seems like something went wrong.', 'bottom', 'long')
			}
		},
		dataType:"json"
		});
}

/********* GET ALL RECORD NEST INFORMATION NEEDED ON NEST RECORD CREATION PAGE ******/

function getRecordNestInformation(){
	// var url= HOST + API_PATH + "login.php?un="+un+"&psw="+pw;
	var url= HOST + API_PATH + GET_RECORD_NEST_INFORMATION;
	var data = {}
	$.ajax({
		type: "POST",
		data: data,
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: url,
		success: function(data) {
			if (data.code=="200"){
				console.log(data);

				var Specie = data.data.Specie;
				$.each(Specie, function (i, item) {
				    $('#Specie').append($('<option>', { 
				        value: i,
				        text : item 
				    }));
				});

				var AlterationTime = data.data.AlterationTime;
				$.each(AlterationTime, function (i, item) {
				    $('#AlterationTime').append($('<option>', { 
				        value: i,
				        text : item 
				    }));
				});

				var leftLandMarkAlt = data.data.NestLandmark;
				$.each(leftLandMarkAlt, function (i, item) {
				    $('#leftLandMarkAlt').append($('<option>', { 
				        value: i,
				        text : item 
				    }));
				});

				var leftLandMarkAlt = data.data.NestLandmark;
				$.each(leftLandMarkAlt, function (i, item) {
				    $('#leftLandMarkAlt').append($('<option>', { 
				        value: i,
				        text : item 
				    }));
				    $('#rightLandMarkAlt').append($('<option>', { 
				        value: i,
				        text : item 
				    }));
				    $('#leftLandMark').append($('<option>', { 
				        value: i,
				        text : item 
				    }));
				    $('#rightLandMark').append($('<option>', { 
				        value: i,
				        text : item 
				    }));
				});

				var NestLocation = data.data.NestLocation;
				$.each(NestLocation, function (i, item) {
				    $('#nestLocAlt').append($('<option>', { 
				        value: i,
				        text : item 
				    }));
				    $('#nestLoc').append($('<option>', { 
				        value: i,
				        text : item 
				    }));
				});

				var RelocatedNestCover = data.data.RelocatedNestCover;
				$.each(RelocatedNestCover, function (i, item) {
				    $('#gridcoverAlt').append($('<option>', { 
				        value: i,
				        text : item 
				    }));
				});

				var NestCover = data.data.NestCover;
				$.each(NestCover, function (i, item) {
				    $('#gridCover').append($('<option>', { 
				        value: i,
				        text : item 
				    }));
				});
				
			}else if(data.code=="201"){
				alert("Seems like something went wrong.");

			}else{
				alert("Seems like something went wrong.");
			}
		},
		dataType:"json"
		});
}

/********* GET ALL PREDATION INFORMATION NEEDED ON PREDATION CREATION PAGE ******/

function fetchPredationData(){
	// var url= HOST + API_PATH + "login.php?un="+un+"&psw="+pw;
	var url= HOST + API_PATH + GET_RECORD_NEST_INFORMATION;
	var data = {}
	$.ajax({
		type: "POST",
		data: data,
		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
		url: url,
		success: function(data) {
			if (data.code=="200"){
				console.log(data);

				var Predator = data.data.Predator;
				$.each(Predator, function (i, item) {
				    $('#predator').append($('<option>', { 
				        value: i,
				        text : item 
				    }));
				});

				var NestCover = data.data.NestCover;
				$.each(NestCover, function (i, item) {
				    $('#gridcover').append($('<option>', { 
				        value: i,
				        text : item 
				    }));
				});
				
				
			}else if(data.code=="201"){
				alert("Seems like something went wrong.");

			}else{
				alert("Seems like something went wrong.");
			}
		},
		dataType:"json"
		});
}

function gotoRecordNestAndReset() {
	$.mobile.changePage('record-nest.html', { 
		dataUrl : "record-nest.html?resetData=1", 
		data : { 'resetData' : '1' }, 
		reloadPage : true, 
		changeHash : true 
	});
}


$(document).on("pagecontainerbeforechange", function(e, data) {
	// console.log(data)
	// console.log(localStorage.getItem("group_id"),localStorage.getItem("user_id"));
	if (localStorage.getItem("group_id")&&localStorage.getItem("user_id")) {
		// data.toPage = $("#menuPage");
	}else{
		data.toPage = $("#loginPage");
	}
  // if(typeof data.toPage == "object" && typeof data.absUrl == "undefined" && !condition) {
  //   data.toPage = $("#loginPage");
  // }
});


//function linkAdoptANest(){
//	cordova.plugins.barcodeScanner.scan(
//		      function (result) {
//		          alert("We got a barcode\n" +
//		                "Result: " + result.text + "\n" +
//		                "Format: " + result.format + "\n" +
//		                "Cancelled: " + result.cancelled);
//		          var qr = result.text.split("=");
//		          qr = qr[1];
//		          var url=HOST + API_PATH + "linkAdoptNest.php?rfid="+curTag+"&username="+username+"&qr="+qr;
//		      		$.ajax({
//		      		beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
//		      		complete: function() { $.mobile.loading('hide'); }, //Hide spinner
//		      		url: url,
//		      		success: function(data) {
//		      			if (data.response=="1"){
//		      				alert("Nest linked to AdoptANest system.");
//		      			}else{
//		      				alert("Something went wrong.");
//		      			}
//
//		      		},
//		      		dataType:"json"
//		      		});
//		      }, 
//		      function (error) {
//		          alert("Scanning failed: " + error);
//		      }
//		   );
//}
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
	navigator.geolocation.getCurrentPosition(onLocationFound, function(){
		showToast("No Location found", 'bottom', 'long')
	}, options);
	//	navigator.geolocation.watchPosition(onLocationFound, function(){alert("no location found");}, options);
	
	// setInterval(function(){
	// 	options = {maximumAge:600, timeout:50000, enableHighAccuracy: true};
	// 	navigator.geolocation.getCurrentPosition(onLocationFound, function(){alert("no location found");}, options);
	// },10000);
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
	navigator.geolocation.getCurrentPosition(onLocationFound, function(){
		showToast("No Location found", 'bottom', 'long')
	}, options);
	//	navigator.geolocation.watchPosition(onLocationFound, function(){alert("no location found");}, options);
	// setInterval(function(){
	// 	options = {maximumAge:600, timeout:50000, enableHighAccuracy: true};
	// 	navigator.geolocation.getCurrentPosition(onLocationFound, function(){alert("no location found");}, options);
	// },10000);
}

function findNest(tag){
	curTag=tag;
	$.mobile.changePage("findNest.html");	
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
	var networkState = navigator.connection.type;
    if (networkState !== Connection.NONE) {
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
						"<a href='#' onClick='processTagDbId(\""+val.Nest.id+"\");'><b>Nest ID: "+val.Nest.NestID+"</b><br />Nestingdate: "+formateDate(val.Nest.nestingDate)+"</a></li>");
					
				});
				
				function refreshList(){
				  	$('#nestList').listview("refresh");
				}
				setTimeout(refreshList, 500);
			},
			dataType:"json"
		});
		$('#offlineList').prev( "form" ).hide();
    }else{
    	showToast("Showing the local listing of nests recorded by you.", 'bottom', 'long');
    	$('#nestList').prev( "form" ).hide();
    	listOfflineEvents()
    	return;
    }
		
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
	Caenrfid.scanRFID(function(data){
			rfidRunning=true;
			scanRFIDSuccess(data.substring(4)+"");
			navigator.notification.beep(1);
		},
		function (err){
			alert("error"+err)
		});
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
		var filename = tagid + "_TEMP_" + fileDate.getFullYear()+("0"+(fileDate.getMonth()+1)).slice(-2)+("0"+fileDate.getDate()).slice(-2)+("0"+fileDate.getHours()).slice(-2)+("0"+fileDate.getMinutes()).slice(-2);
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

function saveEventToFileNest(data){

	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
		var fileDate = new Date();
		var filename = "NEST_" + data.NestID + "_" + fileDate.getFullYear()+("0"+(fileDate.getMonth()+1)).slice(-2)+("0"+fileDate.getDate()).slice(-2)+("0"+fileDate.getHours()).slice(-2)+("0"+fileDate.getMinutes()).slice(-2);
		    dir.getFile(filename + ".csv", {create:true}, function(file) {
		        console.log("got the file", file);
		        logOb = file;		        
	        	if(!logOb) return;
				logOb.createWriter(function(fileWriter) {
					console.log(data);
					var fields = [];
					var values = [];
					for (var property in data) {
					    if (data.hasOwnProperty(property)) {
					        fields.push(property);
					        values.push(data[property]);
					    }
					}
					// SAMPLE CSV
					// var CSV = [
					//     '"1","val1","val2","val3","val4"',
					//     '"2","val1","val2","val3","val4"'
					//   ].join('\n');
					var CSV = [
					    fields.join(),
					    values.join()
					  ];

					// APPENDING TURTLE DATA
					if(window.RECENTTURTLEDATA){
						turtleData = window.RECENTTURTLEDATA;
						var turtleFields = [];
						var turtleValues = [];
						for (var property in turtleData) {
						    if (turtleData.hasOwnProperty(property)) {
						        turtleFields.push(property);
						        turtleValues.push(turtleData[property]);
						    }
						}
						CSV.push(turtleFields.join());
						CSV.push(turtleValues.join());
						console.log(CSV)
						console.log(CSV.join('\n'))
					}


					var contentType = 'text/csv';
					var csvFile = new Blob([CSV.join('\n')], {type: contentType});
					fileWriter.write(csvFile);

					if (localStorage.getItem('offlineRecordedNestNames')) {
						var offlineRecordedNestNames = JSON.parse(localStorage.getItem('offlineRecordedNestNames'));
					}else{
						var offlineRecordedNestNames = [];
					}
					offlineRecordedNestNames.push(filename);
					localStorage.setItem('offlineRecordedNestNames',JSON.stringify(offlineRecordedNestNames));

					// alert("file written" + CSV);
					showToast("Data Saved Successfully.", 'bottom', 'long')
					// $.mobile.changePage("index.html");
					$.mobile.navigate( "#menuPage" );
				},  function fail(e) {
					// alert("FileSystem Error");
					showToast("FileSystem Error", 'bottom', 'long')
					// alert(e);
				});
		    });
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
			//	alert("inside"+this.result);
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
			 console.log("inside:"+this.result);
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
			// plotTemperature(this.result,false); Should be to execute eent into database.
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

        	var file_data = file;   
    		var form_data = new FormData();                  
    		form_data.append('file', file_data);

            console.log("got the file", file);
            logOb = file;

            logOb.file(function(file) {
			 var reader = new FileReader();

			 	reader.onloadend = function(e) {
				 	console.log(this.result);
				 	console.log(file);
				 	console.log(logOb);
				 	var ServerURI = HOST + API_PATH + UPLOAD_NEST;
				 	var fileURL = file.localURL;
				 	uploadFileToServer(ServerURI, fileURL, logOb.nativeURL, 'nest');
					//	plotTemperature(this.result,false); Should be to execute eent into database.
			 	};

			 	reader.readAsText(file);
		 	}, function fail(e) {
				alert("FileSystem Error");
				alert(e);
		 	});

        });
    });
	 
}

function syncAllNestData(type) {

	var networkState = navigator.connection.type;
    if (networkState !== Connection.NONE) {
    	if (type=='nest') {
			window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,
			    function (fileSystem) {
			      	var reader = fileSystem.createReader();
			      	var list="";
			      	reader.readEntries(function (entries) {
			      		console.log(entries)
			        	for (i=0; i<entries.length; i++) {
			        		if (typeof entries[i] == 'undefined'){
			        			continue;
			        		}
			        		var offlineRecordedNestNames = JSON.parse(localStorage.getItem('offlineRecordedNestNames'));
			        		console.log('offlineRecordedNestNames: ',offlineRecordedNestNames)
			        		console.log('entries[i].name: ',entries[i].name.slice(0, -4))
			        		if (offlineRecordedNestNames.indexOf(entries[i].name.slice(0, -4)) >-1){
			        			readEventFromFile(entries[i].name, type)
			        		}
			        	}		        	
			        },
			        function (err) {
			          	alert(err);
			        });
			      	//alert(list);
			    }, function (err) {
			      	alert(err);
			    });
		}
    }else{    	
    	showToast("Error occured while syncing. Check your internet connection.", 'bottom', 'long');
    	return;
    }	
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
		    });
}

function listOfflineEvents(){
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (fileSystem) {
		    var reader = fileSystem.createReader();
		    var list="";
		    reader.readEntries(
		        function (entries) {
		        	var i;
		        	var htmlInset = "";
		        	var offlineRecordedNestNames = JSON.parse(localStorage.getItem('offlineRecordedNestNames'));

		        	for (i=0; i<entries.length; i++) {
		        		var index = offlineRecordedNestNames.indexOf(entries[i].name.slice(0, -4));
			            if (index > -1) {
			        		if (typeof entries[i] == 'undefined'){
			        			continue;
			        		}
			        		$("#fileList").html("");
			        		htmlInset += "<li data-icon=\"recycle\"><a href='#' onclick='readEventFromFile(\""+entries[i].name+"\");'>"+
							"<h3>"+entries[i].name+"</h3></a> ";
			        		if (entries[i].name.search("finished_")==-1){
			        			// htmlInset += "<a href='#' onclick='alert(\"upload data\");'>1st link</a> ";
			        			htmlInset += "<a href='#' onclick='readEventFromFile(\""+entries[i].name+"\");'>1st link</a> ";
			        		}
							htmlInset += "</li>";
						}
		        	}
		        	$("#offlineList").html(htmlInset);
		        	$("#offlineList").listview('refresh');		        	
		        },
		        function (err) {
		          alert(err);
		        }
		    );
		    
	    }, function (err) {
	      	alert(err);
		});
}

function listOfflineTurtles(){

	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (fileSystem) {
		    var reader = fileSystem.createReader();
		    var list="";
		    reader.readEntries(
		        function (entries) {
		        	var i;
		        	var htmlInset = "";
		        	var offlineRecordedTurtleNames = JSON.parse(localStorage.getItem('offlineRecordedTurtleNames'));		        	

		        	for (i=0; i<entries.length; i++) {
		        		
			            var index = offlineRecordedTurtleNames.indexOf(entries[i].name.slice(0, -4));
			            if (index > -1) {
			        		if (typeof entries[i] == 'undefined'){
			        			continue;
			        		}
			        		$("#fileList").html("");
			        		htmlInset += "<li data-icon=\"recycle\"><a href='#' onclick='syncTurtleData(\""+entries[i].name+"\");'>"+
							"<h3>"+entries[i].name+"</h3></a> ";
			        		if (entries[i].name.search("finished_")==-1){
			        			// htmlInset += "<a href='#' onclick='alert(\"upload data\");'>1st link</a> ";
			        			htmlInset += "<a href='#' onclick='syncTurtleData(\""+entries[i].name+"\");'>1st link</a> ";
			        		}
							htmlInset += "</li>";
			            }
		        		
		        	}
		        	$("#offlineListTurtles").html(htmlInset);
		        	$("#offlineListTurtles").listview('refresh');
		        	
		        },
		        function (err) {
		          alert(err);
		        }
		    );
	      //alert(list);
	    }, function (err) {
	    	alert(err);
		});
}

function listOfflinePredations(){

	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (fileSystem) {
		    var reader = fileSystem.createReader();
		    var list="";
		    reader.readEntries(
		        function (entries) {
		        	var i;
		        	var htmlInset = "";
		        	var offlineRecordedPredationNames = JSON.parse(localStorage.getItem('offlineRecordedPredationNames'));		        	

		        	for (i=0; i<entries.length; i++) {
		        		
			            var index = offlineRecordedPredationNames.indexOf(entries[i].name.slice(0, -4));
			            if (index > -1) {
			        		if (typeof entries[i] == 'undefined'){
			        			continue;
			        		}
			        		$("#fileList").html("");
			        		htmlInset += "<li data-icon=\"recycle\"><a href='#' onclick='syncPredationData(\""+entries[i].name+"\");'>"+
							"<h3>"+entries[i].name+"</h3></a> ";
			        		if (entries[i].name.search("finished_")==-1){
			        			// htmlInset += "<a href='#' onclick='alert(\"upload data\");'>1st link</a> ";
			        			htmlInset += "<a href='#' onclick='syncPredationData(\""+entries[i].name+"\");'>1st link</a> ";
			        		}
							htmlInset += "</li>";
			            }
		        		
		        	}
		        	$("#offlineListPredations").html(htmlInset);
		        	$("#offlineListPredations").listview('refresh');
		        	
		        },
		        function (err) {
		          alert(err);
		        }
		    );
	    }, function (err) {
	    	alert(err);
		});
}

function listOfflineEmergence(){

	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (fileSystem) {
		    var reader = fileSystem.createReader();
		    var list="";
		    reader.readEntries(
		        function (entries) {
		        	var i;
		        	var htmlInset = "";
		        	var offlineRecordedEmergenceNames = JSON.parse(localStorage.getItem('offlineRecordedEmergenceNames'));		        	

		        	for (i=0; i<entries.length; i++) {
		        		
			            var index = offlineRecordedEmergenceNames.indexOf(entries[i].name.slice(0, -4));
			            if (index > -1) {
			        		if (typeof entries[i] == 'undefined'){
			        			continue;
			        		}
			        		$("#fileList").html("");
			        		htmlInset += "<li data-icon=\"recycle\"><a href='#' onclick='syncEmergenceData(\""+entries[i].name+"\");'>"+
							"<h3>"+entries[i].name+"</h3></a> ";
			        		if (entries[i].name.search("finished_")==-1){
			        			// htmlInset += "<a href='#' onclick='alert(\"upload data\");'>1st link</a> ";
			        			htmlInset += "<a href='#' onclick='syncEmergenceData(\""+entries[i].name+"\");'>1st link</a> ";
			        		}
							htmlInset += "</li>";
			            }
		        		
		        	}
		        	$("#offlineListEmergence").html(htmlInset);
		        	$("#offlineListEmergence").listview('refresh');
		        	
		        },
		        function (err) {
		          alert(err);
		        }
		    );
	    }, function (err) {
	    	alert(err);
		});
}

function listOfflineUncover(){

	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (fileSystem) {
		    var reader = fileSystem.createReader();
		    var list="";
		    reader.readEntries(
		        function (entries) {
		        	var i;
		        	var htmlInset = "";
		        	var offlineRecordedUncoverNames = JSON.parse(localStorage.getItem('offlineRecordedUncoverNames'));		        	

		        	for (i=0; i<entries.length; i++) {
		        		
			            var index = offlineRecordedUncoverNames.indexOf(entries[i].name.slice(0, -4));
			            if (index > -1) {
			        		if (typeof entries[i] == 'undefined'){
			        			continue;
			        		}
			        		$("#fileList").html("");
			        		htmlInset += "<li data-icon=\"recycle\"><a href='#' onclick='syncUncoverData(\""+entries[i].name+"\");'>"+
							"<h3>"+entries[i].name+"</h3></a> ";
			        		if (entries[i].name.search("finished_")==-1){
			        			// htmlInset += "<a href='#' onclick='alert(\"upload data\");'>1st link</a> ";
			        			htmlInset += "<a href='#' onclick='syncUncoverData(\""+entries[i].name+"\");'>1st link</a> ";
			        		}
							htmlInset += "</li>";
			            }
		        		
		        	}
		        	$("#offlineListUncover").html(htmlInset);
		        	$("#offlineListUncover").listview('refresh');
		        	
		        },
		        function (err) {
		          alert(err);
		        }
		    );
	    }, function (err) {
	    	alert(err);
		});
}

function readTemp(){
	$.mobile.loading( 'show', {
		text: 'Loading temperature',
		textVisible: true,
		theme: 'z',
		html: "<img src=\"img/loader.gif\" />"
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
	// $( target ).empty();

	var HTML = '';
	HTML += '<table data-role="table" class="ui-responsive ui-shadow" id="myTable"><thead><tr><th>Field Name</th><th>Value</th></tr></thead><tbody>';

	    jQuery.each( fields, function( i, field ) {
	    	if (typeof $("label[for='"+field.name+"']").html() != "undefined"){
	    		console.log(field.name, field.value)
	    		
	    		if ( jQuery.inArray( field.name, DYNAMIC_FIELDS_ARRAY)>=0 ) {
	    			if(field.value==0){
	    				HTML += "<tr><td>"+$("label[for='"+field.name+"']").html()+"</td><td> - </td></tr>" ;
	    			}else{
	    				HTML += "<tr><td>"+$("label[for='"+field.name+"']").html()+"</td><td>" + $("#"+field.name+" option[value='"+field.value+"']").text() + "</td></tr>" ;
	    			}		    		
		    	}else{	    		
		    		HTML += "<tr><td>"+$("label[for='"+field.name+"']").html()+"</td><td>" +field.value + "</td></tr>" ;
		    	}	    	
	    	}
	    });

    HTML += '</tbody></table>';
    $( target ).html(HTML);
    
}

function recordNewNest(type){
	// type: 1.update, 2.new

	// var connected = $('#connected').val();	
	// var disabled = $('#NestData').find(':input:disabled').removeAttr('disabled');
	// var content=$('#NestData').serialize();
	// disabled.attr('disabled','disabled');

	var data = jQuery('#NestData').serializeArray();
	var requestData = {};
	for (var i = 0, l = data.length; i < l; i++) {
	    requestData[data[i].name] = data[i].value;
	}

	// if (!requestData.NestID) {
	// 	alert('NestID REq');return;
	// }

	requestData.user_id = localStorage.getItem('user_id')

	// var url = HOST + API_PATH + "addNest.php?un="+username+"&mac="+ownID+"&"+content;
	var url = HOST + API_PATH + SAVE_NEST;
	console.log('requestData',requestData)

	var networkState = navigator.connection.type;

    if (networkState !== Connection.NONE) {
    	// ONLINE CAPTURING
        console.log('Current State', networkState)
        var data = {}
		$.ajax({
			type: "POST",
			data: requestData,
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
			complete: function() { $.mobile.loading('hide'); }, //Hide spinner
			url: url,
			success: function(data) {
				console.log(JSON.parse(data))
				// alert("Nest data recorded");
				// 
				
				if (type=='update') {
					showToast("Nest data update Successfully", 'bottom', 'long')
					$.mobile.changePage("nestList.html");
				}else{
					showToast("Nest data recorded", 'bottom', 'long')
					$.mobile.changePage("index.html");
				}
			},
			error: function(data) {
				// alert("Seems like Something went wrong. " + data.message);
				showToast("Seems like Something went wrong.", 'bottom', 'long')
			}
		});
    }else{
    	// OFFLINE CAPTURING
    	console.log('Current State', networkState)
    	// openFile("newNest");
		saveEventToFileNest(requestData);
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

	if (!requestData.rfid) {
		console.log('RFID is required. You must have to read the nest before recording predation.')
		showToast('RFID is required. You have to read nest 	before recording.', 'center', 'long');
		return;
	}

	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
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
				showToast('Perdation data recorded successfully', 'center', 'long');
			}
		});
	}else{
		savePredationOffline(requestData)
	}
}

function savePredationOffline(data){
	
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
		var fileDate = new Date();
		var filename = "PREDATION_" + data.nestID + "_" + fileDate.getFullYear()+("0"+(fileDate.getMonth()+1)).slice(-2)+("0"+fileDate.getDate()).slice(-2)+("0"+fileDate.getHours()).slice(-2)+("0"+fileDate.getMinutes()).slice(-2);
		    dir.getFile(filename + ".csv", {create:true}, function(file) {
		        console.log("got the file", file);
		        logOb = file;		        
	        	if(!logOb) return;
				logOb.createWriter(function(fileWriter) {
					console.log(data);
					var fields = [];
					var values = [];
					for (var property in data) {
					    if (data.hasOwnProperty(property)) {
					        fields.push(property);
					        values.push(data[property]);
					    }
					}

					var CSV = [
					    fields.join(),
					    values.join()
					  ].join('\n');
					var contentType = 'text/csv';
					var csvFile = new Blob([CSV], {type: contentType});
					fileWriter.write(csvFile);

					if (localStorage.getItem('offlineRecordedPredationNames')) {
						var offlineRecordedPredationNames = JSON.parse(localStorage.getItem('offlineRecordedPredationNames'));
					}else{
						var offlineRecordedPredationNames = [];
					}
					offlineRecordedPredationNames.push(filename);
					localStorage.setItem('offlineRecordedPredationNames',JSON.stringify(offlineRecordedPredationNames));
					$.mobile.changePage("index.html");
					showToast("Data Saved Successfully.", 'bottom', 'long')

				},  function fail(e) {					
					showToast("FileSystem Error", 'bottom', 'long')
					console.log(e);
				});
		    });
	});
}

function saveTurtle(type){
	// type: 1. nest, 2. individual
	
	var data = jQuery('#turtleInfoForm').serializeArray();
	var requestData = {};
	for (var i = 0, l = data.length; i < l; i++) {
	    requestData[data[i].name] = data[i].value;
	}
	requestData.user_id = localStorage.getItem('user_id');

	if (!requestData.tagID) {
		console.log('Tag ID is required.')
		showToast('Tag ID is required.', 'center', 'long');
		return;
	}

	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
    	// ONLINE SAVING TURTLE
    	// var url = HOST + API_PATH + "saveTurtle.php?un="+username+"&mac="+ownID+"&"+content;
		var url = HOST + API_PATH + SAVE_TURTLE;
		var promise = ajaxCall(requestData,'POST',url,'json')			
		promise.success(function (data) {
		 	if(data.code == '201'){
	            console.log(data.message)
	            showToast(data.message, 'center', 'long')
	        }else if(data.code == '200'){
	        	console.log(data.message)
	        	if (type=='nest') {
	        		$.mobile.changePage("popupdialogs/dialogAssociateTurtle.html", {transition: 'slideup', role: 'dialog'});
		            window.RECENTTURTLEDATA = data.data.Turtle;
		            console.log(window.RECENTTURTLEDATA)
	        	}
	            // $("#associateTurtlePopup").popup("open");
	            
	            showToast(data.message, 'center', 'long')
	        }else{
	            showToast('Seems like something went wrong', 'center', 'long')
	        }
		})
    }else{
    	// OFFLINE TURTLE SAVING
    	saveTurtleOffline(requestData, type)
    }				
	
}

function saveTurtleOffline(data, type){
	
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
		var fileDate = new Date();
		var filename = "TURTLE_" + data.tagID + "_" + fileDate.getFullYear()+("0"+(fileDate.getMonth()+1)).slice(-2)+("0"+fileDate.getDate()).slice(-2)+("0"+fileDate.getHours()).slice(-2)+("0"+fileDate.getMinutes()).slice(-2);
		    dir.getFile(filename + ".csv", {create:true}, function(file) {
		        console.log("got the file", file);
		        logOb = file;		        
	        	if(!logOb) return;
				logOb.createWriter(function(fileWriter) {
					console.log(data);
					var fields = [];
					var values = [];
					for (var property in data) {
					    if (data.hasOwnProperty(property)) {
					        fields.push(property);
					        values.push(data[property]);
					    }
					}

					var CSV = [
					    fields.join(),
					    values.join()
					  ].join('\n');
					var contentType = 'text/csv';
					var csvFile = new Blob([CSV], {type: contentType});
					fileWriter.write(csvFile);

					if (localStorage.getItem('offlineRecordedTurtleNames')) {
						var offlineRecordedTurtleNames = JSON.parse(localStorage.getItem('offlineRecordedTurtleNames'));
					}else{
						var offlineRecordedTurtleNames = [];
					}
					offlineRecordedTurtleNames.push(filename);
					localStorage.setItem('offlineRecordedTurtleNames',JSON.stringify(offlineRecordedTurtleNames));
					showToast("Data Saved Successfully.", 'bottom', 'long')
					
					if (type=='nest') {
						$.mobile.changePage("popupdialogs/dialogAssociateTurtle.html", {transition: 'slideup', role: 'dialog'});
			            window.RECENTTURTLEDATA = data;
			        }

				},  function fail(e) {					
					showToast("FileSystem Error", 'bottom', 'long')
					console.log(e);
				});
		    });
	});
}

function syncTurtleData(filename){
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
        console.log("got main dir" + filename,dir);
        dir.getFile(filename, {create:false}, function(file) {

        	var file_data = file;   
    		var form_data = new FormData();                  
    		form_data.append('file', file_data);

            console.log("got the file", file);
            logOb = file;

            logOb.file(function(file) {
			 var reader = new FileReader();

			 	reader.onloadend = function(e) {
				 	console.log(this.result);
				 	console.log(file);
				 	console.log(logOb);
				 	var ServerURI = HOST + API_PATH + UPLOAD_TURTLE;
				 	var fileURL = file.localURL;
				 	uploadFileToServer(ServerURI, fileURL, logOb.nativeURL, 'turtle');
			 	};

			 	reader.readAsText(file);
		 	}, function fail(e) {
				alert("FileSystem Error");
				alert(e);
		 	});

        });
    });
}

function syncAllTurtleData(type){
	var networkState = navigator.connection.type;
    if (networkState !== Connection.NONE) {
    	if (type=='turtle') {
			window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,
			    function (fileSystem) {
			      	var reader = fileSystem.createReader();
			      	var list="";
			      	reader.readEntries(function (entries) {
			      		console.log(entries)
			        	for (i=0; i<entries.length; i++) {
			        		if (typeof entries[i] == 'undefined'){
			        			continue;
			        		}
			        		var offlineRecordedTurtleNames = JSON.parse(localStorage.getItem('offlineRecordedTurtleNames'));
			        		if (offlineRecordedTurtleNames.indexOf(entries[i].name.slice(0, -4)) >-1){
			        			syncTurtleData(entries[i].name, type)
			        		}
			        	}		        	
			        },
			        function (err) {
			          	alert(err);
			        });
			    }, function (err) {
			      	alert(err);
			    });
		}
    }else{    	
    	showToast("Error occured while syncing. Check your internet connection.", 'bottom', 'long');
    	return;
    }	
}

function associateTurtle(){
	console.log(window.RECENTTURTLEDATA)
	$.mobile.changePage("../record-nest.html");
}

function doNotAssociateTurtle(){
	delete window.RECENTTURTLEDATA;
	$.mobile.changePage("record-nest.html");
}


function syncPredationData(filename){
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
        console.log("got main dir" + filename,dir);
        dir.getFile(filename, {create:false}, function(file) {

        	var file_data = file;   
    		var form_data = new FormData();                  
    		form_data.append('file', file_data);

            console.log("got the file", file);
            logOb = file;

            logOb.file(function(file) {
			 var reader = new FileReader();

			 	reader.onloadend = function(e) {
				 	console.log(this.result);
				 	console.log(file);
				 	console.log(logOb);
				 	var ServerURI = HOST + API_PATH + UPLOAD_PREDATION;
				 	var fileURL = file.localURL;
				 	uploadFileToServer(ServerURI, fileURL, logOb.nativeURL, 'predation');
			 	};

			 	reader.readAsText(file);
		 	}, function fail(e) {
				alert("FileSystem Error");
				alert(e);
		 	});

        });
    });
}

function syncAllPredationData(type){
	var networkState = navigator.connection.type;
    if (networkState !== Connection.NONE) {
    	if (type=='predation') {
			window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,
			    function (fileSystem) {
			      	var reader = fileSystem.createReader();
			      	var list="";
			      	reader.readEntries(function (entries) {
			      		console.log(entries)
			        	for (i=0; i<entries.length; i++) {
			        		if (typeof entries[i] == 'undefined'){
			        			continue;
			        		}
			        		var offlineRecordedPredationNames = JSON.parse(localStorage.getItem('offlineRecordedPredationNames'));
			        		if (offlineRecordedPredationNames.indexOf(entries[i].name.slice(0, -4)) >-1){
			        			syncPredationData(entries[i].name, type)
			        		}
			        	}		        	
			        },
			        function (err) {
			          	alert(err);
			        });
			    }, function (err) {
			      	alert(err);
			    });
		}
    }else{    	
    	showToast("Error occured while syncing. Check your internet connection.", 'bottom', 'long');
    	return;
    }	
}

function setCurrentDate(field){
	var now = new Date();
	var day = ("0" + now.getDate()).slice(-2);
	var month = ("0" + (now.getMonth() + 1)).slice(-2);
	var today = now.getFullYear()+"-"+(month)+"-"+(day);
	$(field).val(today);
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

	if (!requestData.rfid) {
		console.log('RFID is required. You must have to read the nest before recording predation.')
		showToast('RFID is required. You have to read nest 	before recording.', 'center', 'long');
		return;
	}

	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
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
				showToast("Emergence data recorded", 'bottom', 'long');
			}
		});
	}else{
		saveEmergenceOffline(requestData)
	}
}

function saveEmergenceOffline(data){
	
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
		var fileDate = new Date();
		var filename = "EMERGENCE_" + data.nestID + "_" + fileDate.getFullYear()+("0"+(fileDate.getMonth()+1)).slice(-2)+("0"+fileDate.getDate()).slice(-2)+("0"+fileDate.getHours()).slice(-2)+("0"+fileDate.getMinutes()).slice(-2);
		    dir.getFile(filename + ".csv", {create:true}, function(file) {
		        console.log("got the file", file);
		        logOb = file;		        
	        	if(!logOb) return;
				logOb.createWriter(function(fileWriter) {
					console.log(data);
					var fields = [];
					var values = [];
					for (var property in data) {
					    if (data.hasOwnProperty(property)) {
					        fields.push(property);
					        values.push(data[property]);
					    }
					}

					var CSV = [
					    fields.join(),
					    values.join()
					  ].join('\n');
					var contentType = 'text/csv';
					var csvFile = new Blob([CSV], {type: contentType});
					fileWriter.write(csvFile);

					if (localStorage.getItem('offlineRecordedEmergenceNames')) {
						var offlineRecordedEmergenceNames = JSON.parse(localStorage.getItem('offlineRecordedEmergenceNames'));
					}else{
						var offlineRecordedEmergenceNames = [];
					}
					offlineRecordedEmergenceNames.push(filename);
					localStorage.setItem('offlineRecordedEmergenceNames',JSON.stringify(offlineRecordedEmergenceNames));
					$.mobile.changePage("index.html");
					showToast("Data Saved Successfully.", 'bottom', 'long')

				},  function fail(e) {					
					showToast("FileSystem Error", 'bottom', 'long')
					console.log(e);
				});
		    });
	});
}

function syncEmergenceData(filename){
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
        console.log("got main dir" + filename,dir);
        dir.getFile(filename, {create:false}, function(file) {

        	var file_data = file;   
    		var form_data = new FormData();                  
    		form_data.append('file', file_data);

            console.log("got the file", file);
            logOb = file;

            logOb.file(function(file) {
			 var reader = new FileReader();

			 	reader.onloadend = function(e) {
				 	console.log(this.result);
				 	console.log(file);
				 	console.log(logOb);
				 	var ServerURI = HOST + API_PATH + UPLOAD_EMERGENCE;
				 	var fileURL = file.localURL;
				 	uploadFileToServer(ServerURI, fileURL, logOb.nativeURL, 'emergence');
			 	};

			 	reader.readAsText(file);
		 	}, function fail(e) {
				alert("FileSystem Error");
				alert(e);
		 	});

        });
    });
}

function syncAllEmergenceData(type){
	var networkState = navigator.connection.type;
    if (networkState !== Connection.NONE) {
    	if (type=='emergence') {
			window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,
			    function (fileSystem) {
			      	var reader = fileSystem.createReader();
			      	var list="";
			      	reader.readEntries(function (entries) {
			      		console.log(entries)
			        	for (i=0; i<entries.length; i++) {
			        		if (typeof entries[i] == 'undefined'){
			        			continue;
			        		}
			        		var offlineRecordedEmergenceNames = JSON.parse(localStorage.getItem('offlineRecordedEmergenceNames'));
			        		if (offlineRecordedEmergenceNames.indexOf(entries[i].name.slice(0, -4)) >-1){
			        			syncEmergenceData(entries[i].name, type)
			        		}
			        	}		        	
			        },
			        function (err) {
			          	alert(err);
			        });
			    }, function (err) {
			      	alert(err);
			    });
		}
    }else{    	
    	showToast("Error occured while syncing. Check your internet connection.", 'bottom', 'long');
    	return;
    }	
}




function recordUncover(){

	var data = jQuery('#UncoverData').serializeArray();
	var requestData = {};
	for (var i = 0, l = data.length; i < l; i++) {
	    requestData[data[i].name] = data[i].value;
	}
	requestData.user_id = localStorage.getItem('user_id');

	if (!requestData.rfid) {
		console.log('RFID is required. You must have to read the nest before recording predation.')
		showToast('RFID is required. You have to read nest 	before recording.', 'center', 'long');
		return;
	}

	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
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
				showToast('Uncover for Control recorded', 'center', 'long');
			}
		});
	}else{
		saveUncoverOffline(requestData)
	}
}

function saveUncoverOffline(data){
	
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
		var fileDate = new Date();
		var filename = "UNCOVER_" + data.nestID + "_" + fileDate.getFullYear()+("0"+(fileDate.getMonth()+1)).slice(-2)+("0"+fileDate.getDate()).slice(-2)+("0"+fileDate.getHours()).slice(-2)+("0"+fileDate.getMinutes()).slice(-2);
		    dir.getFile(filename + ".csv", {create:true}, function(file) {
		        console.log("got the file", file);
		        logOb = file;		        
	        	if(!logOb) return;
				logOb.createWriter(function(fileWriter) {
					console.log(data);
					var fields = [];
					var values = [];
					for (var property in data) {
					    if (data.hasOwnProperty(property)) {
					        fields.push(property);
					        values.push(data[property]);
					    }
					}

					var CSV = [
					    fields.join(),
					    values.join()
					  ].join('\n');
					var contentType = 'text/csv';
					var csvFile = new Blob([CSV], {type: contentType});
					fileWriter.write(csvFile);

					if (localStorage.getItem('offlineRecordedUncoverNames')) {
						var offlineRecordedUncoverNames = JSON.parse(localStorage.getItem('offlineRecordedUncoverNames'));
					}else{
						var offlineRecordedUncoverNames = [];
					}
					offlineRecordedUncoverNames.push(filename);
					localStorage.setItem('offlineRecordedUncoverNames',JSON.stringify(offlineRecordedUncoverNames));
					$.mobile.changePage("index.html");
					showToast("Data Saved Successfully.", 'bottom', 'long')

				},  function fail(e) {					
					showToast("FileSystem Error", 'bottom', 'long')
					console.log(e);
				});
		    });
	});
}

function syncUncoverData(filename){
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(dir) {
        console.log("got main dir" + filename,dir);
        dir.getFile(filename, {create:false}, function(file) {

        	var file_data = file;   
    		var form_data = new FormData();                  
    		form_data.append('file', file_data);

            console.log("got the file", file);
            logOb = file;

            logOb.file(function(file) {
			 var reader = new FileReader();

			 	reader.onloadend = function(e) {
				 	console.log(this.result);
				 	console.log(file);
				 	console.log(logOb);
				 	var ServerURI = HOST + API_PATH + UPLOAD_UNCOVER;
				 	var fileURL = file.localURL;
				 	uploadFileToServer(ServerURI, fileURL, logOb.nativeURL, 'uncover');
			 	};

			 	reader.readAsText(file);
		 	}, function fail(e) {
				alert("FileSystem Error");
				alert(e);
		 	});

        });
    });
}

function syncAllUncoverData(type){
	var networkState = navigator.connection.type;
    if (networkState !== Connection.NONE) {
    	if (type=='uncover') {
			window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory,
			    function (fileSystem) {
			      	var reader = fileSystem.createReader();
			      	var list="";
			      	reader.readEntries(function (entries) {
			      		console.log(entries)
			        	for (i=0; i<entries.length; i++) {
			        		if (typeof entries[i] == 'undefined'){
			        			continue;
			        		}
			        		var offlineRecordedUncoverNames = JSON.parse(localStorage.getItem('offlineRecordedUncoverNames'));
			        		if (offlineRecordedUncoverNames.indexOf(entries[i].name.slice(0, -4)) >-1){
			        			syncUncoverData(entries[i].name, type)
			        		}
			        	}		        	
			        },
			        function (err) {
			          	alert(err);
			        });
			    }, function (err) {
			      	alert(err);
			    });
		}
    }else{    	
    	showToast("Error occured while syncing. Check your internet connection.", 'bottom', 'long');
    	return;
    }	
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


function scanOnceSuccess(rfid){
	//navigator.notification.beep(2);
	//alert(rfidRunning+"");
	if ($.inArray(rfid,tags)==-1){
		curTag = rfid;
		if (rfidRunning==1){
			//	stopRFID();
			$.mobile.loading('hide');
			//	alert("running and true");
		}
		if ($('#rfid').val()==""){
			//	alert(rfid);
			$.mobile.loading('hide');
			$('#rfid').val(rfid+"");			
		}

		var requestData = {};
		requestData.id = rfid;

		$.ajax({
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
			complete: function() { $.mobile.loading('hide'); }, //Hide spinner
			// url: HOST + API_PATH + "findNests.php?un="+username+"&rfid="+curTag+"&dbid="+curDbId,
			dataType:"json",
			url: HOST + API_PATH + FIND_NESTS_BY_RFID,
			data:requestData,
			type: "POST",

			success: function(data) {
				
				// var eventTime = (new Date(data.data.Nest.timestamp)).toDateString();
				// var nestingDate = (new Date(data.data.Nest.nestingDate)).toDateString();
				
				/*				
				var htmlInfo = "<div data-role='collapsible' ><h3>"+data.data.Nest.NestID+"</h3><p><div class='ui-grid-a'>";
				$.each(data[0],function (key,val){
					htmlInfo = htmlInfo + "<div class='ui-block-a'><div class='ui-bar ui-bar-a' style='height:30px'>"+key+"</div></div>"+
					"<div class='ui-block-b'><div class='ui-bar ui-bar-a' id='nest"+key+"' style='height:30px'>"+val+"</div></div>";
				});
				*/

				// nestID = data.data.Nest.NestID;
				// curDbId = data[0].id;
				// curTag = data[0].rfid;
				$('#locationPred').html(data.data[0].Nest.origLat+", "+data.data[0].Nest.origLong);
				$('#nestID').val(data.data[0].Nest.NestID);
				// var htmlInfo = htmlInfo + "</div><!-- /grid-a --></p></div>";				
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
	window.currentNestId = id;
	if(rfidRunning == true){
		//alert("Stopping RFID");
		stopRFID();
	} else{
		//alert("RFID not running");
	}
	// curDbId= id;
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
			window.currentNestData = data;
			// window.curTag = data.data.Nest.rfid;

			var eventTime = (new Date(data.data.Nest.timestamp)).toDateString();
			var nestingDate = (new Date(data.data.Nest.nestingDate)).toDateString();
			
			var htmlInfo = "<div data-role='collapsible' ><h3>"+data.data.Nest.NestID+"</h3><p><div class='ui-grid-a'>";
			$.each(data.data.Nest,function (key,val){

				if (key == "rfid"){
					// window.curTag = val;
				}
				htmlInfo = htmlInfo + "<div class='ui-block-a'><div class='ui-bar ui-bar-a'>"+key.replace(/([A-Z])/g, ' $1').trim()+"</div></div>" + "<div class='ui-block-b'><div class='ui-bar ui-bar-a' id='nest"+key+"'>";
				if (val==null) {
					htmlInfo = htmlInfo + " - </div></div>";
				}else{
					htmlInfo = htmlInfo + val+"</div></div>";
				}
				
			});
			nestID = data.data.Nest.NestID;
			curDbId = data.data.Nest.id;
			nestData = data.data.Nest;
			htmlInfo = htmlInfo + "</div><!-- /grid-a --></p></div>";
			//	$("#nestInfo").html(htmlInfo);
				if (data.data.Nest.adoptId != ""){
			//		$("#linkaAdoptAnestButton").button( "disable" );
				}		
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


function editNest(edNestID){
	//	alert("editing "+edNestID);
	console.log(edNestID)
	$.mobile.changePage("edit-nest.html");
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
			
			// $('#successfulButton').html("Save").button("refresh");
			$('#unsuccessfulButton').attr("display", "none").button("refresh");
		}	
	});
}

function setNestFieldsValue(){
	var nestData = window.currentNestData.data.Nest
	var eventTime = (new Date(nestData.timestamp)).toDateString();
	var nestingDate = (new Date(nestData.nestingDate)).toDateString();
	$('#dbid').val(nestData.id);
	$('#rfid').val(nestData.rfid);
	$('#nestID').val(nestData.NestID);
	$('#Specie').val(nestData.species).selectmenu("refresh");
	// $('#species').val(nestData.species);
	$('#gridCover').val(nestData.gridCover).selectmenu("refresh");
	// $('#gridcover').val(nestData.gridCover);
	$('#alt_lat').val(nestData.alt_lat);
	$('#alt_long').val(nestData.alt_long);
	$('#alt_loc').val(nestData.alt_lat + "," + nestData.alt_long);
	$('#lat').val(nestData.origLat);
	$('#long').val(nestData.origLong);
	$('#loc').val(nestData.origLat + 	"," + nestData.origLong);
	$('#alt_date').val(nestData.alternationTime);
	$('#alt_drySand').val(nestData.alt_drySand);
	$('#alt_wetSand').val(nestData.alt_wetSand);
	$('#alt_diaEggChamb').val(nestData.origLong);
	$('#alt_dmgEggs').val(nestData.alt_dmgEggs);
	$('#alt_totEggs').val(nestData.alt_totEggs);
	$('#nestingDate').attr("disabled");
	$('#certain').val(nestData.certain).selectmenu("refresh");
	$('#wetZone').val(nestData.wetZone);
	$('#drySandZone').val(nestData.drySand);
	$('#vegetation').val(nestData.vegetation);
	$('#distSea').val(nestData.distanceFromSea);
	$('#leftLandMark').val(nestData.leftLandMark).selectmenu("refresh");
	// $('#leftLandMark').val(nestData.leftLandMark);
	$('#leftMarkNum').val(nestData.leftMarkNum);
	// $('#leftMarkDist').val(nestData.leftMarkDist);
	$('#rightLandMark').val(nestData.rightLandMark).selectmenu("refresh");
	$('#rightLandMark').val(nestData.rightLandMark);
	$('#rightMarkNum').val(nestData.rightMarkNum);
	$('#rightMarkDist').val(nestData.rightMarkDist);
	$('#nestLoc').val(nestData.nestLoc).selectmenu("refresh");
	// $('#nestLoc').val(nestData.nestLoc);
	$('#turtleId').val(nestData.turtleId);
	$('#turtleTagID').val(nestData.turleTagId);
	
	$('#nestingTime').val(nestData.nestingTime);
	$('#tideZone').val(nestData.tideZone);
	$('#tideZone').val(nestData.distanceFromSea);
	$('#heightOfWetSand').val(nestData.heightOfWetSand);
	$('#heightOfDrySand').val(nestData.heightOfDrySand);
	$('#dmgEggs').val(nestData.dmgEggs);
	$('#totEggs').val(nestData.totEggs);
	$('#diaEggChamb').val(nestData.diameterEggChamber);
	$('#numberOfBodyPits').val(nestData.numberOfBodyPits);
	$('#comment').val(nestData.comment);
	$('#devices').val(nestData.devices);
	$('#primaryId').val(nestData.id);
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
				localStorage.setItem("nestFields", JSON.stringify(data.data.onloadInfo));
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
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
    	// ONLINE APPENDING DATA TO FIELDS
        var url= HOST + API_PATH + GET_RECORD_NEST_INFORMATION;
		var data = {user_id:localStorage.getItem('user_id')}
		$.ajax({
			type: "POST",
			data: data,
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
			complete: function() { $.mobile.loading('hide'); }, //Hide spinner
			url: url,
			success: function(data) {
				if (data.code=="200"){
					console.log(data);
					setNestDataField(data.data)
				}else if(data.code=="201"){
					showToast('Seems like something went wrong.', 'bottom', 'long')
				}else{
					showToast('Seems like something went wrong.', 'bottom', 'long')
				}
			},
			dataType:"json"
		});
    }else{
    	// OFFLINE APPENDING DATA TO FIELDS
    	var nestFields = JSON.parse(localStorage.getItem("nestFields"))
    	console.log(nestFields)
    	setNestDataField(nestFields)
    }

    if(window.RECENTTURTLEDATA){    	
    	$("#turtleTagID").val(window.RECENTTURTLEDATA.tagID);
    	$("#turtleId").val(window.RECENTTURTLEDATA.id);
    	$("#turtlesAutoComplete").hide();
    	console.log(window.RECENTTURTLEDATA)
    	// delete window.RECENTTURTLEDATA;
    }
}

function setNestDataField(nestData){
	var Specie = nestData.Specie;
	$.each(Specie, function (i, item) {
	    $('#Specie').append($('<option>', { 
	        value: i,
	        text : item 
	    }));
	});

	var AlterationTime = nestData.AlterationTime;
	$.each(AlterationTime, function (i, item) {
	    $('#AlterationTime').append($('<option>', { 
	        value: i,
	        text : item 
	    }));
	});

	var leftLandMarkAlt = nestData.NestLandmark;
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

	var NestLocationAlt = nestData.RelocatedNestLocation;
	$.each(NestLocationAlt, function (i, item) {
	    $('#nestLocAlt').append($('<option>', { 
	        value: i,
	        text : item 
	    }));
	});

	var NestLocation = nestData.NestLocation;
	$.each(NestLocation, function (i, item) {
	    $('#nestLoc').append($('<option>', { 
	        value: i,
	        text : item 
	    }));
	});

	var RelocatedNestCover = nestData.RelocatedNestCover;
	$.each(RelocatedNestCover, function (i, item) {
	    $('#gridcoverAlt').append($('<option>', { 
	        value: i,
	        text : item 
	    }));
	});

	var NestCover = nestData.NestCover;
	$.each(NestCover, function (i, item) {
	    $('#gridCover').append($('<option>', { 
	        value: i,
	        text : item 
	    }));
	});
}


/********* GET ALL PREDATION INFORMATION NEEDED ON PREDATION CREATION PAGE ******/

function fetchPredationData(){
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
		var url= HOST + API_PATH + GET_RECORD_NEST_INFORMATION;
		var data = {user_id:localStorage.getItem('user_id')}
		$.ajax({
			type: "POST",
			data: data,
			beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
			complete: function() { $.mobile.loading('hide'); }, //Hide spinner
			url: url,
			success: function(data) {
				if (data.code=="200"){
					console.log(data);
					setPredationFields(data.data)
				}else if(data.code=="201"){
					showToast('Seems like something went wrong.', 'bottom', 'long')

				}else{
					showToast('Seems like something went wrong.', 'bottom', 'long')
				}
			},
			dataType:"json"
		});
	}else{
		// OFFLINE APPENDING DATA TO FIELDS
    	var nestFields = JSON.parse(localStorage.getItem("nestFields"))
    	setPredationFields(nestFields)
	}
	
}

function setPredationFields(nestData) {
	var Predator = nestData.Predator;
	$.each(Predator, function (i, item) {
	    $('#predator').append($('<option>', { 
	        value: i,
	        text : item 
	    }));
	});

	var NestCover = nestData.NestCover;
	$.each(NestCover, function (i, item) {
	    $('#gridcover').append($('<option>', { 
	        value: i,
	        text : item 
	    }));
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

function remindLaterOfflineNotification() {
	setTimeout(function(){ $("#offlineNotificationPopup").popup("open"); }, 60000);
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
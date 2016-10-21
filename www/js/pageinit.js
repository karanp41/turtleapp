$(document).on('pageinit','#recordNestPage', function(){	
	getCurLoc();
	getRecordNestInformation();
	$('#rfid').val(curTag);
	$('#rfidHEX').val(curTag);
	populateTurtlesList();    
});

$(document).on('pageinit','#nestInfoPage', function(){
	console.log('curTag: '+curTag)
	populateNestInfo(curTag);
});

$(document).on('pageinit','#mainPage', function(){
	curCircle=null;
	curPos=null;
	mapInit();
});

$(document).on('pageinit','#findNest', function(){
	curCircle=null;
	curPos=null;
	mapInitFind(curTag);
});

$(document).on('pageshow','#mainPage', function(){
//	updateMap();
});

$(document).on('pageinit','#predationPage', function(){
	$('#locationPred').html(lat.toFixed(5)+", "+long.toFixed(5));
	$('#rfid').val(curTag);
	$('#nestID').val(nestID);
	fetchPredationData();
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

$(document).on('pageinit','#turtleInfo', function(){
	setCurrentDate('#replacedDate');
	setCurrentDate('#taggingDate');
});

$(document).on('pageinit','#nestListPage', function(){
	populateNestList();
});

$(document).on('pageinit','#offlineListPage', function(){
	listOfflineEvents();
});

$(document).on('pageinit','#temperature', function(){
	listOfflineTemps();
});

$(document).on('pageinit','#turtles', function(){
	populateTurtlesListView();
});

$(document).on('pageinit','#menuPage', function(){
	console.log('here');
});


/*
$(document).on('pagebeforeshow', "#recordNestPage", function (event, data) {

	console.log(parameters)
	if(parameters){
		parameter = parameters.replace("resetData=","");  
	    if(parameter==1){
	    	console.log('Need to reset')
		}else{
			console.log('no Need to reset')
		}
	}
});*/
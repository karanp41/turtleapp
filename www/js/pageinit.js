$(document).on('pageinit','#recordNestPage', function(){	
	getCurLoc();
	getRecordNestInformation();
	$('#rfid').val(curTag);
	$('#rfidHEX').val(curTag);
	populateTurtlesList();    
});

$(document).on("pagebeforehide","#recordNestPage",function(){ // When leaving pagetwo
	console.log("recordNestPage is about to be hidden");
	if (window.RECENTTURTLEDATA) {
		delete window.RECENTTURTLEDATA;	
	}
});

$(document).on('pageinit','#editNestPage', function(){
	console.log('currentNestData: ', window.currentNestData)
	getRecordNestInformation()	
	setTimeout(function() {setNestFieldsValue()}, 100);
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
	// $('#rfid').val(curTag);
	// $('#nestID').val(nestID);
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

$(document).on('pageinit','#nestInfoPage', function(){
	var networkState = navigator.connection.type;
	if (networkState !== Connection.NONE) {
		console.log('currentNestId: '+currentNestId)
		populateNestInfo(currentNestId);
	}else{
		nestDetailOffline(window.currentOfflineNest);
	}
});

$(document).on('pageinit','#offlineListPage', function(){
	listOfflineEvents();
});

$(document).on('pageinit','#offlineTurtlesListPage', function(){	
	listOfflineTurtles();
});

$(document).on('pageinit','#offlinePredationListPage', function(){	
	listOfflinePredations();
});

$(document).on('pageinit','#offlineEmergenceListPage', function(){	
	listOfflineEmergence();
});

$(document).on('pageinit','#offlineUncoverListPage', function(){	
	listOfflineUncover();
});

$(document).on('pageinit','#offlineLoggerListPage', function(){	
	listOfflineLogger();
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

$(document).on('pageinit','#inNestTempRecord', function(){	
	$("[name=deviceType]").click(function(){		
        $('.ui-block-c').hide();
        $("#daysOperating-"+$(this).val()).show('slow');
    });
	getCurLoc();
});
$(document).on('pageinit','#experimentalTempRecord', function(){	
	$("[name=deviceType]").click(function(){		
        $('.ui-block-c').hide();
        $("#daysOperating-"+$(this).val()).show('slow');
    });
	getCurLoc();
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
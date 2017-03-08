$(document).on('pageinit','#recordNestPage', function(){	
	getCurLoc();
	getRecordNestInformation();
	// $('#rfid').val(curTag);
	// $('#rfidHEX').val(curTag);
	populateTurtlesList();
	$("[name=turtleType]").click(function(){
		setNestIdOnTurtelForm()
		var val = $(this).val()
		if (val==1) {$( "#popupAddTurtle" ).popup( "open" );$("html, body").animate({ scrollTop: 0 }, "slow")}
		else{$( "#turtleTagID" ).focus()}	
        // $('.ui-block-c').hide();
        // $("#daysOperating-"+$(this).val()).show('slow');
        // ($(this).val()==1)? $('#depthOfProbeContainer').hide() : $("#depthOfProbeContainer").show('slow');
    });
});

$(document).on('pageinit','#nonNestingEmergence', function(){	
	getCurLoc();
	getRecordNestInformation();
	populateTurtlesList();
	$("[name=turtleType]").click(function(){
		setNestIdOnTurtelForm()
		var val = $(this).val()
		if (val==1) {$( "#popupAddTurtle" ).popup( "open" );$("html, body").animate({ scrollTop: 0 }, "slow")}
		else{$( "#turtleTagID" ).focus()}	
        
    });
});

$(document).on('pageinit','#relocateNestPage', function(){
	getCurLoc();
	getRecordNestInformation();
	setTimeout(function() {setNestFieldsValue()}, 100);
});

$(document).on("pagebeforehide","#recordNestPage",function(){
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
	getCurLoc()
	fetchPredationData();
	if (window.currentNestEventsData) {
		setTimeout(function() {prefillCurrentNestPredationData()}, 100);
	}
});

$(document).on('pageinit','#emergPage', function(){
	getCurLoc()
	// $('#locationEmerg').html(lat.toFixed(5)+", "+long.toFixed(5));
	if (window.currentNestEventsData) {
		setTimeout(function() {prefillCurrentNestEmergenceData()}, 100);
	}
	// $('#rfid').val(curTag);
	// $('#nestID').val(nestID);
});

$(document).on('pageinit','#nonNestingEmergence', function(){
	getCurLoc()
	// if (window.currentNestEventsData) {
	// 	setTimeout(function() {prefillCurrentNestEmergenceData()}, 100);
	// }
});

$(document).on('pageinit','#uncoverPage', function(){
	getCurLoc()
	// $('#locationUncover').html(lat.toFixed(5)+", "+long.toFixed(5));
	// $('#rfid').val(curTag);
	// $('#nestID').val(nestID);
});

$(document).on('pageinit','#turtleInfo', function(){
	setCurrentDate('#replacedDate');
	setCurrentDate('#taggingDate');
});

$(document).on('pageinit','#nestListPage', function(){
	$( "#popupPanel" ).on({
	    popupbeforeposition: function() {
	        var h = $( window ).height();

	        $( "#popupPanel" ).css( "height", h );
	    }
	});
	populateNestList();
});

$(document).on('pageinit','#nneListPage', function(){
	populateNneList();
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

$(document).on("pagebeforehide","#nestInfoPage",function(){
	if (window.currentNestEventsData) {
		// console.log(window.currentNestEventsData)
		// delete window.currentNestEventsData;	
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

$(document).on('pageinit','#offlineRelocatedListPage', function(){	
	listOfflineRelocatedNests();
});

$(document).on('pageinit','#temperature', function(){
	// listOfflineTemps();
});

$(document).on('pageinit','#turtles', function(){
	populateTurtlesListView();
});

$(document).on('pageinit','#addTurtleSimple', function(){
	getCurLoc();
});

$(document).on('pageinit','#menuPage', function(){
	console.log('here');
});

$(document).on('pageinit','#inNestTempRecord', function(){	
	$("[name=deviceType]").click(function(){		
        $('.ui-block-c').hide();
        $("#daysOperating-"+$(this).val()).show('slow');
        ($(this).val()==1)? $('#depthOfProbeContainer').hide() : $("#depthOfProbeContainer").show('slow');
    });
	getCurLoc();
	// setCurrentDateTime('#startDate');
	setCurrentDate('#startDate');
});

$(document).on('pageinit','#experimentalTempRecord', function(){	
	$("[name=deviceType]").click(function(){		
        $('.ui-block-c').hide();
        $("#daysOperating-"+$(this).val()).show('slow');
        ($(this).val()==1)? $('#depthOfProbeContainer').hide() : $("#depthOfProbeContainer").show('slow');
    });
	getCurLoc();	
	// setCurrentDateTime('#startDate');
	setCurrentDate('#startDate');
});

$(document).on('pageinit','#selectUser', function(){
	setTeamData()
});

$(document).on('pageinit','#offlineReadLoggerListPage', function(){
	listOfflineReadLoggers()
});

$(document).on('pageinit','#tempDataInfoPage', function(){
	tempDataDetails()
});

$(document).on("pagebeforehide","#tempDataInfoPage",function(){
	// if (plotTemp) {
	// 	plotTemp.destroy();
	// }
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
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
var watchID=null;
var markers = [];
var polyline = null; 

var logOb = null;



/**********     OTHER CONSTANT    ********/

var DYNAMIC_FIELDS_ARRAY = ['nestLoc', 'gridCover', 'rightLandMark', 'leftLandMark', 'certain', 'Specie', 'altTimeOptions', 'altLeftLandmark', 'altRightLandmark', 'alt_nestLoc', 'gridCoverAlt']

var DYNAMIC_RADIO_FIELDS_ARRAY = ['deviceType']

var DYNAMIC_TO_SKIP_FIELDS_ARRAY = ['rfid', 'loggerRFID']

var NEST_FIELDS_TO_SKIP = ['id']




/**********    CONFIG CONSTANT    ********/

var options = {maximumAge:600, timeout:50000, enableHighAccuracy: true};
var POS_OPTIONS = {maximumAge:0, timeout:10000, enableHighAccuracy: true};
var POS_OPTIONS_MINIFY = {
	timeout: 1000, 
	enableHighAccuracy: false
};



/**********    API CONSTANT    ********/

var HOST = 'http://203.100.79.86:8005/';
// var HOST = 'http://192.155.246.146:8292/';

var API_PATH = 'webservices/';
// var API_PATH = 'application/ajax/';

var LOGIN = 'login';
var GET_RECORD_NEST_INFORMATION = 'getRecordNestInformation';

var SAVE_NEST 		= 'saveNest';
var LIST_NESTS 		= 'listNests';
var FIND_NESTS 		= 'findNests';
var FIND_NESTS_BY_RFID = 'NestByRFID';

var LIST_TURTLES 	= 'listTurtles';
var LIST_NEST_EVENTS= 'nestEvents';

var SAVE_TURTLE 	= 'saveTurtle';
var SAVE_PREDATIONS = 'savePredations';
var SAVE_EMERGENCE 	= 'saveEmergences';
var SAVE_UNCOVER 	= 'saveUncover';

var NEST_PREDATION 	= 'nestPredation';

var UPLOAD_FILE 	= 'UploadCSV';
var UPLOAD_NEST 	= 'uploadOfflineNests';
var UPLOAD_TURTLE 	= 'uploadOfflineTurtles';
var UPLOAD_PREDATION= 'uploadOfflinePredation';
var UPLOAD_EMERGENCE= 'uploadOfflineEmergence';
var UPLOAD_UNCOVER	= 'uploadOfflineUncover';
var UPLOAD_LOGGER	= 'saveOfflineTempInfo';

var SAVE_TEMP_INFO	= 'saveTempInfo';
var WRITE_LOG		= 'writeLog';
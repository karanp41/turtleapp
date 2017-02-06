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
var LOGGERS_RFID_DATA = {};
var SELECTED_RFID = '';

// 3 pillar global

/**********     OTHER CONSTANT    ********/

var DYNAMIC_FIELDS_ARRAY = ['nestLoc', 'gridCover', 'rightLandMark', 'leftLandMark', 'certain', 'Specie', 'altTimeOptions', 'altLeftLandmark', 'altRightLandmark', 'alt_nestLoc', 'gridCoverAlt']

var DYNAMIC_RADIO_FIELDS_ARRAY = ['deviceType']

var DYNAMIC_TO_SKIP_FIELDS_ARRAY = ['rfid', 'loggerRFID']

var NEST_FIELDS_TO_SKIP = ['id','flagged','created','modified','user_id','tempCount','success','timestamp','wetSand']

var NEST_FIELDS_TO_REPLACE_NAME = {NestID:"NEST ID",alt_nestLoc:"ALT NEST AREA",gridCover:"NEST COVER WITH",drySand:"DRY ZONE",nestLoc:"NEST AREA",comment:"COMMENT ORIG NEST",certain:"DAYS UNCERTAIN",alternationTime:"ALTERATION TIME"}

var NEST_DETAILS_SORT_SERIAL = [
									"NestID",
									"rfid",
									"adoptId",
									"turtleId",
									"nestingDate",
									"nestingTime",
									"certain",
									"species",
									"origLat",
									"origLong",
									"probability",
									"dataLoggerId",
									"timestamp",
									"wetSand",
									
									"tideZone",
									"wetZone",
									"drySand",
									"distanceFromSea",
									"vegetation",
									"leftLandMark",
									"leftMarkNum",
									"leftMarkDist",
									"rightLandMark",
									"rightMarkNum",
									"rightMarkDist",									
									
									"nestLoc",
									"heightOfWetSand",
									"heightOfDrySand",
									"diameterEggChamber",
									"totEggs",
									"dmgEggs",
									"numberOfBodyPits",
									"gridCover",
									"comment",
									"devices",

									"alt_tideZone",
									"alt_wetZone",									
									"alt_dryZone",
									"alt_distSea",
									"alt_vegetation",
									"altTimeOptions",
									"alternationTime",
									"alt_lat",
									"alt_long",
									"gridCoverAlt",
									"alt_nestLoc",

									"altLeftLandmark",
									"altLeftLandmarkNum",
									"altLeftLandmarkDist",

									"altRightLandmark",
									"altRightLandmarkNum",
									"altRightLandmarkDist",

									"commentAlt",
									"devicesAlt",
									"flag_reason",

									"created",
									"flagged",
									"id",
									"modified",
									"success",
									"tempCount",
									"user_id"
								]



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
var REMOVE_FLAG 	= 'removeFlag';

var LIST_TURTLES 	= 'listTurtles';
var LIST_NEST_EVENTS= 'nestEvents';

var SAVE_TURTLE 	= 'saveTurtle';
var SAVE_PREDATIONS = 'savePredations';
var SAVE_EMERGENCE 	= 'saveEmergences';
var SAVE_UNCOVER 	= 'saveUncover';
var SAVE_TEMP_INFO	= 'saveTempInfo';

var NEST_PREDATION 	= 'nestPredation';

var UPLOAD_FILE 		= 'UploadCSV';
var UPLOAD_NEST 		= 'uploadOfflineNests';
var UPLOAD_TURTLE 		= 'uploadOfflineTurtles';
var UPLOAD_PREDATION	= 'uploadOfflinePredation';
var UPLOAD_EMERGENCE	= 'uploadOfflineEmergence';
var UPLOAD_UNCOVER		= 'uploadOfflineUncover';
var UPLOAD_LOGGER		= 'saveOfflineTempInfo';
var UPLOAD_READ_LOGGER	= 'uploadTemp';

var WRITE_LOG		= 'writeLog';









/**********     DUMMY TEMP DATA VALUES     *********/

var DUMMY_TEMPDATA = [["2016-08-19 15:22:08",23.2],["2016-08-19 18:46:56",27.5],["2016-08-19 20:29:20",26.7],["2016-08-19 22:11:44",24.8],["2016-08-19 22:11:44",24.3],["2016-08-19 20:29:20",24.1],["2016-08-19 22:11:44",24.0],["2016-08-19 23:54:08",24.1],["2016-08-20 05:01:20",24.0],["2016-08-19 22:11:44",23.8],["2016-08-19 23:54:08",23.8],["2016-08-20 01:36:32",24.0],["2016-08-20 11:50:56",23.8],["2016-08-19 23:54:08",23.6],["2016-08-20 01:36:32",24.3],["2016-08-20 03:18:56",24.5],["2016-08-20 18:40:32",23.8],["2016-08-20 01:36:32",23.0],["2016-08-20 03:18:56",22.1],["2016-08-20 05:01:20",21.0],["2016-08-21 01:30:08",20.7],["2016-08-20 03:18:56",21.0],["2016-08-20 05:01:20",21.2],["2016-08-20 06:43:44",21.2],["2016-08-21 08:19:44",21.3],["2016-08-20 05:01:20",21.6],["2016-08-20 06:43:44",21.7],["2016-08-20 08:26:08",21.8],["2016-08-21 15:09:20",21.8],["2016-08-20 06:43:44",22.1],["2016-08-20 08:26:08",22.5],["2016-08-20 10:08:32",22.2],["2016-08-21 21:58:56",21.5],["2016-08-20 08:26:08",21.2],["2016-08-20 10:08:32",21.2],["2016-08-20 11:50:56",21.0],["2016-08-22 04:48:32",21.1],["2016-08-20 10:08:32",21.3],["2016-08-20 11:50:56",21.5],["2016-08-20 13:33:20",21.6],["2016-08-22 11:38:08",21.8],["2016-08-20 11:50:56",22.2],["2016-08-20 13:33:20",23.0],["2016-08-20 15:15:44",23.5],["2016-08-22 18:27:44",24.3],["2016-08-20 13:33:20",23.2],["2016-08-20 15:15:44",22.1],["2016-08-20 16:58:08",22.3],["2016-08-23 01:17:20",22.6],["2016-08-20 15:15:44",22.7],["2016-08-20 16:58:08",23.0],["2016-08-20 18:40:32",23.0],["2016-08-23 08:06:56",23.1],["2016-08-20 16:58:08",23.0],["2016-08-20 18:40:32",23.0],["2016-08-20 20:22:56",23.0],["2016-08-23 14:56:32",23.5],["2016-08-20 18:40:32",23.6],["2016-08-20 20:22:56",23.7],["2016-08-20 22:05:20",23.7],["2016-08-23 21:46:08",23.6],["2016-08-20 20:22:56",23.6],["2016-08-20 22:05:20",23.3],["2016-08-20 23:47:44",23.1],["2016-08-24 04:35:44",22.7],["2016-08-20 22:05:20",22.5],["2016-08-20 23:47:44",22.2],["2016-08-21 01:30:08",22.2],["2016-08-24 11:25:20",22.2],["2016-08-20 23:47:44",22.2],["2016-08-21 01:30:08",22.3],["2016-08-21 03:12:32",22.5],["2016-08-24 18:14:56",22.7],["2016-08-21 01:30:08",22.8],["2016-08-21 03:12:32",23.1],["2016-08-21 04:54:56",23.2],["2016-08-25 01:04:32",23.2],["2016-08-21 03:12:32",23.2],["2016-08-21 04:54:56",23.1],["2016-08-21 06:37:20",23.1],["2016-08-25 07:54:08",23.0],["2016-08-21 04:54:56",23.0],["2016-08-21 06:37:20",22.8],["2016-08-21 08:19:44",22.7],["2016-08-25 14:43:44",22.6],["2016-08-21 06:37:20",22.8],["2016-08-21 08:19:44",23.0],["2016-08-21 10:02:08",23.0],["2016-08-25 21:33:20",23.0],["2016-08-21 08:19:44",23.0],["2016-08-21 10:02:08",23.0],["2016-08-21 11:44:32",22.8],["2016-08-26 04:22:56",22.7],["2016-08-21 10:02:08",22.6],["2016-08-21 11:44:32",22.5],["2016-08-21 13:26:56",22.5],["2016-08-26 11:12:32",22.5],["2016-08-21 11:44:32",22.3],["2016-08-21 13:26:56",22.2],["2016-08-21 15:09:20",22.2],["2016-08-26 18:02:08",22.2],["2016-08-21 13:26:56",22.5],["2016-08-21 15:09:20",22.5],["2016-08-21 16:51:44",22.6],["2016-08-27 00:51:44",22.7],["2016-08-21 15:09:20",22.6],["2016-08-21 16:51:44",22.5],["2016-08-21 18:34:08",22.3],["2016-08-27 07:41:20",22.2],["2016-08-21 16:51:44",22.1],["2016-08-21 18:34:08",22.1],["2016-08-21 20:16:32",22.1],["2016-08-27 14:30:56",22.2],["2016-08-21 18:34:08",22.3],["2016-08-21 20:16:32",22.6],["2016-08-21 21:58:56",22.6],["2016-08-27 21:20:32",22.6],["2016-08-21 20:16:32",22.6],["2016-08-21 21:58:56",22.3],["2016-08-21 23:41:20",22.1],["2016-08-28 04:10:08",22.0],["2016-08-21 21:58:56",21.8],["2016-08-21 23:41:20",21.7],["2016-08-22 01:23:44",21.7],["2016-08-28 10:59:44",21.7],["2016-08-21 23:41:20",21.6],["2016-08-22 01:23:44",22.0],["2016-08-22 03:06:08",22.3],["2016-08-28 17:49:20",22.5],["2016-08-22 01:23:44",22.5],["2016-08-22 03:06:08",22.2],["2016-08-22 04:48:32",22.2],["2016-08-29 00:38:56",22.3],["2016-08-22 03:06:08",22.3],["2016-08-22 04:48:32",22.2],["2016-08-22 06:30:56",22.2],["2016-08-29 07:28:32",22.1],["2016-08-22 04:48:32",22.1],["2016-08-22 06:30:56",22.0],["2016-08-22 08:13:20",22.0],["2016-08-29 14:18:08",22.1],["2016-08-22 06:30:56",22.1],["2016-08-22 08:13:20",22.3],["2016-08-22 09:55:44",22.7],["2016-08-29 21:07:44",22.7],["2016-08-22 08:13:20",22.7],["2016-08-22 09:55:44",22.8],["2016-08-22 11:38:08",22.7],["2016-08-30 03:57:20",22.7],["2016-08-22 09:55:44",22.6],["2016-08-22 11:38:08",22.5],["2016-08-22 13:20:32",22.5],["2016-08-30 10:46:56",22.6],["2016-08-22 11:38:08",22.7],["2016-08-22 13:20:32",22.8],["2016-08-22 15:02:56",23.0],["2016-08-30 17:36:32",23.1],["2016-08-22 13:20:32",23.1],["2016-08-22 15:02:56",23.0],["2016-08-22 16:45:20",22.8],["2016-08-31 00:26:08",23.0],["2016-08-22 15:02:56",23.1],["2016-08-22 16:45:20",23.0],["2016-08-22 18:27:44",23.0],["2016-08-31 07:15:44",23.0],["2016-08-22 16:45:20",23.0],["2016-08-22 18:27:44",22.8],["2016-08-22 20:10:08",22.8],["2016-08-31 14:05:20",22.8],["2016-08-22 18:27:44",23.0],["2016-08-22 20:10:08",23.1],["2016-08-22 21:52:32",23.1],["2016-08-31 20:54:56",23.2],["2016-08-22 20:10:08",23.2],["2016-08-22 21:52:32",23.3],["2016-08-22 23:34:56",23.3],["2016-09-01 03:44:32",23.3],["2016-08-22 21:52:32",23.2],["2016-08-22 23:34:56",23.1],["2016-08-23 01:17:20",23.1],["2016-09-01 10:34:08",23.1],["2016-08-22 23:34:56",23.1],["2016-08-23 01:17:20",23.0],["2016-08-23 02:59:44",23.0],["2016-09-01 17:23:44",23.1],["2016-08-23 01:17:20",23.0],["2016-08-23 02:59:44",22.8],["2016-08-23 04:42:08",22.8],["2016-09-02 00:13:20",23.0],["2016-08-23 02:59:44",23.0],["2016-08-23 04:42:08",22.8],["2016-08-23 06:24:32",22.7],["2016-09-02 07:02:56",22.5],["2016-08-23 04:42:08",22.5],["2016-08-23 06:24:32",22.5],["2016-08-23 08:06:56",22.6],["2016-09-02 13:52:32",22.6],["2016-08-23 06:24:32",22.7],["2016-08-23 08:06:56",22.7],["2016-08-23 09:49:20",22.7],["2016-09-02 20:42:08",22.7],["2016-08-23 08:06:56",22.8],["2016-08-23 09:49:20",23.0],["2016-08-23 11:31:44",23.1],["2016-09-03 03:31:44",23.0],["2016-08-23 09:49:20",22.8],["2016-08-23 11:31:44",22.7],["2016-08-23 13:14:08",22.6],["2016-09-03 10:21:20",22.5],["2016-08-23 11:31:44",22.6],["2016-08-23 13:14:08",22.8],["2016-08-23 14:56:32",22.8],["2016-09-03 17:10:56",22.7],["2016-08-23 13:14:08",23.1],["2016-08-23 14:56:32",23.2],["2016-08-23 16:38:56",23.0],["2016-09-04 00:00:32",22.8],["2016-08-23 14:56:32",22.7],["2016-08-23 16:38:56",22.6],["2016-08-23 18:21:20",22.6],["2016-09-04 06:50:08",22.5],["2016-08-23 16:38:56",22.3],["2016-08-23 18:21:20",22.3],["2016-08-23 20:03:44",22.3],["2016-09-04 13:39:44",22.5],["2016-08-23 18:21:20",22.6],["2016-08-23 20:03:44",22.6],["2016-08-23 21:46:08",22.6],["2016-09-04 20:29:20",22.5],["2016-08-23 20:03:44",22.3],["2016-08-23 21:46:08",22.3],["2016-08-23 23:28:32",22.3],["2016-09-05 03:18:56",22.3],["2016-08-23 21:46:08",22.2],["2016-08-23 23:28:32",22.1],["2016-08-24 01:10:56",21.8],["2016-09-05 10:08:32",21.8],["2016-08-23 23:28:32",21.8],["2016-08-24 01:10:56",21.8],["2016-08-24 02:53:20",22.2],["2016-09-05 16:58:08",22.3],["2016-08-24 01:10:56",22.6],["2016-08-24 02:53:20",22.6],["2016-08-24 04:35:44",22.2],["2016-09-05 23:47:44",22.1],["2016-08-24 02:53:20",22.1],["2016-08-24 04:35:44",22.1],["2016-08-24 06:18:08",22.0],["2016-09-06 06:37:20",22.0],["2016-08-24 04:35:44",22.0],["2016-08-24 06:18:08",21.8],["2016-08-24 08:00:32",21.7],["2016-09-06 13:26:56",21.6],["2016-08-24 06:18:08",21.6],["2016-08-24 08:00:32",21.8],["2016-08-24 09:42:56",22.1],["2016-09-06 20:16:32",22.8],["2016-08-24 08:00:32",23.1],["2016-08-24 09:42:56",23.2],["2016-08-24 11:25:20",23.1],["2016-09-07 03:06:08",23.0],["2016-08-24 09:42:56",22.8],["2016-08-24 11:25:20",22.8],["2016-08-24 13:07:44",22.7],["2016-09-07 09:55:44",22.7],["2016-08-24 11:25:20",22.6],["2016-08-24 13:07:44",22.6],["2016-08-24 14:50:08",22.6],["2016-09-07 16:45:20",22.6],["2016-08-24 13:07:44",22.7],["2016-08-24 14:50:08",22.7],["2016-08-24 16:32:32",22.7],["2016-09-07 23:34:56",22.7],["2016-08-24 14:50:08",22.8],["2016-08-24 16:32:32",22.8],["2016-08-24 18:14:56",22.8],["2016-09-08 06:24:32",22.7],["2016-08-24 16:32:32",22.6],["2016-08-24 18:14:56",22.3],["2016-08-24 19:57:20",22.2],["2016-09-08 13:14:08",22.1],["2016-08-24 18:14:56",22.3],["2016-08-24 19:57:20",22.3],["2016-08-24 21:39:44",22.3],["2016-09-08 20:03:44",22.2],["2016-08-24 19:57:20",22.0],["2016-08-24 21:39:44",21.8],["2016-08-24 23:22:08",22.2],["2016-09-09 02:53:20",22.2],["2016-08-24 21:39:44",22.2],["2016-08-24 23:22:08",22.2],["2016-08-25 01:04:32",22.2],["2016-09-09 09:42:56",22.5],["2016-08-24 23:22:08",22.3],["2016-08-25 01:04:32",22.2],["2016-08-25 02:46:56",22.2],["2016-09-09 16:32:32",22.2],["2016-08-25 01:04:32",22.2],["2016-08-25 02:46:56",22.2],["2016-08-25 04:29:20",22.1],["2016-09-09 23:22:08",21.6],["2016-08-25 02:46:56",21.6],["2016-08-25 04:29:20",21.8],["2016-08-25 06:11:44",21.7],["2016-09-10 06:11:44",21.7],["2016-08-25 04:29:20",21.7],["2016-08-25 06:11:44",21.6],["2016-08-25 07:54:08",21.7],["2016-09-10 13:01:20",22.3],["2016-08-25 06:11:44",22.7],["2016-08-25 07:54:08",22.6],["2016-08-25 09:36:32",22.3],["2016-09-10 19:50:56",22.1],["2016-08-25 07:54:08",22.2],["2016-08-25 09:36:32",22.7],["2016-08-25 11:18:56",23.0],["2016-09-11 02:40:32",22.8],["2016-08-25 09:36:32",22.7],["2016-08-25 11:18:56",22.6],["2016-08-25 13:01:20",22.5],["2016-09-11 09:30:08",22.3],["2016-08-25 11:18:56",22.3],["2016-08-25 13:01:20",22.3],["2016-08-25 14:43:44",22.3],["2016-09-11 16:19:44",22.5],["2016-08-25 13:01:20",23.0],["2016-08-25 14:43:44",23.3],["2016-08-25 16:26:08",23.6],["2016-09-11 23:09:20",23.8],["2016-08-25 14:43:44",23.8],["2016-08-25 16:26:08",23.6],["2016-08-25 18:08:32",23.3],["2016-09-12 05:58:56",23.0],["2016-08-25 16:26:08",22.7],["2016-08-25 18:08:32",22.7],["2016-08-25 19:50:56",22.5]];

var DUMMY_TEMPDATA_JSON = {"07E04FB1001D8B90BEAFA005":"[['2016-08-19 15:22:08',23.2],['2016-08-19 18:46:56',27.5],['2016-08-19 20:29:20',26.7],['2016-08-19 22:11:44',24.8],['2016-08-19 22:11:44',24.3],['2016-08-19 20:29:20',24.1],['2016-08-19 22:11:44',24.0],['2016-08-19 23:54:08',24.1],['2016-08-20 05:01:20',24.0],['2016-08-19 22:11:44',23.8],['2016-08-19 23:54:08',23.8],['2016-08-20 01:36:32',24.0],['2016-08-20 11:50:56',23.8],['2016-08-19 23:54:08',23.6],['2016-08-20 01:36:32',24.3],['2016-08-20 03:18:56',24.5],['2016-08-20 18:40:32',23.8],['2016-08-20 01:36:32',23.0],['2016-08-20 03:18:56',22.1],['2016-08-20 05:01:20',21.0],['2016-08-21 01:30:08',20.7],['2016-08-20 03:18:56',21.0],['2016-08-20 05:01:20',21.2],['2016-08-20 06:43:44',21.2],['2016-08-21 08:19:44',21.3],['2016-08-20 05:01:20',21.6],['2016-08-20 06:43:44',21.7],['2016-08-20 08:26:08',21.8],['2016-08-21 15:09:20',21.8],['2016-08-20 06:43:44',22.1],['2016-08-20 08:26:08',22.5],['2016-08-20 10:08:32',22.2],['2016-08-21 21:58:56',21.5],['2016-08-20 08:26:08',21.2],['2016-08-20 10:08:32',21.2],['2016-08-20 11:50:56',21.0],['2016-08-22 04:48:32',21.1],['2016-08-20 10:08:32',21.3],['2016-08-20 11:50:56',21.5],['2016-08-20 13:33:20',21.6],['2016-08-22 11:38:08',21.8],['2016-08-20 11:50:56',22.2],['2016-08-20 13:33:20',23.0],['2016-08-20 15:15:44',23.5],['2016-08-22 18:27:44',24.3],['2016-08-20 13:33:20',23.2],['2016-08-20 15:15:44',22.1],['2016-08-20 16:58:08',22.3],['2016-08-23 01:17:20',22.6],['2016-08-20 15:15:44',22.7],['2016-08-20 16:58:08',23.0],['2016-08-20 18:40:32',23.0],['2016-08-23 08:06:56',23.1],['2016-08-20 16:58:08',23.0],['2016-08-20 18:40:32',23.0],['2016-08-20 20:22:56',23.0],['2016-08-23 14:56:32',23.5],['2016-08-20 18:40:32',23.6],['2016-08-20 20:22:56',23.7],['2016-08-20 22:05:20',23.7],['2016-08-23 21:46:08',23.6],['2016-08-20 20:22:56',23.6],['2016-08-20 22:05:20',23.3],['2016-08-20 23:47:44',23.1],['2016-08-24 04:35:44',22.7],['2016-08-20 22:05:20',22.5],['2016-08-20 23:47:44',22.2],['2016-08-21 01:30:08',22.2],['2016-08-24 11:25:20',22.2],['2016-08-20 23:47:44',22.2],['2016-08-21 01:30:08',22.3],['2016-08-21 03:12:32',22.5],['2016-08-24 18:14:56',22.7],['2016-08-21 01:30:08',22.8],['2016-08-21 03:12:32',23.1],['2016-08-21 04:54:56',23.2],['2016-08-25 01:04:32',23.2],['2016-08-21 03:12:32',23.2],['2016-08-21 04:54:56',23.1],['2016-08-21 06:37:20',23.1],['2016-08-25 07:54:08',23.0],['2016-08-21 04:54:56',23.0],['2016-08-21 06:37:20',22.8],['2016-08-21 08:19:44',22.7],['2016-08-25 14:43:44',22.6],['2016-08-21 06:37:20',22.8],['2016-08-21 08:19:44',23.0],['2016-08-21 10:02:08',23.0],['2016-08-25 21:33:20',23.0],['2016-08-21 08:19:44',23.0],['2016-08-21 10:02:08',23.0],['2016-08-21 11:44:32',22.8],['2016-08-26 04:22:56',22.7],['2016-08-21 10:02:08',22.6],['2016-08-21 11:44:32',22.5],['2016-08-21 13:26:56',22.5],['2016-08-26 11:12:32',22.5],['2016-08-21 11:44:32',22.3],['2016-08-21 13:26:56',22.2],['2016-08-21 15:09:20',22.2],['2016-08-26 18:02:08',22.2],['2016-08-21 13:26:56',22.5],['2016-08-21 15:09:20',22.5],['2016-08-21 16:51:44',22.6],['2016-08-27 00:51:44',22.7],['2016-08-21 15:09:20',22.6],['2016-08-21 16:51:44',22.5],['2016-08-21 18:34:08',22.3],['2016-08-27 07:41:20',22.2],['2016-08-21 16:51:44',22.1],['2016-08-21 18:34:08',22.1],['2016-08-21 20:16:32',22.1],['2016-08-27 14:30:56',22.2],['2016-08-21 18:34:08',22.3],['2016-08-21 20:16:32',22.6],['2016-08-21 21:58:56',22.6],['2016-08-27 21:20:32',22.6],['2016-08-21 20:16:32',22.6],['2016-08-21 21:58:56',22.3],['2016-08-21 23:41:20',22.1],['2016-08-28 04:10:08',22.0],['2016-08-21 21:58:56',21.8],['2016-08-21 23:41:20',21.7],['2016-08-22 01:23:44',21.7],['2016-08-28 10:59:44',21.7],['2016-08-21 23:41:20',21.6],['2016-08-22 01:23:44',22.0],['2016-08-22 03:06:08',22.3],['2016-08-28 17:49:20',22.5],['2016-08-22 01:23:44',22.5],['2016-08-22 03:06:08',22.2],['2016-08-22 04:48:32',22.2],['2016-08-29 00:38:56',22.3],['2016-08-22 03:06:08',22.3],['2016-08-22 04:48:32',22.2],['2016-08-22 06:30:56',22.2],['2016-08-29 07:28:32',22.1],['2016-08-22 04:48:32',22.1],['2016-08-22 06:30:56',22.0],['2016-08-22 08:13:20',22.0],['2016-08-29 14:18:08',22.1],['2016-08-22 06:30:56',22.1],['2016-08-22 08:13:20',22.3],['2016-08-22 09:55:44',22.7],['2016-08-29 21:07:44',22.7],['2016-08-22 08:13:20',22.7],['2016-08-22 09:55:44',22.8],['2016-08-22 11:38:08',22.7],['2016-08-30 03:57:20',22.7],['2016-08-22 09:55:44',22.6],['2016-08-22 11:38:08',22.5],['2016-08-22 13:20:32',22.5],['2016-08-30 10:46:56',22.6],['2016-08-22 11:38:08',22.7],['2016-08-22 13:20:32',22.8],['2016-08-22 15:02:56',23.0],['2016-08-30 17:36:32',23.1],['2016-08-22 13:20:32',23.1],['2016-08-22 15:02:56',23.0],['2016-08-22 16:45:20',22.8],['2016-08-31 00:26:08',23.0],['2016-08-22 15:02:56',23.1],['2016-08-22 16:45:20',23.0],['2016-08-22 18:27:44',23.0],['2016-08-31 07:15:44',23.0],['2016-08-22 16:45:20',23.0],['2016-08-22 18:27:44',22.8],['2016-08-22 20:10:08',22.8],['2016-08-31 14:05:20',22.8],['2016-08-22 18:27:44',23.0],['2016-08-22 20:10:08',23.1],['2016-08-22 21:52:32',23.1],['2016-08-31 20:54:56',23.2],['2016-08-22 20:10:08',23.2],['2016-08-22 21:52:32',23.3],['2016-08-22 23:34:56',23.3],['2016-09-01 03:44:32',23.3],['2016-08-22 21:52:32',23.2],['2016-08-22 23:34:56',23.1],['2016-08-23 01:17:20',23.1],['2016-09-01 10:34:08',23.1],['2016-08-22 23:34:56',23.1],['2016-08-23 01:17:20',23.0],['2016-08-23 02:59:44',23.0],['2016-09-01 17:23:44',23.1],['2016-08-23 01:17:20',23.0],['2016-08-23 02:59:44',22.8],['2016-08-23 04:42:08',22.8],['2016-09-02 00:13:20',23.0],['2016-08-23 02:59:44',23.0],['2016-08-23 04:42:08',22.8],['2016-08-23 06:24:32',22.7],['2016-09-02 07:02:56',22.5],['2016-08-23 04:42:08',22.5],['2016-08-23 06:24:32',22.5],['2016-08-23 08:06:56',22.6],['2016-09-02 13:52:32',22.6],['2016-08-23 06:24:32',22.7],['2016-08-23 08:06:56',22.7],['2016-08-23 09:49:20',22.7],['2016-09-02 20:42:08',22.7],['2016-08-23 08:06:56',22.8],['2016-08-23 09:49:20',23.0],['2016-08-23 11:31:44',23.1],['2016-09-03 03:31:44',23.0],['2016-08-23 09:49:20',22.8],['2016-08-23 11:31:44',22.7],['2016-08-23 13:14:08',22.6],['2016-09-03 10:21:20',22.5],['2016-08-23 11:31:44',22.6],['2016-08-23 13:14:08',22.8],['2016-08-23 14:56:32',22.8],['2016-09-03 17:10:56',22.7],['2016-08-23 13:14:08',23.1],['2016-08-23 14:56:32',23.2],['2016-08-23 16:38:56',23.0],['2016-09-04 00:00:32',22.8],['2016-08-23 14:56:32',22.7],['2016-08-23 16:38:56',22.6],['2016-08-23 18:21:20',22.6],['2016-09-04 06:50:08',22.5],['2016-08-23 16:38:56',22.3],['2016-08-23 18:21:20',22.3],['2016-08-23 20:03:44',22.3],['2016-09-04 13:39:44',22.5],['2016-08-23 18:21:20',22.6],['2016-08-23 20:03:44',22.6],['2016-08-23 21:46:08',22.6],['2016-09-04 20:29:20',22.5],['2016-08-23 20:03:44',22.3],['2016-08-23 21:46:08',22.3],['2016-08-23 23:28:32',22.3],['2016-09-05 03:18:56',22.3],['2016-08-23 21:46:08',22.2],['2016-08-23 23:28:32',22.1],['2016-08-24 01:10:56',21.8],['2016-09-05 10:08:32',21.8],['2016-08-23 23:28:32',21.8],['2016-08-24 01:10:56',21.8],['2016-08-24 02:53:20',22.2],['2016-09-05 16:58:08',22.3],['2016-08-24 01:10:56',22.6],['2016-08-24 02:53:20',22.6],['2016-08-24 04:35:44',22.2],['2016-09-05 23:47:44',22.1],['2016-08-24 02:53:20',22.1],['2016-08-24 04:35:44',22.1],['2016-08-24 06:18:08',22.0],['2016-09-06 06:37:20',22.0],['2016-08-24 04:35:44',22.0],['2016-08-24 06:18:08',21.8],['2016-08-24 08:00:32',21.7],['2016-09-06 13:26:56',21.6],['2016-08-24 06:18:08',21.6],['2016-08-24 08:00:32',21.8],['2016-08-24 09:42:56',22.1],['2016-09-06 20:16:32',22.8],['2016-08-24 08:00:32',23.1],['2016-08-24 09:42:56',23.2],['2016-08-24 11:25:20',23.1],['2016-09-07 03:06:08',23.0],['2016-08-24 09:42:56',22.8],['2016-08-24 11:25:20',22.8],['2016-08-24 13:07:44',22.7],['2016-09-07 09:55:44',22.7],['2016-08-24 11:25:20',22.6],['2016-08-24 13:07:44',22.6],['2016-08-24 14:50:08',22.6],['2016-09-07 16:45:20',22.6],['2016-08-24 13:07:44',22.7],['2016-08-24 14:50:08',22.7],['2016-08-24 16:32:32',22.7],['2016-09-07 23:34:56',22.7],['2016-08-24 14:50:08',22.8],['2016-08-24 16:32:32',22.8],['2016-08-24 18:14:56',22.8],['2016-09-08 06:24:32',22.7],['2016-08-24 16:32:32',22.6],['2016-08-24 18:14:56',22.3],['2016-08-24 19:57:20',22.2],['2016-09-08 13:14:08',22.1],['2016-08-24 18:14:56',22.3],['2016-08-24 19:57:20',22.3],['2016-08-24 21:39:44',22.3],['2016-09-08 20:03:44',22.2],['2016-08-24 19:57:20',22.0],['2016-08-24 21:39:44',21.8],['2016-08-24 23:22:08',22.2],['2016-09-09 02:53:20',22.2],['2016-08-24 21:39:44',22.2],['2016-08-24 23:22:08',22.2],['2016-08-25 01:04:32',22.2],['2016-09-09 09:42:56',22.5],['2016-08-24 23:22:08',22.3],['2016-08-25 01:04:32',22.2],['2016-08-25 02:46:56',22.2],['2016-09-09 16:32:32',22.2],['2016-08-25 01:04:32',22.2],['2016-08-25 02:46:56',22.2],['2016-08-25 04:29:20',22.1],['2016-09-09 23:22:08',21.6],['2016-08-25 02:46:56',21.6],['2016-08-25 04:29:20',21.8],['2016-08-25 06:11:44',21.7],['2016-09-10 06:11:44',21.7],['2016-08-25 04:29:20',21.7],['2016-08-25 06:11:44',21.6],['2016-08-25 07:54:08',21.7],['2016-09-10 13:01:20',22.3],['2016-08-25 06:11:44',22.7],['2016-08-25 07:54:08',22.6],['2016-08-25 09:36:32',22.3],['2016-09-10 19:50:56',22.1],['2016-08-25 07:54:08',22.2],['2016-08-25 09:36:32',22.7],['2016-08-25 11:18:56',23.0],['2016-09-11 02:40:32',22.8],['2016-08-25 09:36:32',22.7],['2016-08-25 11:18:56',22.6],['2016-08-25 13:01:20',22.5],['2016-09-11 09:30:08',22.3],['2016-08-25 11:18:56',22.3],['2016-08-25 13:01:20',22.3],['2016-08-25 14:43:44',22.3],['2016-09-11 16:19:44',22.5],['2016-08-25 13:01:20',23.0],['2016-08-25 14:43:44',23.3],['2016-08-25 16:26:08',23.6],['2016-09-11 23:09:20',23.8],['2016-08-25 14:43:44',23.8],['2016-08-25 16:26:08',23.6],['2016-08-25 18:08:32',23.3],['2016-09-12 05:58:56',23.0],['2016-08-25 16:26:08',22.7],['2016-08-25 18:08:32',22.7],['2016-08-25 19:50:56',22.5],['2016-09-12 12:48:32',22.2],['2016-08-25 18:08:32',23.0],['2016-08-25 19:50:56',23.5],['2016-08-25 21:33:20',24.8],['2016-09-12 19:38:08',25.1],['2016-08-25 19:50:56',24.7],['2016-08-25 21:33:20',24.6],['2016-08-25 23:15:44',24.6],['2016-09-13 02:27:44',24.6],['2016-08-25 21:33:20',24.3],['2016-08-25 23:15:44',24.2],['2016-08-26 00:58:08',24.0]]"};

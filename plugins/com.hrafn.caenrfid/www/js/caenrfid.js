var exec = require('cordova/exec');
function Caenrfid() { console.log("caenrfid.js: is created");
}
Caenrfid.prototype.scanRFID = function(success,error){ console.log("caenrfid.js: startRFID"); exec(success, error ,"Caenrfid","scanRFID",[]);
}
Caenrfid.prototype.stopRFID = function(success,error){ console.log("caenrfid.js: stopRFID"); exec(success, error ,"Caenrfid","stopRFID",[]);
}
Caenrfid.prototype.readTemp = function(success,error,args){ 
	console.log("caenrfid.js: readTemp"); 
	exec(success, error ,"Caenrfid","readTemp",args);
}
Caenrfid.prototype.restartTemp = function(success,error,args){ 
	console.log("caenrfid.js: restartTemp"); 
	exec(success, error ,"Caenrfid","restartTemp",args);
}
Caenrfid.prototype.scanSingle = function(success,error){ console.log("caenrfid.js: scanSingle"); exec(success, error ,"Caenrfid","scanSingle",[]);
}

var Caenrfid = new Caenrfid();
module.exports = Caenrfid;

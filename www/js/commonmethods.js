
// SHOWING TOAST MESSAGE IN APP
function showToast(message, position, duration, onSuccess, onSuccess) {
  window.plugins.toast.showWithOptions(
    {
      message: message,
      duration: duration, // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
      position: position,
      addPixelsY: -40  // added a negative value to move it up a bit (default 0)
    }
  );
}

// GETTING QUERYSTRING FROM URL
function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function uploadFileToServer(ServerURI, fileURL, nativeURL, type){
  function win(r) {
      console.log("Code = " + r.responseCode);
      console.log("Response = " + r.response);
      console.log("Sent = " + r.bytesSent);
      removeFile(fileURL, type)
  }

  function fail(error) {
      // alert("An error has occurred: Code = " + error.code);
      showToast("Error occured while syncing. Check your internet connection.", 'bottom', 'long')
      console.log("upload error source " + error.source);
      console.log("upload error target " + error.target);
  }

  var uri = encodeURI(ServerURI);

  var options = new FileUploadOptions();
  options.fileKey="file";
  options.fileName=fileURL.substr(fileURL.lastIndexOf('/')+1);
  options.mimeType="text/plain";

  var headers={'headerParam':'headerValue'};

  options.headers = headers;

  var ft = new FileTransfer();
  ft.onprogress = function(progressEvent) {
      showImageLoader()
      if (progressEvent.lengthComputable) {
        var loadValue = loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
        console.log(loadValue)
      } else {
        loadingStatus.increment();
      }
  };
  ft.upload(fileURL, uri, win, fail, options);
}

function removeFile(relativeFilePath, type) {
  // var relativeFilePath = "MyDir/file_name.png";
  var fileName = relativeFilePath.substr(relativeFilePath.lastIndexOf('/')+1);

  window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function(fileSystem){
    console.log(fileSystem)
      fileSystem.getFile(fileName, {create:false}, function(fileEntry){
          fileEntry.remove(function(file){
              console.log(fileName, "File removed!");
              showToast("Data successfully synced.", 'bottom', 'long');
              // $('#offlineList').listview('refresh');              
              
              if (type=='nest') {

                // DELETING NEST FILENAME FROM LOCALSTORAGE
                var offlineRecordedNestNames = JSON.parse(localStorage.getItem('offlineRecordedNestNames'));
                var index = offlineRecordedNestNames.indexOf(fileName.slice(0, -4));
                if (index > -1) {
                    offlineRecordedNestNames.splice(index, 1);
                }
                localStorage.setItem('offlineRecordedNestNames',JSON.stringify(offlineRecordedNestNames));
              }else if(type=='turtle'){

                // DELETING TURTLE FILENAME FROM LOCALSTORAGE
                var offlineRecordedTurtleNames = JSON.parse(localStorage.getItem('offlineRecordedTurtleNames'));
                var index = offlineRecordedTurtleNames.indexOf(fileName.slice(0, -4));
                if (index > -1) {
                    offlineRecordedTurtleNames.splice(index, 1);
                }
                localStorage.setItem('offlineRecordedTurtleNames',JSON.stringify(offlineRecordedTurtleNames));
              }else if(type=='predation'){

                // DELETING PREDATION FILENAME FROM LOCALSTORAGE
                var offlineRecordedPredationNames = JSON.parse(localStorage.getItem('offlineRecordedPredationNames'));
                var index = offlineRecordedPredationNames.indexOf(fileName.slice(0, -4));
                if (index > -1) {
                    offlineRecordedPredationNames.splice(index, 1);
                }
                localStorage.setItem('offlineRecordedPredationNames',JSON.stringify(offlineRecordedPredationNames));
              }  else if(type=='emergence'){

                // DELETING EMERGENCE FILENAME FROM LOCALSTORAGE
                var offlineRecordedEmergenceNames = JSON.parse(localStorage.getItem('offlineRecordedEmergenceNames'));
                var index = offlineRecordedEmergenceNames.indexOf(fileName.slice(0, -4));
                if (index > -1) {
                    offlineRecordedEmergenceNames.splice(index, 1);
                }
                localStorage.setItem('offlineRecordedEmergenceNames',JSON.stringify(offlineRecordedEmergenceNames));
              }  else if(type=='uncover'){

                // DELETING UNCOVER FILENAME FROM LOCALSTORAGE
                var offlineRecordedUncoverNames = JSON.parse(localStorage.getItem('offlineRecordedUncoverNames'));
                var index = offlineRecordedUncoverNames.indexOf(fileName.slice(0, -4));
                if (index > -1) {
                    offlineRecordedUncoverNames.splice(index, 1);
                }
                localStorage.setItem('offlineRecordedUncoverNames',JSON.stringify(offlineRecordedUncoverNames));
              }  else if(type=='logger'){

                // DELETING UNCOVER FILENAME FROM LOCALSTORAGE
                var offlineRecordedLoggerNames = JSON.parse(localStorage.getItem('offlineRecordedLoggerNames'));
                var index = offlineRecordedLoggerNames.indexOf(fileName.slice(0, -4));
                if (index > -1) {
                    offlineRecordedLoggerNames.splice(index, 1);
                }
                localStorage.setItem('offlineRecordedLoggerNames',JSON.stringify(offlineRecordedLoggerNames));
              }  else if(type=='relocate'){

                // DELETING UNCOVER FILENAME FROM LOCALSTORAGE
                var offlineRecordedRelocateNames = JSON.parse(localStorage.getItem('offlineRecordedRelocateNames'));
                var index = offlineRecordedRelocateNames.indexOf(fileName.slice(0, -4));
                if (index > -1) {
                    offlineRecordedRelocateNames.splice(index, 1);
                }
                localStorage.setItem('offlineRecordedRelocateNames',JSON.stringify(offlineRecordedRelocateNames));
              }
              
              
              setInterval(function(){ $.mobile.loading('hide'); }, 1000);
              $.mobile.navigate( "#menuPage" );

          },function(){
              console.log(fileName, "error deleting the file " + error.code);
              showToast("Seems like somthing went wrong.", 'bottom', 'long')
            });
          },function(){
              console.log(fileName, "file does not exist");
              showToast("file does not exist", 'bottom', 'long')
          });
      },function(evt){
          console.log(evt.target.error.code);
  });
}


function ajaxCall(requestData,type,serverUrl,dataType) {
  return $.ajax({
        data:requestData,
        type: type,
        beforeSend: function() { $.mobile.loading('show'); }, //Show spinner
        complete: function() { $.mobile.loading('hide'); }, //Hide spinner
        url: serverUrl,
        async: false,
        success: function(data) {
          return data;
        },
        dataType:dataType
      });
}

function formateDate(date) {
  var newDate = new Date(date)
  return newDate.getDate()+'-'+newDate.getMonth()+'-'+newDate.getFullYear()
}

function showImageLoader(){  
      $.mobile.loading( 'show', {
        text: 'Loading temperature',
        textVisible: true,
        theme: 'z',
        html: "<img src=\"img/loader.gif\" style=\"width:100%\" />"
      });
}


// SCANNING RFID
function scanOnce(){
  rfidRunning = 1;
  Caenrfid.scanSingle(function(data){
    // showToast('Got the RFID.', 'bottom', 'long')
    scanOnceSuccess(data.substring(0)+"");
  },function (err){
    console.log("error",err)
    showToast('Error while reading RFID. Please check connectivity.', 'bottom', 'long')
    // scanOnceSuccess('3415AF9D60000001DCD65370');
  });
}


// COMMON FUNCTION TO READ RECORDS FROM PHONE STORAGE
function readOfflineRecords(variableName, populateElement, icon, readMethod){
  window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function (fileSystem) {
        var reader = fileSystem.createReader();
        var list="";
        reader.readEntries(
            function (entries) {
              console.log('entries',entries)
              console.log('variableName',variableName)
              var i;
              var htmlInset = "";
              var offlineRecordedNestNames = JSON.parse(localStorage.getItem(variableName));              
              console.log('offlineRecordedNestNames',offlineRecordedNestNames)
              for (i=0; i<entries.length; i++) {
                var index = offlineRecordedNestNames.indexOf(entries[i].name.slice(0, -4));
                if (index > -1) {
                    if (typeof entries[i] == 'undefined'){
                      continue;
                    }
                    htmlInset += "<li data-icon='"+icon+"''><a href='#' onclick='"+readMethod+"(\""+entries[i].name+"\");'>"+
                    "<h3>"+entries[i].name+"</h3></a> ";
                        if (entries[i].name.search("finished_")==-1){
                          // htmlInset += "<a href='#' onclick='alert(\"upload data\");'>1st link</a> ";
                          htmlInset += "<a href='#' onclick='"+readMethod+"(\""+entries[i].name+"\");'>1st link</a> ";
                        }
                    htmlInset += "</li>";
                }
              }
              console.log(populateElement, htmlInset)
              $('#'+populateElement).html(htmlInset);
              $('#'+populateElement).listview('refresh');  
            },
            function (err) {
              alert(err);
            }
        );        
      }, function (err) {
          alert(err);
    });
}

// CONVERT CSV DATA TO ARRAY
function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
}

// CONVERT CSV TO JSON
function CSV2JSON(csv) {
    var array = CSVToArray(csv);
    var objArray = [];
    for (var i = 1; i < array.length; i++) {
        objArray[i - 1] = {};
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k]
        }
    }

    var json = JSON.stringify(objArray);
    var str = json.replace(/},/g, "},\r\n");

    return str;
}

// SET CURRENT DATE OF A PARTICULAR FILED
function setCurrentDate(field){
  var now = new Date();
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear()+"-"+(month)+"-"+(day);
  $(field).val(today);
}

// SET CURRENT DATE AND TIME OF A PARTICULAR FILED
function setCurrentDateTime(field){
  d = new Date();
  $(field).val(d.toLocaleString());
}
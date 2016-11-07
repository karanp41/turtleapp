
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

                // DELETING PREDATION FILENAME FROM LOCALSTORAGE
                var offlineRecordedEmergenceNames = JSON.parse(localStorage.getItem('offlineRecordedEmergenceNames'));
                var index = offlineRecordedEmergenceNames.indexOf(fileName.slice(0, -4));
                if (index > -1) {
                    offlineRecordedEmergenceNames.splice(index, 1);
                }
                localStorage.setItem('offlineRecordedEmergenceNames',JSON.stringify(offlineRecordedEmergenceNames));
              }  else if(type=='uncover'){

                // DELETING PREDATION FILENAME FROM LOCALSTORAGE
                var offlineRecordedUncoverNames = JSON.parse(localStorage.getItem('offlineRecordedUncoverNames'));
                var index = offlineRecordedUncoverNames.indexOf(fileName.slice(0, -4));
                if (index > -1) {
                    offlineRecordedUncoverNames.splice(index, 1);
                }
                localStorage.setItem('offlineRecordedUncoverNames',JSON.stringify(offlineRecordedUncoverNames));
              }              
              
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
    scanOnceSuccess(data.substring(0)+"");
  },function (err){
    console.log("error",err)
    scanOnceSuccess('3415AF9D60000001DCD65370');
  });
}
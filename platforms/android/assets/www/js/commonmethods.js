
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

function uploadFileToServer(ServerURI, fileURL){
  function win(r) {
      console.log("Code = " + r.responseCode);
      console.log("Response = " + r.response);
      console.log("Sent = " + r.bytesSent);
  }

  function fail(error) {
      alert("An error has occurred: Code = " + error.code);
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
      if (progressEvent.lengthComputable) {
        loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
      } else {
        loadingStatus.increment();
      }
  };
  ft.upload(fileURL, uri, win, fail, options);
}


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
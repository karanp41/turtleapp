/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    } 
    //alert('Query Variable ' + variable + ' not found');
}



var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        // locate();
        username = localStorage.getItem("turtle_nesting_username");
        document.addEventListener("scanRFID", scanRFID, false);
        document.addEventListener("offline", onOffline, false);

        function onOffline() {
            showToast('Connection Lost. You may still able to record data offline and later you may sync when you come online.', 'bottom', 'long')
        }

        document.addEventListener("online", onOnline, false);
        function onOnline() {
            // $("#offlineNotificationPopup").popup("open");
            var offlineRecordedNestNames = JSON.parse(localStorage.getItem('offlineRecordedNestNames'));
            if(offlineRecordedNestNames.length > 0){
                showToast('Connection established. You have some offline data saved in device. Press \'Sync Now\' to upload.', 'bottom', 'long')
                $.mobile.changePage("popupdialogs/dialog.html", {transition: 'slideup', role: 'dialog'});
            }else{
                showToast('Connection established.', 'bottom', 'long')
            }
        }

        var push = PushNotification.init({
            android: {
                senderID: "213999491046"
            },
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        });

        push.on('registration', function(data) {
            // data.registrationId
            console.log(data.registrationId)
            if (data.registrationId) {
                localStorage.setItem("deviceId", data.registrationId);
            }else{
                localStorage.setItem("deviceId", '');
            }
        });

        push.on('notification', function(data) {
            alert(data.message)
            // data.message,
            // data.title,
            // data.count,
            // data.sound,
            // data.image,
            // data.additionalData
        });

        push.on('error', function(e) {
            // e.message
        });

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        navigator.geolocation.getCurrentPosition(
            function(position){ console.log('Location Found: ',position) }, 
            function(){
                $( "#locationPopupDialog" ).popup( "open" )
                console.log('Location Error')
                // $.mobile.changePage("popupdialogs/locationTurnOnPopup.html", {transition: 'slideup', role: 'dialog'});
            },
            POS_OPTIONS
        );
        //        var parentElement = document.getElementById(id);
        //        var listeningElement = parentElement.querySelector('.listening');
        //        var receivedElement = parentElement.querySelector('.received');
        //
        //        listeningElement.setAttribute('style', 'display:none;');
        //        receivedElement.setAttribute('style', 'display:block;');
        //
        //        console.log('Received Event: ' + id);
    },
    // onOffline: function () {
    //     alert('Gone offline')
    // }
};



app.initialize();

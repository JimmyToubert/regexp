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
        document.addEventListener('deviceready', this.onDeviceReady, true);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        //testDb('Smartgeo3806121311783874177052375436098933651436526648471', "SELECT * FROM assets WHERE symbolid REGEXP('.*')");
        testDb('Smartgeo3806121311783874177052375436098933651436526648471', "SELECT * FROM assets WHERE LOWER(asset) REGEXP('\"guid\":(|\")10101(,|\"|\}|\\)')");
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');


        console.log('Received Event: ' + id);
    }
};

app.initialize();
function testDb(dbname, request){
    console.log('test begin');
    // WRONG:
    //db = sqlitePlugin.openDatabase({name: dbname, createFromLocation: 1});
    //var db = openDatabase(dbname, "1.0", "Demo", 4096);
    // FIX:
    var db = sqlitePlugin.openDatabase({name: dbname, createFromLocation: 1});
    document.getElementById('testDb').innerHTML = 'no in transaction';
    console.log('db: ' + db);
    /* Brody suggest for extra test:
    db.executeSql("SELECT COUNT(*) FROM assets", [], function(res) {
      document.getElementById('checkCount').innerHTML = 'GOT COUNT: ' + JSON.stringify(res.rows.item(0));
    }, function(error) {
      console.log('SELECT COUNT ERROR: ' + JSON.stringify(error));
      document.getElementById('checkCount').innerHTML = 'COUNT ERROR';
    });
    */
    db.transaction(function(tx){
        console.log('in transaction');
        tx.executeSql(request, [], function(tx, rows){
            console.log('results: ' + JSON.stringify(rows));
            document.getElementById('testDb').innerHTML = 'it worked';
        }, function(error){
            console.log(error);
            // Brody suggest this instead:
            console.log('ERROR: ' + JSON.stringify(error));
            document.getElementById('testDb').innerHTML = 'error when executeSql';
        });
    });
}

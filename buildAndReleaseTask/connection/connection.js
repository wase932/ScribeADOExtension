"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios = require('axios').default;
var scribe_user = String(process.env.scribe_user);
var scribe_password = String(process.env.scribe_password);
var baseUrl = String(process.env.scribe_baseurl);
var organizationId = Number(process.env.scribe_organizationid);
var connectionId = String(process.env.scribe_connectionid);
var agentId = String(process.env.scribe_agentid);
function testConnection(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password) {
    console.log("INFO: Testing connection...");
    var uri = baseUrl + "/" + organizationId + "/connections/" + connectionId + "/test?agentid=" + agentId;
    //Make an api call:
    axios({
        method: "POST",
        url: uri,
        auth: {
            username: scribe_user,
            password: scribe_password
        }
    }).then(function (response) {
        console.log("INFO: Test started.");
        console.log("INFO: Test id is " + response.data.id);
        console.log("INFO.Status: " + response.data.status);
        //Begin call to get results:
        fetchResult(baseUrl, organizationId, response.data.id, scribe_user, scribe_password);
    }).catch(function (error) {
        console.log(error.message);
        // handle error
        console.log(error);
    }).finally(function () {
        // always executed
    });
}
function fetchResult(baseUrl, organizationId, testId, scribe_user, scribe_password, attemptCount) {
    if (attemptCount === void 0) { attemptCount = 0; }
    console.log("INFO: Fetching connection test result...");
    var uri = baseUrl + "/" + organizationId + "/connections/test/" + testId;
    axios({
        method: "GET",
        url: uri,
        auth: {
            username: scribe_user,
            password: scribe_password
        }
    }).then(function (response) {
        console.log("INFO.Status: " + response.data.status);
        //console.log(`INFO.Result: ${response.data}`);
        // console.log(response);
        //If the status is not completed, then try again...
        //delay
        setTimeout(function () {
            if (response.data.status != "Completed") {
                console.log("Result is still processing for id: " + testId + ". This is attempt " + attemptCount);
                attemptCount += 1;
                fetchResult(baseUrl, organizationId, response.data.id, scribe_user, scribe_password, attemptCount);
            }
            else {
                console.log("INFO: Testing is now complete");
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                console.log("RESULT: " + response.data.reply);
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                //output the data in the response:
                var responseData = response.data.replyData;
                responseData.forEach(function (element) {
                    console.log(element.key + " :: " + element.value);
                });
            }
        }, 10000);
        //Log status
    }).catch(function (error) {
        // handle error
        console.log(error.message);
    }).finally(function () {
        // always executed
    });
}
function getConnectionByName(connectionName, baseUrl, organizationId, scribe_user, scribe_password) {
    console.log("INFO: Getting all connections...");
    var uri = baseUrl + "/" + organizationId + "/connections";
    axios({
        method: "GET",
        url: uri,
        auth: {
            username: scribe_user,
            password: scribe_password
        }
    }).then(function (response) {
        var responseData = response.data;
        var match = responseData.filter(function (c) { return c.name.toLocaleLowerCase() === connectionName.toLowerCase(); });
        if (match.length == 1) {
            // console.log(match[0]);
            console.log("SUCCESS: The id for " + connectionName + " is " + match[0].connectorId);
            return match[0];
        }
        else {
            console.log("ERROR: No Match found");
        }
    }).then(function (data) {
        //TEST the connection:
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(data.id);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>");
        testConnection(baseUrl, organizationId, data.id, data.lastTestedAgentId, scribe_user, scribe_password);
    })
        .catch(function (error) {
        console.log(error.message);
    }).finally(function () {
    });
    // let c = ConnectionInfo;
    // let c = new ConnectionInfo;
}
// testConnection(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password);
var conn = getConnectionByName("Guardian-Dynamics-Test-R1", baseUrl, organizationId, scribe_user, scribe_password);
var ConnectionInfo = /** @class */ (function () {
    function ConnectionInfo() {
    }
    return ConnectionInfo;
}());
var Connection = /** @class */ (function () {
    function Connection() {
    }
    Connection.getConnectionByName = getConnectionByName;
    Connection.testConnection = testConnection;
    Connection.fetchResult = fetchResult;
    return Connection;
}());
exports.Connection = Connection;

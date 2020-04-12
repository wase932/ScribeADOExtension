"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios').default;
const scribe_user = String(process.env.scribe_user);
const scribe_password = String(process.env.scribe_password);
const baseUrl = String(process.env.scribe_baseurl);
const organizationId = Number(process.env.scribe_organizationid);
const connectionId = String(process.env.scribe_connectionid);
const agentId = String(process.env.scribe_agentid);
//Start a test: 
// let startTest = testConnection(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password);
// let x = fetchResult(baseUrl, organizationId, startTest.testId, scribe_user, scribe_password);
// if(fetchResult.status == "Processing"){
// }
// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getUser() {
    try {
        const response = await axios.get('/user?ID=12345');
        console.log(response);
    }
    catch (error) {
        console.error(error);
    }
}
async function testConnectionAsync(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password) {
    console.log("INFO: Testing connection...");
    const uri = baseUrl + "/" + organizationId + "/connections/" + connectionId + "/test?agentid=" + agentId;
    const response = await 
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
        return response.data.id;
    }).catch(function (error) {
        // handle error
        console.log(error);
    }).finally(function () {
        // always executed
    });
    return JSON;
}
function testConnection(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password) {
    console.log("INFO: Testing connection...");
    const uri = baseUrl + "/" + organizationId + "/connections/" + connectionId + "/test?agentid=" + agentId;
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
        return response.data.id;
        // //get the test result
        // while (testResult(baseUrl, organizationId, response.data.id, scribe_user, scribe_password).status == "Processing") {
        //     console.log("INFO.Status: Processing");
        //     // let testProgress = testResult(baseUrl, organizationId, response.data.id, scribe_user, scribe_password);
        //     // if(testProgress.status  == "Processing"){
        //     //     console.log("INFO.Status: " + testProgress.status);
        //     //     break;
        //     // }
        // console.log("SUCCESS: Completed connection test");
        // let testComplete =  testResult(baseUrl, organizationId,response.data.id, scribe_user, scribe_password);
        // console.log(`INFO.Status: ${testComplete.status}`);
        // console.log(`INFO.Result: ${testComplete.result}`);
        // console.log();
    }).catch(function (error) {
        // handle error
        console.log(error);
    }).finally(function () {
        // always executed
    });
    return "";
}
function fetchResult(baseUrl, organizationId, testId, scribe_user, scribe_password) {
    console.log("INFO: Fetching connection test result...");
    const uri = baseUrl + "/" + organizationId + "/connections/test/" + testId;
    axios({
        method: "GET",
        url: uri,
        auth: {
            username: scribe_user,
            password: scribe_password
        }
    }).then(function (response) {
        console.log(`INFO.Status: ${response.data.status}`);
        console.log(`INFO.Result: ${response.data.reply}`);
        return new TestResult(testId, response.data.status, response.data.reply);
    }).catch(function (error) {
        // handle error
        console.log(error);
    }).finally(function () {
        // always executed
    });
}
class Connection {
}
exports.Connection = Connection;
Connection.scribe_user = String(process.env.scribe_user);
Connection.scribe_password = String(process.env.scribe_password);
Connection.baseUrl = String(process.env.scribe_baseurl);
Connection.organizationId = Number(process.env.scribe_organizationid);
Connection.connectionId = String(process.env.scribe_connectionid);
Connection.agentId = String(process.env.scribe_agentid);
Connection.testId = "";
Connection.result = "";
Connection.status = "";
// static result:string
// static TestResult:TestResult = class {
//     // static testId:string;
//     // static status:string;
//     // static result:string;
//     // static  error:Error;
// }
Connection.testConnection = testConnection; //(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password);
// static result = fetchResult(baseUrl, organizationId, Connection.testId, scribe_user, scribe_password);
//Functions
// test = testConnection(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password);
Connection.fetchResult = fetchResult; //(baseUrl, organizationId, Connection.testId, scribe_user, scribe_password);
class TestResult {
    constructor(_testId = "", _status = "", _result = "", _error = new Error) {
        this.testId = _testId, this.status = _status, this.result = _result, this.error = _error;
    }
}
let testId = testConnectionAsync(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password);
let myResult = Connection.fetchResult(baseUrl, organizationId, Connection.testId, scribe_user, scribe_password);
console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
console.log(Connection.testId);
console.log(Connection.status);
console.log(Connection.result);
console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

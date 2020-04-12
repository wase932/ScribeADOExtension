"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios = require('axios').default;
var scribe_user = String(process.env.scribe_user);
var scribe_password = String(process.env.scribe_password);
var baseUrl = String(process.env.scribe_baseurl);
var organizationId = Number(process.env.scribe_organizationid);
var connectionId = String(process.env.scribe_connectionid);
var agentId = String(process.env.scribe_agentid);
//Start a test: 
// let startTest = testConnection(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password);
// let x = fetchResult(baseUrl, organizationId, startTest.testId, scribe_user, scribe_password);
// if(fetchResult.status == "Processing"){
// }
// Want to use async/await? Add the `async` keyword to your outer function/method.
function getUser() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios.get('/user?ID=12345')];
                case 1:
                    response = _a.sent();
                    console.log(response);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function testConnectionAsync(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password) {
    return __awaiter(this, void 0, void 0, function () {
        var uri, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("INFO: Testing connection...");
                    uri = baseUrl + "/" + organizationId + "/connections/" + connectionId + "/test?agentid=" + agentId;
                    return [4 /*yield*/, 
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
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, JSON];
            }
        });
    });
}
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
        console.log("INFO.Result: " + response.data.reply);
        return new TestResult(testId, response.data.status, response.data.reply);
    }).catch(function (error) {
        // handle error
        console.log(error);
    }).finally(function () {
        // always executed
    });
}
var Connection = /** @class */ (function () {
    function Connection() {
    }
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
    return Connection;
}());
exports.Connection = Connection;
var TestResult = /** @class */ (function () {
    function TestResult(_testId, _status, _result, _error) {
        if (_testId === void 0) { _testId = ""; }
        if (_status === void 0) { _status = ""; }
        if (_result === void 0) { _result = ""; }
        if (_error === void 0) { _error = new Error; }
        this.testId = _testId, this.status = _status, this.result = _result, this.error = _error;
    }
    return TestResult;
}());
var testId = testConnectionAsync(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password);
var myResult = Connection.fetchResult(baseUrl, organizationId, Connection.testId, scribe_user, scribe_password);
console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
console.log(Connection.testId);
console.log(Connection.status);
console.log(Connection.result);
console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");

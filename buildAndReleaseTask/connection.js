"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios').default;
const _ = __importStar(require("./index"));
const tl = require("azure-pipelines-task-lib/task");
const uerror = __importStar(require("./utility/error"));
// let scribe_user = index.scribe_user;
// let scribe_password = index.scribe_password;
// let scribe_organizationId = Number(index.scribe_organizationId);
// let scribe_baseUrl = index.scribe_baseUrl;
const sleep = (ms) => new Promise((r, j) => setTimeout(r, ms));
async function startConnectionTestAsync(connectionId, agentId) {
    console.log("INFO: Testing connection...");
    const uri = _.scribe_baseUrl + "/" + _.scribe_organizationId + "/connections/" + connectionId + "/test?agentid=" + agentId;
    console.log("Api path: ", uri);
    try {
        const response = await axios({
            method: "POST",
            url: uri,
            auth: {
                username: _.scribe_user,
                password: _.scribe_password
            }
        });
        console.log("Response:", response.data);
        return response.data.id;
    }
    catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
}
exports.startConnectionTestAsync = startConnectionTestAsync;
async function getConnectionTestResultAsync(testId, delay = 10000) {
    console.log("INFO: Fetching connection test result...");
    const uri = _.scribe_baseUrl + "/" + _.scribe_organizationId + "/connections/test/" + testId;
    let result = new ConnectionTestResult();
    try {
        await sleep(delay);
        let response = await axios({
            method: "GET",
            url: uri,
            auth: {
                username: _.scribe_user,
                password: _.scribe_password
            }
        });
        console.log("Assigning Response data...");
        while (response.data.status != "Completed") {
            console.log(`Results not ready, trying again in ${delay / 1000} seconds`, response.data);
            sleep(delay);
        }
        console.log("results ready...");
        result.testId = testId,
            result.status = response.data.status,
            result.result = response.data.reply;
        console.log("RESULT:", result);
        return result;
    }
    catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
}
exports.getConnectionTestResultAsync = getConnectionTestResultAsync;
async function getAllConnectionsAsync() {
    try {
        console.log("INFO: Getting all connections...");
        console.log(_.scribe_baseUrl);
        console.log(_.scribe_organizationId);
        let uri = _.scribe_baseUrl + "/" + _.scribe_organizationId + "/connections";
        const response = await axios({
            method: "GET",
            url: uri,
            auth: {
                username: _.scribe_user,
                password: _.scribe_password
            }
        });
        return response.data;
    }
    catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
    ;
}
exports.getAllConnectionsAsync = getAllConnectionsAsync;
async function getConnectionByNameAsync(connectionName) {
    //get all connections:
    let allConnections = await getAllConnectionsAsync();
    let match = allConnections.filter(c => c.name.toLocaleLowerCase() === connectionName.toLowerCase());
    if (match.length > 0) {
        console.log("Connection found");
        return match[0];
    }
    else {
        tl.setResult(tl.TaskResult.Failed, `Unable to find a connection named:${connectionName}`);
        process.exit(1);
    }
}
exports.getConnectionByNameAsync = getConnectionByNameAsync;
async function testConnectionAsync(connectionName) {
    try {
        //get connection info:
        let connectionInfo = await getConnectionByNameAsync(connectionName);
        //start test:
        console.log("Connectio Info:::", connectionInfo);
        let testId = await startConnectionTestAsync(connectionInfo.id, connectionInfo.lastTestedAgentId);
        //fetch result:
        let result = await getConnectionTestResultAsync(testId);
        if (result.result == "SUCCESS") {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
}
exports.testConnectionAsync = testConnectionAsync;
async function getEntities(connectionName, offset, fetch) {
    let connection = await getConnectionByNameAsync(connectionName);
    let agentId = connection.lastTestedAgentId;
    let uri = `${_.scribe_baseUrl}/${_.scribe_organizationId}/connections/${connection.id}/entitynames?agentId=${agentId}&offset=${offset}&limit=${fetch}`;
    try {
        console.log(`INFO: Getting entities for connection "${connectionName}"...`);
        console.log("INFO: fetch, offset", fetch, offset);
        const response = await axios({
            method: "GET",
            url: uri,
            auth: {
                username: _.scribe_user,
                password: _.scribe_password
            }
        });
        while (response.status == 404) {
            console.log(`Loading metadata...`);
            sleep(2000);
        }
        return response.data;
    }
    catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
    ;
}
async function getConnectionEntitiesAsync(connectionName) {
    let offset = 0, fetch = 500;
    let result = await getEntities(connectionName, offset, fetch);
    while (1 == 1) {
        console.log("Current Entities: ", result.length);
        let entities = await getEntities(connectionName, offset, fetch);
        if (entities.length > 0) {
            console.log(`INFO: Entities received: `, entities.length);
            result = result.concat(entities);
            offset += entities.length;
        }
        else {
            console.log("INFO: No more entities to retrieve");
            break;
        }
    }
    console.log("INFO: Total number of entites ", result.length);
    console.log(JSON.stringify(result));
    return result;
}
exports.getConnectionEntitiesAsync = getConnectionEntitiesAsync;
class ConnectionInfo {
}
exports.ConnectionInfo = ConnectionInfo;
class ConnectionTestResult {
}
exports.ConnectionTestResult = ConnectionTestResult;

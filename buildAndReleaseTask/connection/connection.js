"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios').default;
const tl = require("azure-pipelines-task-lib/task");
const input_1 = require("../utility/input");
const scribe_user = input_1.getInput("scribeUsername", true);
const scribe_password = input_1.getInput("scribePassword", true);
const scribe_organizationId = Number(input_1.getInput("scribeOrganizationId", true));
const scribe_baseUrl = input_1.getInput("scribeBaseurl", true);
const testConnectionName = input_1.getInput("testConnectionName", false);
const sleep = (ms) => new Promise((r, j) => setTimeout(r, ms));
async function startConnectionTestAsync(connectionId, agentId) {
    console.log("INFO: Testing connection...");
    const uri = scribe_baseUrl + "/" + scribe_organizationId + "/connections/" + connectionId + "/test?agentid=" + agentId;
    try {
        const response = await axios({
            method: "POST",
            url: uri,
            auth: {
                username: scribe_user,
                password: scribe_password
            }
        });
        console.log(response.data);
        return response.data.id;
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
}
exports.startConnectionTestAsync = startConnectionTestAsync;
async function getConnectionTestResultAsync(testId, delay = 5000) {
    console.log("INFO: Fetching connection test result...");
    const uri = scribe_baseUrl + "/" + scribe_organizationId + "/connections/test/" + testId;
    let result = new ConnectionTestResult();
    try {
        //console.log(`waiting for ${delay/1000} seconds before fetching result.....`);
        await sleep(delay);
        let response = await axios({
            method: "GET",
            url: uri,
            auth: {
                username: scribe_user,
                password: scribe_password
            }
        });
        console.log("Assigning Response data...");
        while (response.data.status != "Completed") {
            console.log(`Results not ready, trying again in ${delay / 1000} seconds`, response.data);
            sleep(delay);
        }
        console.log("results ready................");
        result.testId = testId,
            result.status = response.data.status,
            result.result = response.data.reply;
        console.log("RESULT:", result);
        return result;
        // .then((response:any) => {
        //     console.log(response.data);
        //     result.testId = testId,
        //     result.status = response.data.status,
        //     result.result = response.data.reply;
        // });
        // if(result.status != "Completed"){
        //     await getConnectionTestResultAsync(testId, delay);
        // }
        // else return result
    }
    catch (error) {
        tl.error(error);
        process.exit(1);
    }
}
exports.getConnectionTestResultAsync = getConnectionTestResultAsync;
async function getAllConnectionsAsync() {
    try {
        console.log("INFO: Getting all connections...");
        const uri = scribe_baseUrl + "/" + scribe_organizationId + "/connections";
        const response = await axios({
            method: "GET",
            url: uri,
            auth: {
                username: scribe_user,
                password: scribe_password
            }
        });
        return response.data;
    }
    catch (error) {
        console.error(error);
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
        console.log(error);
        tl.setResult(tl.TaskResult.Failed, `Unable to test connection named:${connectionName}`);
        tl.error(error);
        process.exit(1);
    }
}
exports.testConnectionAsync = testConnectionAsync;
// testConnectionAsync(testConnectionName).then((x) => {
// console.log("FINAL RESULT", x);
// });
class ConnectionInfo {
}
exports.ConnectionInfo = ConnectionInfo;
class ConnectionTestResult {
}
exports.ConnectionTestResult = ConnectionTestResult;

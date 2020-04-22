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
const tl = require("azure-pipelines-task-lib/task");
const input_1 = require("./utility/input");
const conn = __importStar(require("./connection"));
const agt = __importStar(require("./agent"));
const uerror = __importStar(require("./utility/error"));
const scribe_user = input_1.getInput("scribeUsername", true);
const scribe_password = input_1.getInput("scribePassword", true);
const scribe_organizationId = Number(input_1.getInput("scribeOrganizationId", true));
const scribe_baseUrl = input_1.getInput("scribeBaseurl", true);
const solutionName = input_1.getInput("solutionName", false);
const agentName = input_1.getInput("agentName", false);
const solutionEnabled = Boolean(input_1.getInput("solutionEnabled", false));
const sourceConnectionName = input_1.getInput("sourceConnectionName", false);
const targetConnectionName = input_1.getInput("targetConnectionName", false);
const entitySelectionMode = input_1.getInput("entitySelectionMode", false); /**Recommended, Selected, All */
const selectedEntities = JSON.parse(input_1.getInput("selectedEntities", false) || "");
const solutionDescription = input_1.getInput("solutionDescription", false);
const solutionType = input_1.getInput("solutionType", false); /**Replication */
var entitySelectionModeOptions;
(function (entitySelectionModeOptions) {
    entitySelectionModeOptions["Recommended"] = "Recommended";
    entitySelectionModeOptions["All"] = "All";
    entitySelectionModeOptions["Selected"] = "Selected";
})(entitySelectionModeOptions || (entitySelectionModeOptions = {}));
;
const sleep = (ms) => new Promise((r, j) => setTimeout(r, ms));
//get all solutions
async function getAllSolutionsAsync() {
    console.log("INFO: Retrieving all solutions...");
    const uri = scribe_baseUrl + "/" + scribe_organizationId + "/solutions?limit=500";
    try {
        const response = await axios({
            method: "GET",
            url: uri,
            auth: {
                username: scribe_user,
                password: scribe_password
            }
        });
        console.log("Number of solutions found ", response.data.length);
        return response.data;
    }
    catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
}
exports.getAllSolutionsAsync = getAllSolutionsAsync;
//check if solution name exists, if it does, retrieve the solution information
async function getSolutionByNameAsync(name) {
    //get all solutions:
    try {
        let allSolutions = await getAllSolutionsAsync();
        let match = allSolutions.filter(c => c.name.toLocaleLowerCase() === name.toLowerCase());
        if (match.length > 0) {
            console.log("Solution match found: ", match[0]);
            return match[0];
        }
        else {
            console.log(`Solution: ${name} does not exist`);
            return undefined;
        }
    }
    catch (error) {
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
    ;
}
exports.getSolutionByNameAsync = getSolutionByNameAsync;
async function prepareSolutionAsync(solutionId) {
    console.log("INFO: Preparing Solution to run...");
    const uri = `${scribe_baseUrl}/${scribe_organizationId}/solutions/${solutionId}/prepare`;
    try {
        const response = await axios({
            method: "POST",
            url: uri,
            auth: {
                username: scribe_user,
                password: scribe_password
            }
        });
        console.log("INFO: Started Solution Prep ", response.data);
        return response.data;
    }
    catch (error) {
        uerror.CatchAxiosError(error);
        return new SolutionPrepareStatus();
        //Do not fail task
    }
}
async function getSolutionPrepareResultAsync(solutionId, prepareId) {
    console.log("INFO: Fetching result of solution prep...");
    const uri = `${scribe_baseUrl}/${scribe_organizationId}/solutions/${solutionId}/prepare/${prepareId}`;
    try {
        const response = await axios({
            method: "POST",
            url: uri,
            auth: {
                username: scribe_user,
                password: scribe_password
            }
        });
        while (!response.data.isComplete) {
            sleep(2000);
        }
        console.log("INFO: Solution prep result is now complete ", response.data);
        return response.data;
    }
    catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
}
async function createSolution() {
    try {
        //check if solution exists
        let solution = await getSolutionByNameAsync(solutionName) || new Solution();
        if (solution.replicationSettings == undefined) {
            solution.replicationSettings = new ReplicationSettings();
        }
        if (solution) {
            console.log(`Solution "${solutionName}" exists`);
        }
        else {
            console.log(`Solution "${solutionName}" does not exist`);
        }
        //get connections:
        let sourceConn = await conn.getConnectionByNameAsync(sourceConnectionName);
        let targetConn = await conn.getConnectionByNameAsync(targetConnectionName);
        //construct solution object to create
        let agent = await agt.getAgentByNameAsync(agentName);
        solution.name = solutionName,
            solution.agentId = agent.id,
            solution.description = solutionDescription,
            solution.connectionIdForSource = sourceConn.id,
            solution.connectionIdForTarget = targetConn.id,
            solution.solutionType = solutionType,
            solution.isDisabled = !solutionEnabled,
            solution.replicationSettings = { selectionType: entitySelectionMode, entities: selectedEntities };
        if (entitySelectionMode == entitySelectionModeOptions.Selected) {
            console.log("Entity Selection Mode:", entitySelectionMode);
        }
        //Ajax call to create or update solution:
        let uri = "", httpMethod = "";
        console.log("solution: ", solution);
        if (solution.id) {
            console.log("INFO: Updating Solution...");
            httpMethod = "PUT";
            uri = `${scribe_baseUrl}/${scribe_organizationId}/solutions/${solution.id}`;
        }
        else {
            console.log("INFO: Creating Solution...");
            httpMethod = "POST";
            uri = `${scribe_baseUrl}/${scribe_organizationId}/solutions`;
        }
        try {
            let response = await axios({
                method: httpMethod,
                url: uri,
                auth: {
                    username: scribe_user,
                    password: scribe_password
                },
                data: solution
            });
            console.log("Data Sent:", solution);
            console.log("Response Data:", response.data);
            if (solutionEnabled) {
                await prepareSolutionAsync(response.data.id);
                await startSolutionByIdAsync(response.data.id);
            }
            return response.data;
        }
        catch (error) {
            uerror.CatchAxiosError(error);
            tl.setResult(tl.TaskResult.Failed, error);
        }
    }
    catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
    }
    return new Solution();
}
exports.createSolution = createSolution;
async function deleteSolution(name) {
    console.log("INFO: Deleting solution...");
    let solution = await getSolutionByNameAsync(name);
    if (!solution) {
        console.log(`solution ${name} not found. Nothing to delete`);
        tl.setResult(tl.TaskResult.Skipped, "Only an existing solution can be deleted");
        process.exit(0);
    }
    const uri = `${scribe_baseUrl}/${scribe_organizationId}/solutions/${solution.id}`;
    try {
        let response = await axios({
            method: "DELETE",
            url: uri,
            auth: {
                username: scribe_user,
                password: scribe_password
            }
        });
        console.log("Status ", response.status);
        console.log(`solution ${name} has been deleted`);
        return true;
        // return response.code == 200? true : false;
    }
    catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
}
exports.deleteSolution = deleteSolution;
async function startSolutionByIdAsync(solutionId, attempts = 2) {
    console.log("INFO: Starting solution...");
    await sleep(5000);
    //Try again...
    let i = 1;
    const uri = `${scribe_baseUrl}/${scribe_organizationId}/solutions/${solutionId}/start`;
    try {
        let response = await axios({
            method: "POST",
            url: uri,
            auth: {
                username: scribe_user,
                password: scribe_password
            }
        });
        console.log("Status ", response.status);
        console.log("INFO: Started Solution ", solutionId);
        return true;
    }
    catch (error) {
        if (i < attempts) {
            await startSolutionByIdAsync(solutionId, i);
        }
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
}
exports.startSolutionByIdAsync = startSolutionByIdAsync;
async function startSolutionByNameAsync(solutionName, attempts = 2) {
    const solution = await getSolutionByNameAsync(solutionName);
    let start = await startSolutionByIdAsync((solution === null || solution === void 0 ? void 0 : solution.id) || "", attempts);
    return start;
}
exports.startSolutionByNameAsync = startSolutionByNameAsync;
class Solution {
}
class ReplicationSettings {
}
class SolutionPrepareStatus {
}

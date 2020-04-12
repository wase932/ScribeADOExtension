"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
// import * as utility from './utility/input';
const input_1 = require("./utility/input");
const conn = __importStar(require("./connection/connection"));
var actionOptions;
(function (actionOptions) {
    actionOptions["testConnection"] = "testConnection";
    actionOptions["createSolution"] = "createSolution";
    actionOptions["deleteSolution"] = "deleteSolution";
    actionOptions["getConnectionEntities"] = "getConnectionEntities";
})(actionOptions || (actionOptions = {}));
;
const scribe_user = input_1.getInput("scribeUsername", true);
const scribe_password = input_1.getInput("scribePassword", true);
const scribe_organizationId = Number(input_1.getInput("scribeOrganizationId", true));
const scribe_baseUrl = input_1.getInput("scribeBaseurl", true);
const scribeAction = input_1.getInput("scribeAction", true);
const sourceConnectionName = input_1.getInput("sourceConnectionName", false);
const targetConnectionName = input_1.getInput("targetConnectionName", false);
const testConnectionName = input_1.getInput("testConnectionName", false);
const determineAction = async function (action) {
    switch (action) {
        case actionOptions.testConnection:
            conn.testConnectionAsync(testConnectionName).then((x) => {
                if (x) {
                    tl.setResult(tl.TaskResult.Succeeded, `The ${testConnectionName} connection passed test.`);
                }
                else {
                    tl.setResult(tl.TaskResult.Failed, `The ${testConnectionName} connection failed test.`);
                }
            });
            break;
        case actionOptions.createSolution:
            createSolution();
            break;
        case actionOptions.deleteSolution:
            deleteSolution();
            break;
        case actionOptions.getConnectionEntities:
            getConnectionEntities();
            break;
    }
};
determineAction(scribeAction);
function createSolution() {
    console.log("Creating a solution...");
}
function deleteSolution() {
    console.log("Deleting a solution...");
}
function getConnectionEntities() {
    console.log("Fetching entities of connection...");
}

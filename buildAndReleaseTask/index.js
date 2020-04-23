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
const conn = __importStar(require("./connection"));
const sol = __importStar(require("./solution"));
var actionOptions;
(function (actionOptions) {
    actionOptions["testConnection"] = "testConnection";
    actionOptions["createSolution"] = "createSolution";
    actionOptions["deleteSolution"] = "deleteSolution";
    actionOptions["getConnectionEntities"] = "getConnectionEntities";
    actionOptions["startSolution"] = "startSolution";
})(actionOptions || (actionOptions = {}));
;
exports.scribeAction = input_1.getInput("scribeAction", true);
exports.connectionName = input_1.getInput("connectionName", false);
exports.solutionName = input_1.getInput("solutionName", false);
exports.scribe_user = input_1.getInput("scribeUsername", true);
exports.scribe_password = input_1.getInput("scribePassword", true);
exports.scribe_organizationId = Number(input_1.getInput("scribeOrganizationId", true));
exports.scribe_baseUrl = input_1.getInput("scribeBaseurl", true);
exports.agentName = input_1.getInput("agentName", false);
exports.solutionEnabled = Boolean(input_1.getInput("solutionEnabled", false));
exports.sourceConnectionName = input_1.getInput("sourceConnectionName", false);
exports.targetConnectionName = input_1.getInput("targetConnectionName", false);
exports.entitySelectionMode = input_1.getInput("entitySelectionMode", false); /**Recommended, Selected, All */
exports.selectedEntities = JSON.parse(input_1.getInput("selectedEntities", false) || "");
exports.solutionDescription = input_1.getInput("solutionDescription", false);
exports.solutionType = input_1.getInput("solutionType", false); /**Replication */
const determineAction = async function (action) {
    switch (action) {
        case actionOptions.testConnection:
            conn.testConnectionAsync(exports.connectionName);
            break;
        case actionOptions.createSolution:
            sol.createSolution();
            break;
        case actionOptions.deleteSolution:
            sol.deleteSolution(exports.solutionName);
            break;
        case actionOptions.getConnectionEntities:
            conn.getConnectionEntitiesAsync(exports.connectionName);
            break;
        case actionOptions.startSolution:
            let StartSolresult = await sol.startSolutionByNameAsync(exports.solutionName);
            if (!StartSolresult) {
                tl.setResult(tl.TaskResult.Failed, "Failed to start Solution: " + exports.solutionName);
                process.exit(1);
            }
            break;
    }
};
determineAction(exports.scribeAction);

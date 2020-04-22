"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const scribeAction = input_1.getInput("scribeAction", true);
const connectionName = input_1.getInput("connectionName", false);
const solutionName = input_1.getInput("solutionName", false);
const determineAction = async function (action) {
    switch (action) {
        case actionOptions.testConnection:
            conn.testConnectionAsync(connectionName);
            break;
        case actionOptions.createSolution:
            sol.createSolution();
            break;
        case actionOptions.deleteSolution:
            sol.deleteSolution(solutionName);
            break;
        case actionOptions.getConnectionEntities:
            conn.getConnectionEntitiesAsync(connectionName);
            break;
        case actionOptions.startSolution:
            sol.startSolutionByNameAsync(solutionName);
            break;
    }
};
determineAction(scribeAction);

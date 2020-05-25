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
const sch = __importStar(require("./schedule"));
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
exports.selectedEntities = function () { try {
    return JSON.parse(input_1.getInput("selectedEntities", false));
}
catch (error) {
    console.log("error");
} return []; }();
exports.solutionDescription = input_1.getInput("solutionDescription", false);
exports.solutionType = input_1.getInput("solutionType", false); /**Replication */
exports.startSolutionAfterCreateOrUpdate = input_1.getInput("startSolutionAfterCreateOrUpdate", false); //true, false
//schehdule
exports.scheduleOption = input_1.getInput("ScheduleOption"); //["once": "recurring"] //RunOnce : Recurring
exports.runOnceOptionDate = input_1.getInput("runOnceOptionDate"); // MM-DD-YYYY
exports.runOnceOptionTime = input_1.getInput("runOnceOptionTime"); // HH:MM
exports.recurringOptionDaysOption = input_1.getInput("recurringOptionDaysOption"); // [daysInterval,daysOfWeek,daysOfMonth]
exports.recurringOptionDaysIntervalStartDate = input_1.getInput("recurringOptionDaysIntervalStartDate"); // MM-DD-YYYY
exports.recurringOptionDaysInterval = Number(input_1.getInput("recurringOptionDaysInterval")); //Frequency in days (valid values: 1 to 366)
exports.recurringOptionDaysOfWeek = input_1.getInput("recurringOptionDaysOfWeek"); //Days of the Week
exports.recurringOptionDaysOfMonth = input_1.getInput("recurringOptionDaysOfMonth"); //Valid values: 1 - 28, last"
exports.recurringOptionTimeOptionTime = input_1.getInput("recurringOptionTimeOptionTime"); // timeInterval, timeOfDay, hourlyMinutes
exports.timeIntervalUnit = input_1.getInput("timeIntervalUnit"); // minutes, hours
exports.recurringOptionTime = input_1.getInput("recurringOptionTime"); // HH:MM
exports.recurringOptionTimeOptionMinutesAfterTheHour = Number(input_1.getInput("recurringOptionTimeOptionMinutesAfterTheHour")); // Minutes After The Hour
exports.recurringOptionTimeOptionMinutes = Number(input_1.getInput("recurringOptionTimeOptionMinutes")); // Minute intervals
exports.recurringOptionTimeOptionHours = Number(input_1.getInput("recurringOptionTimeOptionHours")); // Hour Intervals
const determineAction = async function (action) {
    switch (action) {
        case actionOptions.testConnection:
            conn.testConnectionAsync(exports.connectionName);
            break;
        case actionOptions.createSolution:
            let solution = await sol.createSolution();
            let scheduleObject = sch.ConstructScheduleObject(solution.id);
            if (scheduleObject) {
                sch.addSchedule(scheduleObject);
            }
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

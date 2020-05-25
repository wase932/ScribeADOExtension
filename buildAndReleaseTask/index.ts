import tl = require('azure-pipelines-task-lib/task');
// import * as utility from './utility/input';
import  { getInput }  from './utility/input';
import *  as conn from './connection';
import *  as sol from './solution';
import * as sch from './schedule';

enum actionOptions{ testConnection = "testConnection",
                    createSolution = "createSolution",
                    deleteSolution = "deleteSolution",
                    getConnectionEntities = "getConnectionEntities",
                    startSolution = "startSolution"
                };

export const scribeAction = getInput("scribeAction", true);
export const connectionName = getInput("connectionName", false);
export const solutionName = getInput("solutionName", false);
export const scribe_user = getInput("scribeUsername", true);
export const scribe_password = getInput("scribePassword", true);
export const scribe_organizationId = Number(getInput("scribeOrganizationId", true));
export const scribe_baseUrl = getInput("scribeBaseurl", true);
export const agentName = getInput("agentName", false);
export const solutionEnabled:boolean = Boolean(getInput("solutionEnabled", false));
export const sourceConnectionName = getInput("sourceConnectionName", false);
export const targetConnectionName = getInput("targetConnectionName", false);
export const entitySelectionMode = getInput("entitySelectionMode", false); /**Recommended, Selected, All */
export const selectedEntities:Array<string> = function():Array<string> {try{return JSON.parse(getInput("selectedEntities", false))}catch(error){console.log("error")} return [] }();
export const solutionDescription = getInput("solutionDescription", false);
export const solutionType = getInput("solutionType", false); /**Replication */
export const startSolutionAfterCreateOrUpdate = getInput("startSolutionAfterCreateOrUpdate", false); //true, false

//schehdule
export const scheduleOption = getInput("ScheduleOption") //["once": "recurring"] //RunOnce : Recurring
export const runOnceOptionDate = getInput("runOnceOptionDate") // MM-DD-YYYY
export const runOnceOptionTime = getInput("runOnceOptionTime") // HH:MM
export const recurringOptionDaysOption = getInput("recurringOptionDaysOption") // [daysInterval,daysOfWeek,daysOfMonth]
export const recurringOptionDaysIntervalStartDate = getInput("recurringOptionDaysIntervalStartDate") // MM-DD-YYYY
export const recurringOptionDaysInterval = Number(getInput("recurringOptionDaysInterval")) //Frequency in days (valid values: 1 to 366)
export const recurringOptionDaysOfWeek = getInput("recurringOptionDaysOfWeek") //Days of the Week
export const recurringOptionDaysOfMonth = getInput("recurringOptionDaysOfMonth") //Valid values: 1 - 28, last"
export const recurringOptionTimeOptionTime = getInput("recurringOptionTimeOptionTime") // timeInterval, timeOfDay, hourlyMinutes
export const timeIntervalUnit = getInput("timeIntervalUnit") // minutes, hours
export const recurringOptionTime = getInput("recurringOptionTime") // HH:MM
export const recurringOptionTimeOptionMinutesAfterTheHour = Number(getInput("recurringOptionTimeOptionMinutesAfterTheHour")) // Minutes After The Hour
export const recurringOptionTimeOptionMinutes = Number(getInput("recurringOptionTimeOptionMinutes")) // Minute intervals
export const recurringOptionTimeOptionHours = Number(getInput("recurringOptionTimeOptionHours")) // Hour Intervals

const determineAction = async function  (action: string){
    switch (action) {
        case actionOptions.testConnection:
            conn.testConnectionAsync(connectionName);
            break;
        case actionOptions.createSolution:
            let solution = await sol.createSolution();
            let scheduleObject = sch.ConstructScheduleObject(solution.id);
            if(scheduleObject){
                sch.addSchedule(scheduleObject);
            }
            break;
        case actionOptions.deleteSolution:
            sol.deleteSolution(solutionName);
            break;
        case actionOptions.getConnectionEntities:
            conn.getConnectionEntitiesAsync(connectionName);
            break;
        case actionOptions.startSolution:
            let StartSolresult = await sol.startSolutionByNameAsync(solutionName);
            if(!StartSolresult){
                tl.setResult(tl.TaskResult.Failed, "Failed to start Solution: " + solutionName);
                process.exit(1);
            }
            break;
    }
}

determineAction(scribeAction);
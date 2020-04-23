import tl = require('azure-pipelines-task-lib/task');
// import * as utility from './utility/input';
import  { getInput }  from './utility/input';
import *  as conn from './connection';
import *  as sol from './solution';


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
export const selectedEntities:Array<string> = JSON.parse(getInput("selectedEntities", false)|| "");
export const solutionDescription = getInput("solutionDescription", false);
export const solutionType = getInput("solutionType", false); /**Replication */

const determineAction = async function  (action: string){
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
            let StartSolresult = await sol.startSolutionByNameAsync(solutionName);
            if(!StartSolresult){
                tl.setResult(tl.TaskResult.Failed, "Failed to start Solution: " + solutionName);
                process.exit(1);
            }
            break;
    }
}

determineAction(scribeAction);
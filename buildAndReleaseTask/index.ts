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

const scribeAction = getInput("scribeAction", true);
const connectionName = getInput("connectionName", false);
const solutionName = getInput("solutionName", false);

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
            sol.startSolutionByNameAsync(solutionName);
            break;
    }
}

determineAction(scribeAction);
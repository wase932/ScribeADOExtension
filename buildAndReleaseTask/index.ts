import tl = require('azure-pipelines-task-lib/task');
// import * as utility from './utility/input';
import  { getInput }  from './utility/input';
import *  as conn from './connection/connection';

enum actionOptions{ testConnection = "testConnection",
                    createSolution = "createSolution",
                    deleteSolution = "deleteSolution",
                    getConnectionEntities = "getConnectionEntities" };

const scribe_user = getInput("scribeUsername", true);
const scribe_password = getInput("scribePassword", true);
const scribe_organizationId = Number(getInput("scribeOrganizationId", true));
const scribe_baseUrl = getInput("scribeBaseurl", true);
const scribeAction = getInput("scribeAction", true);
const sourceConnectionName = getInput("sourceConnectionName", false);
const targetConnectionName = getInput("targetConnectionName", false);
const testConnectionName = getInput("testConnectionName", false);

const determineAction = async function  (action: string){
    switch (action) {
        case actionOptions.testConnection:
            conn.testConnectionAsync(testConnectionName).then((x) => {
                    if(x){
                     tl.setResult(tl.TaskResult.Succeeded, `The ${testConnectionName} connection passed test.` );   
                    }else{
                        tl.setResult(tl.TaskResult.Failed, `The ${testConnectionName} connection failed test.` );
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
}

determineAction(scribeAction);

function createSolution(){
    console.log("Creating a solution...");
}

function deleteSolution(){
    console.log("Deleting a solution...");
}

function getConnectionEntities(){
    console.log("Fetching entities of connection...");
}

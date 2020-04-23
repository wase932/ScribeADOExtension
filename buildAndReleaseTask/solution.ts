const axios = require('axios').default;
import * as _ from './index';
import tl = require('azure-pipelines-task-lib/task');
import *  as conn from './connection';
import *  as agt from './agent';
import * as uerror from './utility/error';

enum entitySelectionModeOptions {
    Recommended = "Recommended",
    All = "All",
    Selected = "Selected"
};

const sleep = (ms:number) => new Promise((r, j)=>setTimeout(r, ms));

//get all solutions
export async function getAllSolutionsAsync():Promise<Array<Solution>>{
    console.log("INFO: Retrieving all solutions...");
    const uri:string = _.scribe_baseUrl+"/"+_.scribe_organizationId+"/solutions?limit=500";

    try {
        const response = await axios({
            method: "GET",
            url: uri,
            auth: {
                username: _.scribe_user,
                password: _.scribe_password
            }
        });
        console.log("Number of solutions found ", response.data.length);
        return response.data;
    } catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
}

//check if solution name exists, if it does, retrieve the solution information
export async function getSolutionByNameAsync(name:string): Promise<Solution | undefined>{
    //get all solutions:
    try{
        let allSolutions = await getAllSolutionsAsync();
        let match:Array<Solution> = allSolutions.filter(c => c.name.toLocaleLowerCase() === name.toLowerCase());
        if(match.length > 0){
            console.log("Solution match found: ", match[0]);
            return match[0];
        }else{
            console.log(`Solution: ${name} does not exist`);
            return undefined;
        }
    }
    catch(error) {
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    };
}
    
async function prepareSolutionAsync(solutionId:string): Promise<SolutionPrepareStatus>{
    console.log("INFO: Preparing Solution to run...");
    const uri:string = `${_.scribe_baseUrl}/${_.scribe_organizationId}/solutions/${solutionId}/prepare`;

    try {
        const response = await axios({
            method: "POST",
            url: uri,
            auth: {
                username: _.scribe_user,
                password: _.scribe_password
            }
        });
        console.log("INFO: Started Solution Prep ", response.data);
        return response.data;
    } catch (error) {
        uerror.CatchAxiosError(error);
        return new SolutionPrepareStatus();
        //Do not fail task
    }
}

async function getSolutionPrepareResultAsync(solutionId:string, prepareId: string):Promise<SolutionPrepareStatus>{
    console.log("INFO: Fetching result of solution prep...");
    const uri:string = `${_.scribe_baseUrl}/${_.scribe_organizationId}/solutions/${solutionId}/prepare/${prepareId}`;

    try {
        const response = await axios({
            method: "POST",
            url: uri,
            auth: {
                username: _.scribe_user,
                password: _.scribe_password
            }
        });
        while(!response.data.isComplete){
            sleep(2000);
        }
        console.log("INFO: Solution prep result is now complete ", response.data);
        return response.data;
    } catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }

}

export async function createSolution():Promise<Solution>{
    try{
        //check if solution exists
        let solution = await getSolutionByNameAsync(_.solutionName) || new Solution();
        if(solution.replicationSettings == undefined){
            solution.replicationSettings = new ReplicationSettings();
        }

        if(solution){ 
            console.log(`Solution "${_.solutionName}" exists`);
        }
        else {
            console.log(`Solution "${_.solutionName}" does not exist`);
        }
        
        //get connections:
        let sourceConn = await conn.getConnectionByNameAsync(_.sourceConnectionName);
        let targetConn = await conn.getConnectionByNameAsync(_.targetConnectionName);

        //construct solution object to create
        let agent = await agt.getAgentByNameAsync(_.agentName);

        solution.name = _.solutionName,
        solution.agentId = agent.id,
        solution.description = _.solutionDescription,
        solution.connectionIdForSource = sourceConn.id,
        solution.connectionIdForTarget = targetConn.id,
        solution.solutionType = _.solutionType,
        solution.isDisabled = !_.solutionEnabled,
        solution.replicationSettings = {selectionType : _.entitySelectionMode, entities:_.selectedEntities};
        
        if(_.entitySelectionMode == entitySelectionModeOptions.Selected){
            console.log("Entity Selection Mode:", _.entitySelectionMode);
        }

        //Ajax call to create or update solution:
        let uri:string = "", httpMethod:string = "";

        console.log("solution: ", solution)

        if (solution.id){
            console.log("INFO: Updating Solution...");
            httpMethod = "PUT";
            uri = `${_.scribe_baseUrl}/${_.scribe_organizationId}/solutions/${solution.id}`;
        }else {
            console.log("INFO: Creating Solution...");
            httpMethod = "POST";
            uri = `${_.scribe_baseUrl}/${_.scribe_organizationId}/solutions`;
        }

        try {
            let response = await axios({
                method: httpMethod,
                url: uri,
                auth: {
                    username: _.scribe_user,
                    password: _.scribe_password
                },
                data: solution
            });
            console.log("Data Sent:", solution);
            console.log("Response Data:", response.data);

            if(_.solutionEnabled){
            await prepareSolutionAsync(response.data.id);
            await startSolutionByIdAsync(response.data.id);
        }
            return response.data;

        } catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        }
    }
    catch(error){
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
    }
    return new Solution();
}

export async function deleteSolution(name:string):Promise<boolean>{
    console.log("INFO: Deleting solution...");
    let solution = await getSolutionByNameAsync(name);

    if(!solution){
        console.log(`solution ${name} not found. Nothing to delete`);
        tl.setResult(tl.TaskResult.Skipped, "Only an existing solution can be deleted");
        process.exit(0);
    }

    const uri:string = `${_.scribe_baseUrl}/${_.scribe_organizationId}/solutions/${solution.id}`;

    try {
        let response = await axios({
            method: "DELETE",
            url: uri,
            auth: {
                username: _.scribe_user,
                password: _.scribe_password
            }
        });
        console.log("Status ", response.status);
        console.log(`solution ${name} has been deleted`);
        return true;
        // return response.code == 200? true : false;
    } catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
}

export async function startSolutionByIdAsync(solutionId:string, attempts:number = 2):Promise<boolean>{
    console.log("INFO: Starting solution...");
    await sleep(5000);
    //Try again...
    let i:number = 1;
    const uri:string = `${_.scribe_baseUrl}/${_.scribe_organizationId}/solutions/${solutionId}/start`;

    try {
        let response = await axios({
            method: "POST",
            url: uri,
            auth: {
                username: _.scribe_user,
                password: _.scribe_password
            }
        });
        console.log("Status ", response.status);
        console.log("INFO: Started Solution ", solutionId);
        return true;
    } catch (error) {
        if(i < attempts){
            await startSolutionByIdAsync(solutionId, i)
        }
        uerror.CatchAxiosError(error);
        return false;
    }
}

export async function startSolutionByNameAsync(solutionName:string, attempts:number = 2):Promise<boolean>{
    const solution = await getSolutionByNameAsync(solutionName);
    let start = await startSolutionByIdAsync(solution?.id || "", attempts);
    return start;
}

class Solution {
    id!:string;
    name!:string;
    agentId!:string;
    description!:string;
    connectionIdForSource!:string;
    connectionIdForTarget!:string;
    solutionType!:string;
    status!:string;
    inProgressStartTime!:Date;
    lastRunTime!:Date;
    nextRunTime!:Date;
    isDisabled!:boolean;
    minAgentVersion!:string;
    modificationBy!:string;
    replicationSettings!:ReplicationSettings;
}

class ReplicationSettings {
    selectionType!:string;
    entities!:Array<string>
}

class SolutionPrepareStatus {
    creationDate!:Date
    hasError!:boolean
    id!:string
    isComplete!:boolean
    message!:string
    solutionId!:string
}
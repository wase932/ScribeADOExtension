const axios = require('axios').default;
import * as _ from './index';
import tl = require('azure-pipelines-task-lib/task');
import * as uerror from './utility/error';

export async function getAllAgentsAsync(): Promise<Array<Agent>>{
    try{
        console.log("INFO: Getting all agents...");
        const uri:string = _.scribe_baseUrl+"/"+_.scribe_organizationId+"/agents";

        const response = await axios({
            method: "GET",
            url: uri,
            auth: {
                username: _.scribe_user,
                password: _.scribe_password
            }
        });
        return response.data;
    }
    catch(error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    };
}

export async function getAgentByNameAsync(agentName:string): Promise<Agent>{
    //get all connections:
    let allAgents = await getAllAgentsAsync();
    let match:Array<Agent> = allAgents.filter(c => c.name.toLocaleLowerCase() === agentName.toLowerCase());
    if(match.length > 0){
        console.log("Agent found", match[0]);
        return match[0];
    }else{
        tl.setResult(tl.TaskResult.Failed, `Unable to find agent named:${agentName}`);
        process.exit(1);
    }
}

class Agent {
    id!:string;
    name!:string;
    status!:string;
    machineName!:string;
    version!:string;
    serviceName!:string;
    lastStartTime!:Date;
    lastShutdownTime!:Date;
    lastContactTime!:Date;
    isCloudAgent!:boolean;
    isUpdating!:boolean;
    usedInSolutions!:string;
    updateStateDateTime!:Date;
    installedConnectors!:[{key:string, value:string}];
}
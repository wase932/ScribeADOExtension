const axios = require('axios').default;
import tl = require('azure-pipelines-task-lib/task');
import  { getInput }  from './utility/input';
import * as uerror from './utility/error';

const scribe_user = getInput("scribeUsername", true);
const scribe_password = getInput("scribePassword", true);
const scribe_organizationId = Number(getInput("scribeOrganizationId", true));
const scribe_baseUrl = getInput("scribeBaseurl", true);

export async function getAllAgentsAsync(): Promise<Array<Agent>>{
    try{
        console.log("INFO: Getting all agents...");
        const uri:string = scribe_baseUrl+"/"+scribe_organizationId+"/agents";

        const response = await axios({
            method: "GET",
            url: uri,
            auth: {
                username: scribe_user,
                password: scribe_password
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
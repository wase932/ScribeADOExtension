const axios = require('axios').default;
import tl = require('azure-pipelines-task-lib/task');
import  { getInput }  from './utility/input';
import * as uerror from './utility/error';
import * as agent from './agent';

const scribe_user = getInput("scribeUsername", true);
const scribe_password = getInput("scribePassword", true);
const scribe_organizationId = Number(getInput("scribeOrganizationId", true));
const scribe_baseUrl = getInput("scribeBaseurl", true);
const connectionName = getInput("connectionName", false);

const sleep = (ms:number) => new Promise((r, j)=>setTimeout(r, ms));

export async function startConnectionTestAsync(connectionId:string, agentId:string):Promise<string>{
    console.log("INFO: Testing connection...");
    const uri:string = scribe_baseUrl+"/"+scribe_organizationId+"/connections/"+connectionId+"/test?agentid="+agentId;
    console.log("Api path: ", uri);

    try {
        const response = await axios({
            method: "POST",
            url: uri,
            auth: {
                username: scribe_user,
                password: scribe_password
            }
        });
        console.log("Response:", response.data);
        return response.data.id;
    } catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
}

export async function getConnectionTestResultAsync(testId:string, delay:number = 10000): Promise<ConnectionTestResult>{
    console.log("INFO: Fetching connection test result...");
    const uri:string = scribe_baseUrl+"/"+scribe_organizationId+"/connections/test/"+testId;
    let result = new ConnectionTestResult();
    try{
        await sleep(delay);
        let response = await axios({
                                    method: "GET",
                                    url: uri,
                                    auth: {
                                        username: scribe_user,
                                        password: scribe_password
                                    }
                                });
        console.log("Assigning Response data...");
        while(response.data.status != "Completed"){
            console.log(`Results not ready, trying again in ${delay/1000} seconds`, response.data);
            sleep(delay);
        }
        console.log("results ready...");

        result.testId = testId,
        result.status = response.data.status,
        result.result = response.data.reply;

        console.log("RESULT:" ,result);
        return result;
    }
    catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
}

export async function getAllConnectionsAsync(): Promise<Array<ConnectionInfo>>{
    try{
        console.log("INFO: Getting all connections...");
        const uri:string = scribe_baseUrl+"/"+scribe_organizationId+"/connections";

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

export async function getConnectionByNameAsync(connectionName:string): Promise<ConnectionInfo>{
    //get all connections:
    let allConnections = await getAllConnectionsAsync();
    let match:Array<ConnectionInfo> = allConnections.filter(c => c.name.toLocaleLowerCase() === connectionName.toLowerCase());
    if(match.length > 0){
        console.log("Connection found");
        return match[0];
    }else{
        tl.setResult(tl.TaskResult.Failed, `Unable to find a connection named:${connectionName}`);
        process.exit(1);
    }
}

export async function testConnectionAsync(connectionName:string):Promise<boolean>{
    try{
        //get connection info:
        let connectionInfo = await getConnectionByNameAsync(connectionName);
        //start test:
        console.log("Connectio Info:::", connectionInfo);
        let testId = await startConnectionTestAsync(connectionInfo.id, connectionInfo.lastTestedAgentId);
        //fetch result:
        let result = await getConnectionTestResultAsync(testId);
        if(result.result == "SUCCESS"){
            return true;
        } else {
            return false;
        }
    }
    catch(error){
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
}

async function getEntities(connectionName:string, offset:number, fetch:number):Promise<Array<string>>{
    let connection = await getConnectionByNameAsync(connectionName);
    let agentId = connection.lastTestedAgentId;

    let uri:string = `${scribe_baseUrl}/${scribe_organizationId}/connections/${connection.id}/entitynames?agentId=${agentId}&offset=${offset}&limit=${fetch}`;

    try{
        console.log(`INFO: Getting entities for connection "${connectionName}"...`);
        console.log("INFO: fetch, offset", fetch, offset);

        const response = await axios({
            method: "GET",
            url: uri,
            auth: {
                username: scribe_user,
                password: scribe_password
            }
        });
        while(response.status == 404){
            console.log(`Loading metadata...`);
            sleep(2000);
        }
        return response.data;
    }
    catch(error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    };
}

export async function getConnectionEntitiesAsync(connectionName:string):Promise<Array<string>>{
    let offset = 0, fetch = 500;
    let result:Array<string> = await getEntities(connectionName, offset, fetch);
    
    while(1 == 1){
        console.log("Current Entities: ", result.length);
        let entities = await getEntities(connectionName, offset, fetch);
        if(entities.length > 0){
            console.log(`INFO: Entities received: `, entities.length);
            result = result.concat(entities);
            offset += entities.length;
        }else{
            console.log("INFO: No more entities to retrieve");
            break;
        }
    }
    console.log("INFO: Total number of entites ", result.length);
    console.log(JSON.stringify(result));
    return result;
}

export class ConnectionInfo {
    id!:string;
    name!:string;
    alias!:string;
    color!:string;
    connectorId!:string;
    connectorType!:string;
    createDateTime!:Date;
    lastModificationDateTime!:Date;
    usedInSolutions!:string;
    lastTestedAgentId!:string;
}

export class ConnectionTestResult {
    testId!:string;
    status!:string;
    result!:string;
}
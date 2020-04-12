const axios = require('axios').default;
import tl = require('azure-pipelines-task-lib/task');
import  { getInput }  from '../utility/input';

const scribe_user = getInput("scribeUsername", true);
const scribe_password = getInput("scribePassword", true);
const scribe_organizationId = Number(getInput("scribeOrganizationId", true));
const scribe_baseUrl = getInput("scribeBaseurl", true);
const testConnectionName = getInput("testConnectionName", false);

const sleep = (ms:number) => new Promise((r, j)=>setTimeout(r, ms));

export async function startConnectionTestAsync(connectionId:string, agentId:string):Promise<string>{
    console.log("INFO: Testing connection...");
    const uri:string = scribe_baseUrl+"/"+scribe_organizationId+"/connections/"+connectionId+"/test?agentid="+agentId;

    try {
        const response = await axios({
            method: "POST",
            url: uri,
            auth: {
                username: scribe_user,
                password: scribe_password
            }
        });
        console.log(response.data);
        return response.data.id;
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export async function getConnectionTestResultAsync(testId:string, delay:number = 5000): Promise<ConnectionTestResult>{
    console.log("INFO: Fetching connection test result...");
    const uri:string = scribe_baseUrl+"/"+scribe_organizationId+"/connections/test/"+testId;
    let result = new ConnectionTestResult();
    try{
        //console.log(`waiting for ${delay/1000} seconds before fetching result.....`);
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
        console.log("results ready................");

        result.testId = testId,
        result.status = response.data.status,
        result.result = response.data.reply;

        console.log("RESULT:" ,result);
        return result;
        // .then((response:any) => {
        //     console.log(response.data);
        //     result.testId = testId,
        //     result.status = response.data.status,
        //     result.result = response.data.reply;
        // });

        
        // if(result.status != "Completed"){
        //     await getConnectionTestResultAsync(testId, delay);
        // }
        // else return result
    }
    catch (error) {
        tl.error(error);
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
        console.error(error);
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
        console.log(error);
        tl.setResult(tl.TaskResult.Failed, `Unable to test connection named:${connectionName}`);
        tl.error(error);
        process.exit(1);
    }
}

// testConnectionAsync(testConnectionName).then((x) => {
// console.log("FINAL RESULT", x);
// });

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
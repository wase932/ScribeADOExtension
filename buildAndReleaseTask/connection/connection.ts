const axios = require('axios').default;

const scribe_user = String(process.env.scribe_user);
const scribe_password = String(process.env.scribe_password);
const baseUrl = String(process.env.scribe_baseurl);
const organizationId = Number(process.env.scribe_organizationid);
const connectionId = String(process.env.scribe_connectionid);
const agentId = String(process.env.scribe_agentid);

function testConnection(baseUrl:string, organizationId:number, connectionId:string, agentId:string, scribe_user:string , scribe_password:string)
{
    console.log("INFO: Testing connection...");
    const uri:string = baseUrl+"/"+organizationId+"/connections/"+connectionId+"/test?agentid="+agentId;

    //Make an api call:
    axios({
        method: "POST",
        url: uri,
        auth: {
            username: scribe_user,
            password: scribe_password
        }
    }).then(function (response:any) {
        console.log("INFO: Test started.");
        console.log("INFO: Test id is " + response.data.id);
        console.log("INFO.Status: " + response.data.status);

        //Begin call to get results:
        fetchResult(baseUrl, organizationId, response.data.id, scribe_user, scribe_password);
    }).catch(function (error:Error) {
        console.log(error.message);
            // handle error
            console.log(error);
    }).finally(function () {
            // always executed
    });
    
}

function fetchResult(baseUrl:string, organizationId:number, testId:string, scribe_user:string, scribe_password:string, attemptCount:number = 0)
{
    console.log("INFO: Fetching connection test result...");
    const uri:string = baseUrl+"/"+organizationId+"/connections/test/"+testId;

    axios({
        method: "GET",
        url: uri,
        auth: {
            username: scribe_user,
            password: scribe_password
        }
    }).then(function (response:any) {
        console.log(`INFO.Status: ${response.data.status}`);
        //console.log(`INFO.Result: ${response.data}`);
        // console.log(response);
        //If the status is not completed, then try again...
        

            //delay
            setTimeout(() => 
            {
                if(response.data.status != "Completed"){
                    console.log(`Result is still processing for id: ${testId}. This is attempt ${attemptCount}`);
                    attemptCount += 1;
                fetchResult(baseUrl, organizationId, response.data.id, scribe_user, scribe_password, attemptCount);
                }else {
                    console.log("INFO: Testing is now complete");
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    console.log("RESULT: " + response.data.reply);
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    
                    //output the data in the response:
                    let responseData:Array<{key:string, value:string}> = response.data.replyData;
                    responseData.forEach( (element) => {
                        console.log( `${element.key} :: ${element.value}`);
                    });
        
                }
            },
            10000);
        //Log status


    }).catch(function (error:Error) {
            // handle error
            console.log(error.message);
    }).finally(function () {
            // always executed
    });
}

function getConnectionByName(connectionName:string, baseUrl:string, organizationId:number, scribe_user:string, scribe_password:string):ConnectionInfo | any
{
    console.log("INFO: Getting all connections...");
    const uri:string = baseUrl+"/"+organizationId+"/connections";

    axios({
        method: "GET",
        url: uri,
        auth: {
            username: scribe_user,
            password: scribe_password
        }
    }).then(function (response:any) {
        let responseData:Array<ConnectionInfo> = response.data;
        let match:Array<ConnectionInfo> = responseData.filter(c => c.name.toLocaleLowerCase() === connectionName.toLowerCase());
        if(match.length == 1){
            // console.log(match[0]);
            console.log(`SUCCESS: The id for ${connectionName} is ${match[0].connectorId}`);
            return match[0];
        }else{
            console.log("ERROR: No Match found");
        }
    }).then(function(data:any){
        //TEST the connection:
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(data.id)
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>");
        testConnection(baseUrl, organizationId, data.id, data.lastTestedAgentId, scribe_user, scribe_password);
    })
    
    .catch(function (error:Error) {
        console.log(error.message);
    }).finally(function () {

    });
    // let c = ConnectionInfo;
    // let c = new ConnectionInfo;

}

// testConnection(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password);

let conn:ConnectionInfo = getConnectionByName("Guardian-Dynamics-Test-R1", baseUrl, organizationId, scribe_user, scribe_password);

class ConnectionInfo {
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

class Connection {
    static getConnectionByName = getConnectionByName;
    static testConnection = testConnection;
    static fetchResult = fetchResult;
}

export { Connection }
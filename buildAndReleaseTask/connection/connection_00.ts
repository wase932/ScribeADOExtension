const axios = require('axios').default;

const scribe_user = String(process.env.scribe_user);
const scribe_password = String(process.env.scribe_password);
const baseUrl = String(process.env.scribe_baseurl);
const organizationId = Number(process.env.scribe_organizationid);
const connectionId = String(process.env.scribe_connectionid);
const agentId = String(process.env.scribe_agentid);

//Start a test: 
// let startTest = testConnection(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password);
// let x = fetchResult(baseUrl, organizationId, startTest.testId, scribe_user, scribe_password);
// if(fetchResult.status == "Processing"){
// }

// Want to use async/await? Add the `async` keyword to your outer function/method.
async function getUser() {
    try {
      const response = await axios.get('/user?ID=12345');
      console.log(response);
    } catch (error) {
      console.error(error);
    }
}

async function testConnectionAsync(baseUrl:string, organizationId:number, connectionId:string, agentId:string, scribe_user:string , scribe_password:string):Promise<JSON>
{
    console.log("INFO: Testing connection...");
    const uri:string = baseUrl+"/"+organizationId+"/connections/"+connectionId+"/test?agentid="+agentId;
        const response = await 
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
        return response.data.id;
    }).catch(function (error:Error) {
            // handle error
            console.log(error);
    }).finally(function () {
            // always executed
    });
    return JSON;
}

function testConnection(baseUrl:string, organizationId:number, connectionId:string, agentId:string, scribe_user:string , scribe_password:string):string
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
        return response.data.id;
        // //get the test result
        // while (testResult(baseUrl, organizationId, response.data.id, scribe_user, scribe_password).status == "Processing") {
        //     console.log("INFO.Status: Processing");
        //     // let testProgress = testResult(baseUrl, organizationId, response.data.id, scribe_user, scribe_password);
        //     // if(testProgress.status  == "Processing"){
        //     //     console.log("INFO.Status: " + testProgress.status);
        //     //     break;
        //     // }
        // console.log("SUCCESS: Completed connection test");
        // let testComplete =  testResult(baseUrl, organizationId,response.data.id, scribe_user, scribe_password);

        // console.log(`INFO.Status: ${testComplete.status}`);
        // console.log(`INFO.Result: ${testComplete.result}`);
        // console.log();
    }).catch(function (error:Error) {
            // handle error
            console.log(error);
    }).finally(function () {
            // always executed
    });
    
    return "";
}

function fetchResult(baseUrl:string, organizationId:number, testId:string, scribe_user:string, scribe_password:string): TestResult | any{
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
        console.log(`INFO.Result: ${response.data.reply}`);
        return new TestResult (testId, response.data.status, response.data.reply)

    }).catch(function (error:Error) {
            // handle error
            console.log(error);
    }).finally(function () {
            // always executed
    });
}

class Connection {
    static scribe_user      = String(process.env.scribe_user);
    static scribe_password  = String(process.env.scribe_password);
    static baseUrl          = String(process.env.scribe_baseurl);
    static organizationId   = Number(process.env.scribe_organizationid);
    static connectionId     = String(process.env.scribe_connectionid);
    static agentId          = String(process.env.scribe_agentid);
    static testId:string    = "";
    static result:string    = "";
    static status:string    = "";
    // static result:string
    // static TestResult:TestResult = class {
    //     // static testId:string;
    //     // static status:string;
    //     // static result:string;
    //     // static  error:Error;
    // }
    static testConnection = testConnection//(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password);
    // static result = fetchResult(baseUrl, organizationId, Connection.testId, scribe_user, scribe_password);
    //Functions
    // test = testConnection(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password);
    static fetchResult = fetchResult//(baseUrl, organizationId, Connection.testId, scribe_user, scribe_password);

}

class TestResult {
    testId:string;
    status:string;
    result:string;
    error:Error;

    constructor(_testId:string = "", _status:string = "", _result:string = "", _error:Error= new Error){
        this.testId = _testId, this.status = _status, this.result = _result, this.error = _error
    }
    
}

export { Connection }


let testId = testConnectionAsync(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password);
let myResult = Connection.fetchResult(baseUrl, organizationId, Connection.testId, scribe_user, scribe_password);

console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
console.log(Connection.testId);
console.log(Connection.status);
console.log(Connection.result);

console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")




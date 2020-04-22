"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require('axios').default;
const tl = require("azure-pipelines-task-lib/task");
const input_1 = require("./utility/input");
const uerror = __importStar(require("./utility/error"));
const scribe_user = input_1.getInput("scribeUsername", true);
const scribe_password = input_1.getInput("scribePassword", true);
const scribe_organizationId = Number(input_1.getInput("scribeOrganizationId", true));
const scribe_baseUrl = input_1.getInput("scribeBaseurl", true);
async function getAllAgentsAsync() {
    try {
        console.log("INFO: Getting all agents...");
        const uri = scribe_baseUrl + "/" + scribe_organizationId + "/agents";
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
    catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
    ;
}
exports.getAllAgentsAsync = getAllAgentsAsync;
async function getAgentByNameAsync(agentName) {
    //get all connections:
    let allAgents = await getAllAgentsAsync();
    let match = allAgents.filter(c => c.name.toLocaleLowerCase() === agentName.toLowerCase());
    if (match.length > 0) {
        console.log("Agent found", match[0]);
        return match[0];
    }
    else {
        tl.setResult(tl.TaskResult.Failed, `Unable to find agent named:${agentName}`);
        process.exit(1);
    }
}
exports.getAgentByNameAsync = getAgentByNameAsync;
class Agent {
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import * as utility from './utility/input';
var input_1 = require("./utility/input");
var connection_1 = require("./connection/connection");
var actionOptions;
(function (actionOptions) {
    actionOptions["testConnection"] = "testConnection";
    actionOptions["createSolution"] = "createSolution";
    actionOptions["deleteSolution"] = "deleteSolution";
    actionOptions["getConnectionEntities"] = "getConnectionEntities";
})(actionOptions || (actionOptions = {}));
;
var scribe_user = input_1.getInput("scribeUsername", true);
var scribe_password = input_1.getInput("scribePassword", true);
var scribe_organizationId = Number(input_1.getInput("scribeOrganizationId", true));
var scribe_baseUrl = input_1.getInput("scribeBaseurl", true);
var scribeAction = input_1.getInput("scribeAction", true);
var sourceConnectionName = input_1.getInput("sourceConnectionName", true);
var targetConnectionName = input_1.getInput("targetConnectionName", false);
var determineAction = function (action) {
    switch (action) {
        case actionOptions.testConnection:
            connection_1.Connection.getConnectionByName(sourceConnectionName, scribe_baseUrl, scribe_organizationId, scribe_user, scribe_password);
            // Connection.testConnection(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password);
            // connection.testConnection(baseUrl, organizationId, connectionId, agentId, scribe_user, scribe_password);
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
};
determineAction(scribeAction);
function createSolution() {
    console.log("Creating a solution...");
}
function deleteSolution() {
    console.log("Deleting a solution...");
}
function getConnectionEntities() {
    console.log("Fetching entities of connection...");
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib/task");
function getInput(name, isRequired = false) {
    try {
        const value = String(tl.getInput(name, isRequired));
        if (value == "bad") {
            tl.setResult(tl.TaskResult.Failed, "Bad input");
            return value;
        }
        console.log("Read input: " + name + " with value: " + value);
        return value;
    }
    catch (error) {
        tl.setResult(tl.TaskResult.Failed, error.message);
        process.exit(1);
    }
}
exports.getInput = getInput;

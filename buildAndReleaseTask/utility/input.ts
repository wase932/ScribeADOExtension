import tl = require('azure-pipelines-task-lib/task');

export function getInput(name:string, isRequired:boolean = false):string {
    try{
        const value:string = String(tl.getInput(name, isRequired));
        if(value == "bad"){
            tl.setResult(tl.TaskResult.Failed, "Bad input");
            return value;
        }
        console.log("Read input: " + name + " with value: " + value);
        return value;
    }
    catch(error) {
        tl.setResult(tl.TaskResult.Failed, error.message);
        process.exit(1);
    }
}
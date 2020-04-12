# ScribeADOExtension
An extension for deploying scribe solutions via Azure Dev Ops Release pipelines

## Package extension
`tfx extension create --manifest-globs vss-extension.json`

## References

 > [Scribe Web API Reference](https://dev.scribesoft.com/en/main/reference)
 
 > [InvokeRestApiV1](https://github.com/microsoft/azure-pipelines-tasks/blob/master/Tasks/InvokeRestApiV1/task.json)
 
 > [TaskSchema](https://raw.githubusercontent.com/Microsoft/azure-pipelines-task-lib/master/tasks.schema.json)

 > [Azure Pipelines Task Library Typescript API](https://github.com/microsoft/azure-pipelines-task-lib/blob/master/node/docs/azure-pipelines-task-lib.md)

 > [How to Add a build or release task](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops)

 ## Create Environment Variables
 > `export INPUT_SCRIBEUSERNAME=****`

 > `export INPUT_SCRIBEPASSWORD=****`

 > `export INPUT_SCRIBEORGANIZATIONID=****`

 > `export INPUT_SCRIBEBASEURL=****`

 > `export INPUT_SCRIBEACTION=****`

 > `export INPUT_SOURCECONNECTIONNAME=****`

 > `export INPUT_TARGETCONNECTIONNAME=****`
# ScribeADOExtension
An extension for deploying scribe solutions via Azure Dev Ops Release pipelines

## Package extension
`cd buildandreleasetask && tsc && cd ..`

`tfx extension create --manifest-globs vss-extension.json`

## References

 > [Scribe Web API Reference](https://dev.scribesoft.com/en/main/reference)
 
 > [InvokeRestApiV1](https://github.com/microsoft/azure-pipelines-tasks/blob/master/Tasks/InvokeRestApiV1/task.json)
 
 > [TaskSchema](https://raw.githubusercontent.com/Microsoft/azure-pipelines-task-lib/master/tasks.schema.json)

 > [Azure Pipelines Task Library Typescript API](https://github.com/microsoft/azure-pipelines-task-lib/blob/master/node/docs/azure-pipelines-task-lib.md)

 > [How to Add a build or release task](https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops)

 > [Publish Extension Marketplace](https://marketplace.visualstudio.com/manage/publishers)

 ## Create Environment Variables

> INPUT_SCRIBEORGANIZATIONID=***

> INPUT_SCRIBEBASEURL=https://api.scribesoft.com/v1/orgs

> INPUT_SCRIBEUSERNAME=***

> INPUT_SCRIBEPASSWORD=***

> INPUT_SCRIBEACTION=***

> INPUT_SOLUTIONNAME=***

> INPUT_SOLUTIONDESCRIPTION=***

> INPUT_SOURCECONNECTIONNAME=***

> INPUT_TARGETCONNECTIONNAME=***

> INPUT_AGENTNAME=***

> INPUT_SELECTEDENTITIES=***

> INPUT_SOLUTIONTYPE=***

> INPUT_ENTITYSELECTIONMODE=***

> INPUT_CONNECTIONNAME=***


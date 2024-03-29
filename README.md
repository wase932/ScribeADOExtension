# ScribeADOExtension
An extension for deploying scribe solutions via Azure Dev Ops Release pipelines.
The extension can be installed via the marketplace: [scribe-solution-deployment](https://marketplace.visualstudio.com/items?itemName=ToluAdepoju.scribe-solution-deployment)

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

 ## Standard Environmental Variables

````
INPUT_SCRIBEORGANIZATIONID=***
INPUT_SCRIBEBASEURL=https://api.scribesoft.com/v1/orgs
INPUT_SCRIBEUSERNAME=***
INPUT_SCRIBEPASSWORD=***
INPUT_SCRIBEACTION=***
INPUT_SOLUTIONNAME=***
INPUT_SOLUTIONDESCRIPTION=***
INPUT_SOURCECONNECTIONNAME=***
INPUT_TARGETCONNECTIONNAME=***
INPUT_AGENTNAME=***
INPUT_SELECTEDENTITIES=***
INPUT_SOLUTIONTYPE=***
INPUT_ENTITYSELECTIONMODE=***
INPUT_CONNECTIONNAME=***
INPUT_ScheduleOption
````
## Schedules

##### Run On Demand
````
export INPUT_SCRIBEBASEURL=https://api.scribesoft.com/v1/orgs
export INPUT_SCRIBEORGANIZATIONID= *****
export INPUT_SCRIBEUSERNAME= myuser@email.com
export INPUT_SCRIBEPASSWORD=*******
export INPUT_SCRIBEACTION=none
export INPUT_SOLUTIONNAME="Scribe-Solution-Name"
export INPUT_SCHEDULEOPTION=OnDemand
````
##### Run Once
````
export INPUT_SCRIBEBASEURL=https://api.scribesoft.com/v1/orgs
export INPUT_SCRIBEORGANIZATIONID= *****
export INPUT_SCRIBEUSERNAME= myuser@email.com
export INPUT_SCRIBEPASSWORD=*******
export INPUT_SCRIBEACTION=none
export INPUT_SOLUTIONNAME="Scribe-Solution-Name"
export INPUT_SCHEDULEOPTION=RunOnce
export INPUT_RUNONCEOPTIONDATE="08-02-2020"
export INPUT_RUNONCEOPTIONTIME="14:15:00"
````
##### Run Every 100 Days at 01:00am Starting on 08-01-2021
````
export INPUT_SCRIBEBASEURL=https://api.scribesoft.com/v1/orgs
export INPUT_SCRIBEORGANIZATIONID= *****
export INPUT_SCRIBEUSERNAME= myuser@email.com
export INPUT_SCRIBEPASSWORD=*******
export INPUT_SCRIBEACTION=none
export INPUT_SOLUTIONNAME="Scribe-Solution-Name"
export INPUT_SCHEDULEOPTION=Recurring
export INPUT_RECURRINGOPTIONDAYSOPTION=daysInterval
export INPUT_RECURRINGOPTIONDAYSINTERVAL=100
export INPUT_RECURRINGOPTIONDAYSINTERVALSTARTDATE="08-01-2021"
export INPUT_RECURRINGOPTIONTIMEOPTIONTIME=timeOfDay
export INPUT_RECURRINGOPTIONTIME="01:00"
export INPUT_TIMEINTERVALUNIT=null
tsc && node index.js
````
##### Run every 30 minutes starting on 02-01-2025
````
export INPUT_SCRIBEBASEURL=https://api.scribesoft.com/v1/orgs
export INPUT_SCRIBEORGANIZATIONID= *****
export INPUT_SCRIBEUSERNAME= myuser@email.com
export INPUT_SCRIBEPASSWORD=*******
export INPUT_SCRIBEACTION=none
export INPUT_SOLUTIONNAME="Scribe-Solution-Name"
export INPUT_SCHEDULEOPTION=Recurring
export INPUT_RECURRINGOPTIONDAYSOPTION=daysInterval
export INPUT_RECURRINGOPTIONDAYSINTERVAL=1
export INPUT_RECURRINGOPTIONDAYSINTERVALSTARTDATE="02-01-2025"
export INPUT_RECURRINGOPTIONTIMEOPTIONTIME=timeInterval
export INPUT_RECURRINGOPTIONTIMEOPTIONMINUTES=30
export INPUT_TIMEINTERVALUNIT=minutes
tsc && node index.js
````
##### Run every 20 hours starting on 12-03-2030
````
export INPUT_SCRIBEBASEURL=https://api.scribesoft.com/v1/orgs
export INPUT_SCRIBEORGANIZATIONID= *****
export INPUT_SCRIBEUSERNAME= myuser@email.com
export INPUT_SCRIBEPASSWORD=*******
export INPUT_SCRIBEACTION=none
export INPUT_SOLUTIONNAME="Scribe-Solution-Name"
export INPUT_SCHEDULEOPTION=Recurring
export INPUT_RECURRINGOPTIONDAYSOPTION=daysInterval
export INPUT_RECURRINGOPTIONDAYSINTERVAL=1
export INPUT_RECURRINGOPTIONDAYSINTERVALSTARTDATE="02-01-2025"
export INPUT_RECURRINGOPTIONTIMEOPTIONTIME=timeInterval
export INPUT_TIMEINTERVALUNIT=hours
export INPUT_RECURRINGOPTIONTIMEOPTIONHOURS=20
tsc && node index.js
````
##### Recurring every 10 days beginning on 2/1/2025 every hour 15 minutes after the hour
````
export INPUT_SCRIBEBASEURL=https://api.scribesoft.com/v1/orgs
export INPUT_SCRIBEORGANIZATIONID= *****
export INPUT_SCRIBEUSERNAME= myuser@email.com
export INPUT_SCRIBEPASSWORD=*******
export INPUT_SCRIBEACTION=none
export INPUT_SOLUTIONNAME="Scribe-Solution-Name"
export INPUT_SCHEDULEOPTION=Recurring
export INPUT_RECURRINGOPTIONDAYSOPTION=daysInterval
export INPUT_RECURRINGOPTIONDAYSINTERVAL=10
export INPUT_RECURRINGOPTIONDAYSINTERVALSTARTDATE="02-01-2025"
export INPUT_RECURRINGOPTIONTIMEOPTIONTIME=hourlyMinutes
export INPUT_RECURRINGOPTIONTIMEOPTIONMINUTESAFTERTHEHOUR=15
tsc && node index.js
````
##### Recurring every 200 days beginning on 2/1/2025 at 1:29 PM
````
export INPUT_SCRIBEBASEURL=https://api.scribesoft.com/v1/orgs
export INPUT_SCRIBEORGANIZATIONID= *****
export INPUT_SCRIBEUSERNAME= myuser@email.com
export INPUT_SCRIBEPASSWORD=*******
export INPUT_SCRIBEACTION=none
export INPUT_SOLUTIONNAME="Scribe-Solution-Name"
export INPUT_SCHEDULEOPTION=Recurring
export INPUT_RECURRINGOPTIONDAYSOPTION=daysInterval
export INPUT_RECURRINGOPTIONDAYSINTERVAL=200
export INPUT_RECURRINGOPTIONDAYSINTERVALSTARTDATE="02-01-2025"
export INPUT_RECURRINGOPTIONTIMEOPTIONTIME=timeOfDay
export INPUT_RECURRINGOPTIONTIME=13:29
tsc && node index.js
````
##### Recurring every Sunday, Tuesday, Thursday every 30 Minutes
````
export INPUT_SCRIBEBASEURL=https://api.scribesoft.com/v1/orgs
export INPUT_SCRIBEORGANIZATIONID= *****
export INPUT_SCRIBEUSERNAME= myuser@email.com
export INPUT_SCRIBEPASSWORD=*******
export INPUT_SCRIBEACTION=none
export INPUT_SOLUTIONNAME="Scribe-Solution-Name"
export INPUT_SCHEDULEOPTION=Recurring
export INPUT_RECURRINGOPTIONDAYSOPTION=daysOfWeek
export INPUT_RECURRINGOPTIONDAYSOFWEEK="1,3,5"
export INPUT_RECURRINGOPTIONDAYSINTERVALSTARTDATE="02-01-2025"
export INPUT_RECURRINGOPTIONTIMEOPTIONTIME=timeInterval
export INPUT_TIMEINTERVALUNIT=minutes
export INPUT_RECURRINGOPTIONTIMEOPTIONMINUTES=30
tsc && node index.js
````
##### Recurring on the following days: 1, 7, 15, 23, 27 at 9:00 PM
````
export INPUT_SCRIBEBASEURL=https://api.scribesoft.com/v1/orgs
export INPUT_SCRIBEORGANIZATIONID= *****
export INPUT_SCRIBEUSERNAME= myuser@email.com
export INPUT_SCRIBEPASSWORD=*******
export INPUT_SCRIBEACTION=none
export INPUT_SOLUTIONNAME="Scribe-Solution-Name"
export INPUT_SCHEDULEOPTION=Recurring
export INPUT_RECURRINGOPTIONDAYSOPTION=daysOfMonth
export INPUT_RECURRINGOPTIONDAYSOFMONTH="1,7,15,23,27"
export INPUT_RECURRINGOPTIONTIMEOPTIONTIME=timeOfDay
export INPUT_RECURRINGOPTIONTIME="21:00"
tsc && node index.js
````
##### Recurring on the first and last days of each month at midnight
````
export INPUT_SCRIBEBASEURL=https://api.scribesoft.com/v1/orgs
export INPUT_SCRIBEORGANIZATIONID= *****
export INPUT_SCRIBEUSERNAME= myuser@email.com
export INPUT_SCRIBEPASSWORD=*******
export INPUT_SCRIBEACTION=none
export INPUT_SOLUTIONNAME="Scribe-Solution-Name"
export INPUT_SCHEDULEOPTION=Recurring
export INPUT_RECURRINGOPTIONDAYSOPTION=daysOfMonth
export INPUT_RECURRINGOPTIONDAYSOFMONTH="last"
export INPUT_RECURRINGOPTIONTIMEOPTIONTIME=timeOfDay
export INPUT_RECURRINGOPTIONTIME="00:00"
tsc && node index.js
````

## All schedule variables
````
export INPUT_SCHEDULEOPTION=RunOnce
export INPUT_RUNONCEOPTIONDATE=08-02-2020
export INPUT_RUNONCEOPTIONTIME=14:15:00
export INPUT_RECURRINGOPTIONDAYSOPTION=
export INPUT_RECURRINGOPTIONDAYSINTERVALSTARTDATE=
export INPUT_RECURRINGOPTIONDAYSINTERVAL=
export INPUT_RECURRINGOPTIONDAYSOFWEEK=
export INPUT_RECURRINGOPTIONDAYSOFMONTH=
export INPUT_RECURRINGOPTIONTIMEOPTIONTIME=
export INPUT_RECURRINGOPTIONTIME=
export INPUT_TIMEINTERVALUNIT=
export INPUT_RECURRINGOPTIONTIMEOPTIONMINUTESAFTERTHEHOUR=
export INPUT_RECURRINGOPTIONTIMEOPTIONMINUTES=
export INPUT_RECURRINGOPTIONTIMEOPTIONHOURS=
export INPUT_SCRIBEORGANIZATIONID= *****
export INPUT_SCRIBEBASEURL=https://api.scribesoft.com/v1/orgs
export INPUT_SCRIBEUSERNAME= myuser@email.com
export INPUT_SCRIBEPASSWORD=*******
export INPUT_SCRIBEACTION=***
export INPUT_SOLUTIONNAME="Scribe-Solution-Name"
export INPUT_SOLUTIONDESCRIPTION=***
export INPUT_SOURCECONNECTIONNAME=***
export INPUT_TARGETCONNECTIONNAME=***
export INPUT_AGENTNAME=***
export INPUT_SELECTEDENTITIES=***
export INPUT_SOLUTIONTYPE=***
export INPUT_ENTITYSELECTIONMODE=***
export INPUT_CONNECTIONNAME=***
export INPUT_SCHEDULEOPTION=***
````
## Unset all schedule variables
````
unset INPUT_SCHEDULEOPTION
unset INPUT_RUNONCEOPTIONDATE
unset INPUT_RUNONCEOPTIONTIME
unset INPUT_RECURRINGOPTIONDAYSOPTION
unset INPUT_RECURRINGOPTIONDAYSINTERVALSTARTDATE
unset INPUT_RECURRINGOPTIONDAYSINTERVAL
unset INPUT_RECURRINGOPTIONDAYSOFWEEK
unset INPUT_RECURRINGOPTIONDAYSOFMONTH
unset INPUT_RECURRINGOPTIONTIMEOPTIONTIME
unset INPUT_RECURRINGOPTIONTIME
unset INPUT_TIMEINTERVALUNIT
unset INPUT_RECURRINGOPTIONTIMEOPTIONMINUTESAFTERTHEHOUR
unset INPUT_RECURRINGOPTIONTIMEOPTIONMINUTES
unset INPUT_RECURRINGOPTIONTIMEOPTIONHOURS
unset INPUT_SCRIBEORGANIZATIONID
unset INPUT_SCRIBEBASEURL
unset INPUT_SCRIBEUSERNAME
unset INPUT_SCRIBEPASSWORD
unset INPUT_SCRIBEACTION
unset INPUT_SOLUTIONNAME
unset INPUT_SOLUTIONDESCRIPTION
unset INPUT_SOURCECONNECTIONNAME
unset INPUT_TARGETCONNECTIONNAME
unset INPUT_AGENTNAME
unset INPUT_SELECTEDENTITIES
unset INPUT_SOLUTIONTYPE
unset INPUT_ENTITYSELECTIONMODE
unset INPUT_CONNECTIONNAME
unset INPUT_SCHEDULEOPTION
````

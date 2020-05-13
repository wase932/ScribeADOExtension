# Scribe Solution Deployment
This extension consumes the [Tibco Scribe web apis](https://api.scribesoft.com/) to automate solution deployments.

---------
---------

### Functionality
+ Test a Connection: 
`Runs a test against an existing connection to validate it. A success indicates that the connection is both valid and active.`

+ Create/Update Solution: 
`Checks if a solution with the same name exists. If it does, it updates the solution where any of the provided inputs do not match the existing solution. If it does not exist, it creates a new solution. While creating/updating a solution, this task validates the source and target connections and kicks off the solution upon successful creation.`

+ Delete Solution: 
`Deletes a solution using its name. It is helpful to note that if the solution was not found to exist, this task will output a warning, but return a successful result.`

+ Get Entities: 
`This Task will retrive a list of entities found in a connection. The output is printed to the console in a Json string array.`
+ Start Solution: 
`As the name suggests, starts a solution. Useful for scheduling solutions from the Azure Release pipelines.`
---------
---------

#### Product Roadmap
+ There is no plan to add any additional features at the moment. Updates will be announced.
#### Bug and Error reporting 
+ Found a bug? Please report it [here](https://github.com/wase932/ScribeADOExtension/issues).
#### Contribute 
+ Contributions are welcome. If you wish to contribute, head over to the [Github](https://github.com/wase932/ScribeADOExtension/pulls).
#### License
+ MIT

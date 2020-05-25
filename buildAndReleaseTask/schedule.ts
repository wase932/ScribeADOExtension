const axios = require('axios').default;
import * as _ from './index';
import tl = require('azure-pipelines-task-lib/task');
import * as uerror from './utility/error';

export async function addSchedule(schedule:ISchedule): Promise<Boolean>{
    console.log("Info: Starting schedule tasks...");
    try{
        if(schedule == null || schedule == undefined){
            console.log(`INFO: The schedule object is empty. No further action will be taken...`);
            return true;
        }

        console.log(`INFO: Updating Schedule for solution: ${_.solutionName}...`);
        console.log("INFO: Schedule configuration to be applied is:", schedule);
        const uri:string = _.scribe_baseUrl+"/"+_.scribe_organizationId+"/solutions/" + schedule.solutionId + "/schedule";

        const response = await axios({
            method: "PUT",
            url: uri,
            auth: {
                username: _.scribe_user,
                password: _.scribe_password
            },
            data: schedule
        });
        console.log("RESPONSE DATA:",response.data);
        return response.data;
    }
    catch(error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    };
}

export function ConstructScheduleObject(solutionId:string): ISchedule| null{
    try{
        //no action
        if(_.scheduleOption == scheduleOption.NoAction){
            console.log("INFO: There will be no action taken on the solutions's schedule");
            return null;
        }
        
        //on demand
        if(_.scheduleOption == scheduleOption.OnDemand){
            let schedule:ISchedule  = {
                scheduleOption: scheduleOption.OnDemand,
                solutionId: solutionId,
                recurringOptions: null,
                runOnceOptions: null
            }
            return schedule
        }

        let schedule:ISchedule = {
            scheduleOption: _.scheduleOption,
            solutionId: solutionId,
            runOnceOptions:{
                dateTime: function(){ let d = splitStringToDate(_.runOnceOptionDate); return `${d?.year}-${d?.month}-${d?.day}T${_.runOnceOptionTime}Z`; }()
            },
            recurringOptions:{
                days: {
                    daysOption: (() => { return _.recurringOptionDaysOption == 'undefined'? null : _.recurringOptionDaysOption})(),
                    daysIntervalStartDate: (() => {let d = splitStringToDate(_.recurringOptionDaysIntervalStartDate); return `${d?.year}-${d?.month}-${d?.day}`})(),
                    daysInterval: _.recurringOptionDaysInterval || null,
                    daysOfMonth: (() => { if (_.recurringOptionDaysOption == recurringOptionDaysOption.DaysOfMonth) return processDaysInputToArray(_.recurringOptionDaysOfMonth); return []})(),
                    daysOfWeek:(() => { if (_.recurringOptionDaysOption == recurringOptionDaysOption.DaysOfWeek) return convertToDaysOfWeek(processDaysInputToArray(_.recurringOptionDaysOfWeek)); return []})(),
                    lastDayOfMonth: function ():boolean { if(_.recurringOptionDaysOfMonth.indexOf("last") > -1)  {return true;} return false;}()
                },times: {
                    timeOption:_.recurringOptionTimeOptionTime,
                    hourlyMinutes: (() => {if (_.recurringOptionTimeOptionTime != timeIntervalUnit.hours && _.recurringOptionTimeOptionTime != timeIntervalUnit.minutes) return _.recurringOptionTimeOptionMinutesAfterTheHour; return null})(),
                    timeOfDay: processTimeInput(_.recurringOptionTime) || null,
                    timeInterval: (() => {if (_.timeIntervalUnit == timeIntervalUnit.hours) {return _.recurringOptionTimeOptionHours} if(_.timeIntervalUnit == timeIntervalUnit.minutes) return _.recurringOptionTimeOptionMinutes; return null })(),
                    timeIntervalUnit: function() {if (_.timeIntervalUnit == timeIntervalUnit.hours) return timeIntervalUnit.hours; if(_.timeIntervalUnit == timeIntervalUnit.minutes) return timeIntervalUnit.minutes; return null }()
                },timeZone:timeZone.utc
            }
        }

        //run once
        if(_.scheduleOption == scheduleOption.RunOnce){
            schedule.recurringOptions = null
        }

        //recurring
        if(_.scheduleOption == scheduleOption.Recurring){
            schedule.runOnceOptions = null
            //recurring days interval
            // if(_.recurringOptionDaysOption == recurringOptionDaysOption.DaysInterval){
            //     //recurring 
            //     if(schedule.recurringOptions?.days != null){
            //         schedule.recurringOptions.days.daysOfMonth = [];
            //         schedule.recurringOptions.days.daysOfWeek = [];
            //         schedule.recurringOptions.days.lastDayOfMonth = false;
            //     }
                
            //     if(_.recurringOptionTimeOptionTime == recurringOptionTimeOptionTime.timeInterval){
            //         if(schedule.recurringOptions?.times != null){
            //             schedule.recurringOptions.times.hourlyMinutes = null;
            //             schedule.recurringOptions.times.timeOfDay = null;
            //         }
            //     }

            //     if(_.recurringOptionTimeOptionTime == recurringOptionTimeOptionTime.timeInterval){
            //         if(schedule.recurringOptions?.times?.timeIntervalUnit != null){
            //             schedule.recurringOptions.times.hourlyMinutes = null;
            //             schedule.recurringOptions.times.timeOfDay = null;
            //         }
            //     }
            // }

        }
        
        console.log("Schedule Object Constructed: ", schedule);
        return schedule
    }
    catch(error){
        console.log("ERROR:", error);
    }
    return null;
}

function splitStringToDate(input:string):IDate | null{
    let arr = input.split("-");
    if (arr.length != 3)
        return null;
    let date:IDate = {
        month:arr[0],
        day: arr[1],
        year: arr[2]
    }
    return date;
}

function removeNonNumbersFromArray(array:Array<any>){
    array.filter(function(currentItem, index, array){
        if(isNaN(currentItem)){
            array.splice(index,1);
        }
    });
    return array;
}

function processDaysInputToArray(days:string):Array<number>{
    try{
        let daysArray = days.split(",");
        let numbersOnly = removeNonNumbersFromArray(daysArray);
        let array = JSON.parse("[" + numbersOnly + "]");
        array = removeItemFromArray("last", array);
        array = removeItemFromArray("Last", array);
        return array
    }
    catch(error){
        console.log("ERROR:", error);
    }
    return new Array<number>();
}

function convertToDaysOfWeek(weekDaysIntArray:Array<number>):Array<string>{
    let weekdays:Array<string> = [];
    weekDaysIntArray.forEach((currentItem, index) => {
        weekdays.push(daysOfWeekArray[currentItem]);
    });
    console.log("INFO: WeekDays ", weekdays);
    return weekdays
}

function removeItemFromArray(item:any, array:Array<any>):Array<any>{
    array.forEach( (currentItem, index) => {
      if(currentItem === item) array.splice(index,1);
    });
    return array;
 }

function validateTimeInput(input:string):boolean{
    let expression = new RegExp("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$");
    return expression.test(input)
 }

function processTimeInput(input:string):string | null{
    let split = input.split(":");
    if(validateTimeInput(input)){
        let time:Itime = {
            hour: split[0],
            minute: split[1]
        }
        return time.hour + ":" + time.minute;
    }
    return null;
}

interface Itime {
    hour:string,
    minute:string
}

interface IDate {
    day:string,
    month:string,
    year:string
}

enum scheduleOption {
    NoAction = "NoAction",
    OnDemand = "OnDemand",
    RunOnce = "RunOnce",
    Recurring = "Recurring"
}

enum timeIntervalUnit {
    minutes = "minutes",
    hours = "hours"
}

enum recurringOptionTimeOptionTime {
    timeInterval = "timeInterval",
    timeOfDay = "timeOfDay",
    hourlyMinutes = "hourlyMinutes"
}

enum recurringOptionDaysOption {
    DaysInterval = "daysInterval",
    DaysOfWeek = "daysOfWeek",
    DaysOfMonth = "daysOfMonth"
}

enum timeOption {
    TimeOfDay = "timeOfDay",
    TimeInterval = "timeInterval"
}

enum daysOfWeek {
    Sunday = "Sunday",
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
    Saturday = "Saturday",
}

let daysOfWeekArray:Array<string> = ["None","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

enum timeZone {
    utc = "Coordinated Universal Time"
}

//reference: https://dev.scribesoft.com/en/main/reference/solutions.htm
interface ISchedule {
    scheduleOption: string,
    solutionId:string,
    runOnceOptions:null | {
        dateTime:string
    },
    recurringOptions:null | {
        days: null | {
            daysOption:string | null,
            daysIntervalStartDate:string | null,
            daysInterval:number | null,
            daysOfMonth: Array<number>,
            daysOfWeek:Array<string>,
            lastDayOfMonth:boolean
        },times: null | {
            timeOption:string | null,
            hourlyMinutes:number | null,
            timeOfDay:string | null,
            timeInterval:number | null,
            timeIntervalUnit:string | null
        },timeZone:string
    }
}

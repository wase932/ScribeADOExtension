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
const _ = __importStar(require("./index"));
const tl = require("azure-pipelines-task-lib/task");
const uerror = __importStar(require("./utility/error"));
async function addSchedule(schedule) {
    console.log("Info: Starting schedule tasks...");
    try {
        if (schedule == null || schedule == undefined) {
            console.log(`INFO: The schedule object is empty. No further action will be taken...`);
            return true;
        }
        console.log(`INFO: Updating Schedule for solution: ${_.solutionName}...`);
        console.log("INFO: Schedule configuration to be applied is:", schedule);
        const uri = _.scribe_baseUrl + "/" + _.scribe_organizationId + "/solutions/" + schedule.solutionId + "/schedule";
        const response = await axios({
            method: "PUT",
            url: uri,
            auth: {
                username: _.scribe_user,
                password: _.scribe_password
            },
            data: schedule
        });
        console.log("RESPONSE DATA:", response.data);
        return response.data;
    }
    catch (error) {
        uerror.CatchAxiosError(error);
        tl.setResult(tl.TaskResult.Failed, error);
        process.exit(1);
    }
    ;
}
exports.addSchedule = addSchedule;
function ConstructScheduleObject(solutionId) {
    try {
        //no action
        if (_.scheduleOption == scheduleOption.NoAction) {
            console.log("INFO: There will be no action taken on the solutions's schedule");
            return null;
        }
        //on demand
        if (_.scheduleOption == scheduleOption.OnDemand) {
            let schedule = {
                scheduleOption: scheduleOption.OnDemand,
                solutionId: solutionId,
                recurringOptions: null,
                runOnceOptions: null
            };
            return schedule;
        }
        let schedule = {
            scheduleOption: _.scheduleOption,
            solutionId: solutionId,
            runOnceOptions: {
                dateTime: function () { let d = splitStringToDate(_.runOnceOptionDate); return `${d === null || d === void 0 ? void 0 : d.year}-${d === null || d === void 0 ? void 0 : d.month}-${d === null || d === void 0 ? void 0 : d.day}T${_.runOnceOptionTime}Z`; }()
            },
            recurringOptions: {
                days: {
                    daysOption: (() => { return _.recurringOptionDaysOption == 'undefined' ? null : _.recurringOptionDaysOption; })(),
                    daysIntervalStartDate: (() => { let d = splitStringToDate(_.recurringOptionDaysIntervalStartDate); return `${d === null || d === void 0 ? void 0 : d.year}-${d === null || d === void 0 ? void 0 : d.month}-${d === null || d === void 0 ? void 0 : d.day}`; })(),
                    daysInterval: _.recurringOptionDaysInterval || null,
                    daysOfMonth: (() => { if (_.recurringOptionDaysOption == recurringOptionDaysOption.DaysOfMonth)
                        return processDaysInputToArray(_.recurringOptionDaysOfMonth); return []; })(),
                    daysOfWeek: (() => { if (_.recurringOptionDaysOption == recurringOptionDaysOption.DaysOfWeek)
                        return convertToDaysOfWeek(processDaysInputToArray(_.recurringOptionDaysOfWeek)); return []; })(),
                    lastDayOfMonth: function () { if (_.recurringOptionDaysOfMonth.indexOf("last") > -1) {
                        return true;
                    } return false; }()
                }, times: {
                    timeOption: _.recurringOptionTimeOptionTime,
                    hourlyMinutes: (() => { if (_.recurringOptionTimeOptionTime != timeIntervalUnit.hours && _.recurringOptionTimeOptionTime != timeIntervalUnit.minutes)
                        return _.recurringOptionTimeOptionMinutesAfterTheHour; return null; })(),
                    timeOfDay: processTimeInput(_.recurringOptionTime) || null,
                    timeInterval: (() => { if (_.timeIntervalUnit == timeIntervalUnit.hours) {
                        return _.recurringOptionTimeOptionHours;
                    } if (_.timeIntervalUnit == timeIntervalUnit.minutes)
                        return _.recurringOptionTimeOptionMinutes; return null; })(),
                    timeIntervalUnit: function () { if (_.timeIntervalUnit == timeIntervalUnit.hours)
                        return timeIntervalUnit.hours; if (_.timeIntervalUnit == timeIntervalUnit.minutes)
                        return timeIntervalUnit.minutes; return null; }()
                }, timeZone: timeZone.utc
            }
        };
        //run once
        if (_.scheduleOption == scheduleOption.RunOnce) {
            schedule.recurringOptions = null;
        }
        //recurring
        if (_.scheduleOption == scheduleOption.Recurring) {
            schedule.runOnceOptions = null;
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
        return schedule;
    }
    catch (error) {
        console.log("ERROR:", error);
    }
    return null;
}
exports.ConstructScheduleObject = ConstructScheduleObject;
function splitStringToDate(input) {
    let arr = input.split("-");
    if (arr.length != 3)
        return null;
    let date = {
        month: arr[0],
        day: arr[1],
        year: arr[2]
    };
    return date;
}
function removeNonNumbersFromArray(array) {
    array.filter(function (currentItem, index, array) {
        if (isNaN(currentItem)) {
            array.splice(index, 1);
        }
    });
    return array;
}
function processDaysInputToArray(days) {
    try {
        let daysArray = days.split(",");
        let numbersOnly = removeNonNumbersFromArray(daysArray);
        let array = JSON.parse("[" + numbersOnly + "]");
        array = removeItemFromArray("last", array);
        array = removeItemFromArray("Last", array);
        return array;
    }
    catch (error) {
        console.log("ERROR:", error);
    }
    return new Array();
}
function convertToDaysOfWeek(weekDaysIntArray) {
    let weekdays = [];
    weekDaysIntArray.forEach((currentItem, index) => {
        weekdays.push(daysOfWeekArray[currentItem]);
    });
    console.log("INFO: WeekDays ", weekdays);
    return weekdays;
}
function removeItemFromArray(item, array) {
    array.forEach((currentItem, index) => {
        if (currentItem === item)
            array.splice(index, 1);
    });
    return array;
}
function validateTimeInput(input) {
    let expression = new RegExp("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$");
    return expression.test(input);
}
function processTimeInput(input) {
    let split = input.split(":");
    if (validateTimeInput(input)) {
        let time = {
            hour: split[0],
            minute: split[1]
        };
        return time.hour + ":" + time.minute;
    }
    return null;
}
var scheduleOption;
(function (scheduleOption) {
    scheduleOption["NoAction"] = "NoAction";
    scheduleOption["OnDemand"] = "OnDemand";
    scheduleOption["RunOnce"] = "RunOnce";
    scheduleOption["Recurring"] = "Recurring";
})(scheduleOption || (scheduleOption = {}));
var timeIntervalUnit;
(function (timeIntervalUnit) {
    timeIntervalUnit["minutes"] = "minutes";
    timeIntervalUnit["hours"] = "hours";
})(timeIntervalUnit || (timeIntervalUnit = {}));
var recurringOptionTimeOptionTime;
(function (recurringOptionTimeOptionTime) {
    recurringOptionTimeOptionTime["timeInterval"] = "timeInterval";
    recurringOptionTimeOptionTime["timeOfDay"] = "timeOfDay";
    recurringOptionTimeOptionTime["hourlyMinutes"] = "hourlyMinutes";
})(recurringOptionTimeOptionTime || (recurringOptionTimeOptionTime = {}));
var recurringOptionDaysOption;
(function (recurringOptionDaysOption) {
    recurringOptionDaysOption["DaysInterval"] = "daysInterval";
    recurringOptionDaysOption["DaysOfWeek"] = "daysOfWeek";
    recurringOptionDaysOption["DaysOfMonth"] = "daysOfMonth";
})(recurringOptionDaysOption || (recurringOptionDaysOption = {}));
var timeOption;
(function (timeOption) {
    timeOption["TimeOfDay"] = "timeOfDay";
    timeOption["TimeInterval"] = "timeInterval";
})(timeOption || (timeOption = {}));
var daysOfWeek;
(function (daysOfWeek) {
    daysOfWeek["Sunday"] = "Sunday";
    daysOfWeek["Monday"] = "Monday";
    daysOfWeek["Tuesday"] = "Tuesday";
    daysOfWeek["Wednesday"] = "Wednesday";
    daysOfWeek["Thursday"] = "Thursday";
    daysOfWeek["Friday"] = "Friday";
    daysOfWeek["Saturday"] = "Saturday";
})(daysOfWeek || (daysOfWeek = {}));
let daysOfWeekArray = ["None", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var timeZone;
(function (timeZone) {
    timeZone["utc"] = "Coordinated Universal Time";
})(timeZone || (timeZone = {}));

"use strict";
// let main = [
//     'account',
//     'accountleads',
//     'aciviewmapper',
//     'actioncard',
//     'actioncardusersettings',
//     'actioncarduserstate',
//     'activitymimeattachment',
//     'activityparty',
//     'activitypointer',
//     'advancedsimilarityrule',
//     'adx_accesscontrolrule_publishingstate',
//     'adx_accountcontentaccesslevel'
// ]
// let subset = [
//     'account',
//     'accountleads',
//     'aciviewmapper'
// ]
// let checkEntityList = (main:Array<string>, target:Array<string>) => target.every(v => main.includes(v));
// let result = checkEntityList(main, subset);
// console.log(result);
/***
let sleep = (ms:number) => new Promise((r, j)=>setTimeout(r, ms));

async function func1():Promise<number>{
    console.log("STARTED: ONE...");
    await sleep(10000);
    console.log("COMPLETED: ONE");
    return 1;
}

async function func2(num: number):Promise<number>{
    console.log("STARTED: TWO...");
    sleep(3000);
    console.log("COMPLETED: TWO");
    return num;
}

async function func3():Promise<number>{
    console.log("STARTED: THREE...");
    let one = await func1();

    while(one != 1){
        sleep(1000);
    }

    let two = await func2(one);
    // if(two != 1){
    //     console.log("Calling 2 Again...");

    // }

    if( one == 1 && two == one){
        console.log("completed function three: Result = " + 3);
        return 3
    }
    console.log("completed function three: Result = " + 0);
    return 0;
}

let x = func3().then((x) => {
    console.log("FINAL RESULT ",x);
});

***/ 

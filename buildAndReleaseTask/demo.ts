
let sleep = (ms:number) => new Promise((r, j)=>setTimeout(r, ms));


// console.log("begin");
// step1();
// step2();
// console.log("all steps started");

// // ----------------------------------------------

// async function step1() {

// console.log("starting step 1");
// await sleep(10000);
// console.log("step 1 handled");
// } // step1()

// // ----------------------------------------------

// async function step2() {

// console.log("starting step 2");
// await sleep(5000);
// console.log("step 2 handled");
// } // step2()


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
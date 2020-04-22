export let compareArrays = (main:Array<string>, subset:Array<string>) => subset.every(v => main.includes(v));

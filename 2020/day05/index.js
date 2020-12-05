const readFile = require("../utils/readfile.js");

readFile("./input.txt", run);

function run(data) {
    const lines = data.replace(/(?:\\[r]|[\r]+)+/g, "").split("\n");

    part1(lines);
    part2(lines);
}

function part1(lines) {
    let highest = 0;
    for (let line of lines) {
        const b = line.replace(/[BR]/g, "1").replace(/[FL]/g, "0");
        const n = parseInt(b, 2);
        if (n > highest) {
            highest = n;
        }
    }

    console.log(highest);
}

function part2(lines) {
    let highest = 0;
    let lowest = Number.MAX_SAFE_INTEGER;
    let sum = 0;
    for (let line of lines) {
        const b = line.replace(/[BR]/g, "1").replace(/[FL]/g, "0");
        const n = parseInt(b, 2);

        if (n > highest) highest = n;
        if (n < lowest) lowest = n;
        sum += n;
    }

    console.log(((lines.length + 1) / 2) * (lowest + highest) - sum);
}

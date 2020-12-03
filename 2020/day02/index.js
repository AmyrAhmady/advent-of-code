const readFile = require('../utils/readfile.js');

readFile('./input.txt', run);

function run(data) {
    const lines =
        data.replace(/(?:\\[r]|[\r]+)+/g, '')
            .split('\n');

    part1(lines);
    part2(lines);
}

function part1(lines) {
    let valid = 0;

    for (const line of lines) {

        let [range, letter, password] = line.split(" ");
        letter = letter.replace(/.$/, "");
        let notLetter = new RegExp(`[^${letter}]`, "g");

        password = password.replace(notLetter, "");

        let checkLength = new RegExp(`^.{${range.replace("-", ",")}}$`, "g");

        if (password.match(checkLength)) {
            valid++;
        }
    }

    console.log(valid);
}

function part2(lines) {
    let valid = 0;

    for (const line of lines) {
        let [range, letter, password] = line.split(" ");

        letter = letter.replace(/.$/, "");

        [start, end] = range.split("-");

        if ((password[start - 1] == letter) ^ (password[end - 1] == letter)) {
            valid++;
        }
    }

    console.log(valid);
}
const readFile = require('../utils/readfile.js');

readFile('./input.txt', run);

function run(data) {
    const numbers =
        data.replace(/(?:\\[r]|[\r]+)+/g, '')
            .split('\n')
            .map(number => parseInt(number));

    part1(numbers);
    part2(numbers);
}

function part1(numbers) {
    numbers.every((number) => {
        let sub = 2020 - number;
        if (numbers.includes(sub)) {
            console.log(number * sub);
            return false;
        }
        else return true;
    });
}

function part2(numbers) {
    numbers.sort((a, b) => a - b);

    for (let currIndex = 0; currIndex < numbers.length - 2; currIndex++) {
        const curr = numbers[currIndex];

        let nextIndex = currIndex + 1;
        let lastIndex = numbers.length - 1;

        while (nextIndex < lastIndex) {
            const next = numbers[nextIndex];
            const last = numbers[lastIndex];

            const sum = curr + next + last;
            if (sum == 2020) {
                currIndex = numbers.length;
                console.log(curr * next * last);
                break;
            }

            if (sum <= 2020) {
                while (numbers[nextIndex - 1] == last) { nextIndex++; }
                nextIndex++;
            }

            if (sum >= 2020) {
                while (numbers[lastIndex - 1] == last) { lastIndex--; }
                lastIndex--;
            }
        }
    }
}
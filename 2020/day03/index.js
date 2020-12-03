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
    let currentPos = 0, treeInTheWay = 0;

    lines.forEach(line => {
        const cols = line.split('');
        if (cols[currentPos % 31] === '#') {
            treeInTheWay++;
        }
        currentPos += 3;
    });

    console.log(treeInTheWay);
}

function part2(lines) {
    const targetSlopes = [[1, 1], [3, 1], [5, 1], [7, 1], [1, 2]];

    let result = targetSlopes.map(slope => {
        let currentPos = 0, treeInTheWay = 0;
        lines.forEach((line, index) => {
            if (!(index % slope[1])) {
                const cols = line.split('');
                if (cols[currentPos % 31] === '#') {
                    treeInTheWay++;
                }
                currentPos += slope[0];
            }
        });
        return treeInTheWay;
    })
        .reduce((a, b) => a * b);

    console.log(result);
}
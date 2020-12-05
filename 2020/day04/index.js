const readFile = require('../utils/readfile.js');

readFile('./input.txt', run);

function run(data) {
    const lines =
        data.replace(/(?:\\[r]|[\r]+)+/g, '')
            .split('\n\n');

    part1(lines);
    part2(lines);
}

const searchStrings = ['byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid'];

let validation = {
    byr: { params: { regex: new RegExp('^\\d{4}$'), min: 1920, max: 2002 } },
    iyr: { params: { regex: new RegExp('^\\d{4}$'), min: 2010, max: 2020 } },
    eyr: { params: { regex: new RegExp('^\\d{4}$'), min: 2020, max: 2030 } },
    hgt: { params: { regex: new RegExp('^[0-9]+(cm|in)$'), mincm: 150, maxcm: 193, minin: 59, maxin: 76 } },
    ecl: { params: { regex: new RegExp('^(amb|blu|brn|gry|grn|hzl|oth){1}$', 'g') } },
    hcl: { params: { regex: new RegExp('^#[0-9A-Fa-f]{6}$', 'g') } },
    pid: { params: { regex: new RegExp('^\\d{9}$') } },
    cid: { params: { regex: new RegExp('') } }
};


const objectify = (data) => {
    let objdata = [];
    data.forEach(item => {
        item = item.map(elm => {
            let [key, value] = elm.split(':');
            let obj = {}
            obj[key] = value;
            return obj;
        })
        objdata.push(item);
    })
    return objdata;
}

const yr = (year, params) => {
    const { regex, min, max } = params;
    if (year.match(regex) && Number(year) >= min && Number(year) <= max) return true;
    return false
}

const height = (h, params) => {
    const { regex, mincm, maxcm, minin, maxin } = params;
    const unit = h.slice(-2);
    const height = Number(h.slice(0, -2));
    if (h.match(regex)) {
        if (unit === "cm" && height >= mincm && height <= maxcm) {
            return true;
        }

        if (unit === "in" && height >= minin && height <= maxin) {
            return true;
        }
    }
    return false
}

const general = (val, params) => {
    const { regex } = params;
    if (val.match(regex)) {
        return true;
    }
    return false;
}

const checkCases = (item) => {
    switch (item) {
        case 'byr':
            return (year, params) => yr(year, params)
        case 'iyr':
            return (year, params) => yr(year, params)
        case 'eyr':
            return (year, params) => yr(year, params)
        case 'hgt':
            return (hgt, params) => height(hgt, params)
        case 'cid':
            return (...any) => true
        default:
            return (val, params) => general(val, params)
    }
}

function part1(data) {
    let answers = [];
    let goodData = [];
    answers = data.map(item => {
        let answer = []
        answer = searchStrings.map(element => {
            return item.includes(`${element}:`)
        });
        if (!(answer.includes(false))) {
            goodData.push(item);
        }
        return !(answer.includes(false));
    });

    console.log(answers.filter(elm => elm).length)
}

function part2(data) {
    // from part1
    let answers = [];
    let goodData = [];
    answers = data.map(item => {
        let answer = []
        answer = searchStrings.map(element => {
            return item.includes(`${element}:`)
        });
        if (!(answer.includes(false))) {
            goodData.push(item);
        }
        return !(answer.includes(false));
    });
    //////////////////////////

    const odata = objectify(goodData.map(item => item.split(/\n| /)));
    let results = [];
    results = odata.map(item => {
        let ans = [];
        ans = item.map(elm => {
            let answer = []
            let [key] = Object.keys(elm);
            let value = elm[key];
            answer.push(checkCases(key)(value, validation[key].params));
            return !(answer.includes(false));
        })
        return (ans);
    });

    let filtered = results.map(arr => arr.reduce((acc, curr) => acc && curr)).filter(item => item);

    console.log(filtered.length);

}
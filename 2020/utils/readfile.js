fs = require('fs');

function readFlie(path, cb) {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            return console.log(err);
        }
        cb(data);
    });
}

module.exports = readFlie;
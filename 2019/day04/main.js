let doubleCount = 0;
let doubleOnlyCount = 0;

for (let i = 123257; i <= 647015; i++) {
    let password = i.toString();
    let double = false;
    let doubleOnly = false;
    let flag = false;
    for (let pos = 1; pos < password.length; pos++) {
        if (password[pos] === password[pos - 1]) {

            double = true;
            if (password[pos + 1] !== password[pos])
                if (password[pos - 2] !== password[pos])
                    doubleOnly = true;
        }
        if (parseInt(password[pos]) < parseInt(password[pos - 1]))
            flag = true;
    }

    if (double && !flag)
        doubleCount++;

    if (doubleOnly && !flag)
        doubleOnlyCount++;
}
console.log(doubleCount);
console.log(doubleOnlyCount);
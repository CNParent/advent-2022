scripts.day25_1 = async () => {
    /** @type {string} */ 
    const data = (await getFile('day25/input.txt'));
    const digits = [
        { key: '2', value: 2 },
        { key: '1', value: 1 },
        { key: '0', value: 0 },
        { key: '-', value: -1 },
        { key: '=', value: -2 }
    ];



    let toSnafu = (decimal = 0) => {
        let snafu = ['2'];
        while (fromSnafuArray(snafu) < decimal) snafu.push('2');

        for (let i = 0; i < snafu.length; i++) {
            for (let j = 0; j < digits.length - 1; j++) {
                if (j + 1 == digits.length) continue;

                snafu[i] = digits[j + 1].key;
                if (fromSnafuArray(snafu) < decimal) {
                    snafu[i] = digits[j].key;
                    break;
                }
            }
        }

        return snafu.reduce((a,b) => a + b, '');
    };

    let fromSnafuArray = (snafu = ['']) => fromSnafu(snafu.reduce((a,b) => a + b, ''));

    let fromSnafu = (snafu = '') => {
        let decimal = 0;
        for (let i = snafu.length - 1; i >= 0; i--) {
            let power = snafu.length - i - 1;
            let c = snafu.charAt(i);
            let val = digits.find(d => d.key == c).value;
            decimal += val * Math.pow(5, power);
        }

        return decimal;
    };

    let decimals = data.split('\r\n').map(snafu => fromSnafu(snafu));
    let sum = decimals.reduce((a,b) => a + b, 0);
    terminal.textContent = `Sum is ${sum} (${toSnafu(sum)} in snafu)`;
}
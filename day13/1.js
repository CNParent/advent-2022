scripts.day13_1 = async () => {
    const result = {
        continue: 'continue',
        right: 'right',
        wrong: 'wrong'
    };

    /** @type {string} */ 
    let data = (await getFile('day13/input.txt'));
    let pairs = data.split('\r\n\r\n').map(x => {
        let values = x.split('\r\n');
        return {
            l: JSON.parse(`{ "value": ${values[0]} }`).value,
            r: JSON.parse(`{ "value": ${values[1]} }`).value
        };
    });

    let compare = (a, b) => {
        if (typeof(a) == 'number' && typeof(b) == 'number') {
            if (a < b) return result.right;
            if (b < a) return result.wrong;
            return result.continue;
        }

        if (typeof(a) == 'number') a = [a];
        if (typeof(b) == 'number') b = [b];

        for (let i = 0; i < a.length; i++) {
            if (i >= b.length) return result.wrong;

            let r = compare(a[i], b[i]);
            if (r != result.continue) return r;
        }

        if (a.length < b.length) return result.right;

        return result.continue;
    };

    let results = pairs.map(p => ({ pair: p, order: compare(p.l, p.r) }));
    let indexSum = results.map((v, i) => v.order != result.wrong ? i + 1 : 0).reduce((a,b) => a + b, 0);
    terminal.textContent = `Pairs in correct order: ${indexSum}`;
}
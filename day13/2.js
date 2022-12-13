scripts.day13_2 = async () => {
    const result = {
        continue: 2,
        right: 0,
        wrong: 1
    };

    /** @type {string} */ 
    let data = (await getFile('day13/input.txt'));
    let packets = data.split('\r\n').filter(x => x).map(x => JSON.parse(`{ "value": ${x} }`).value);

    let dividers = [[[2]],[[6]]];
    packets.push(dividers[0]);
    packets.push(dividers[1]);

    let compare = (a, b) => {
        let r = compareElements(a,b);
        if (r == result.continue) r = result.right;

        return r;
    }

    let compareElements = (a, b) => {
        if (typeof(a) == 'number' && typeof(b) == 'number') {
            if (a < b) return result.right;
            if (b < a) return result.wrong;
            return result.continue;
        }

        if (typeof(a) == 'number') a = [a];
        if (typeof(b) == 'number') b = [b];

        for (let i = 0; i < a.length; i++) {
            if (i >= b.length) return result.wrong;

            let r = compareElements(a[i], b[i]);
            if (r != result.continue) return r;
        }

        if (a.length < b.length) return result.right;

        return result.continue;
    };

    packets.sort(compare);

    let d1 = packets.indexOf(dividers[0]);
    let d2 = packets.indexOf(dividers[1]);
    terminal.textContent = `Decoder key is: ${d1 + 1} x ${d2 + 1} = ${(d1 + 1) * (d2 + 1)}`;
}
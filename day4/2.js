scripts.day4_2 = async () => {
    let data = await getFile('day4/input.txt');
    let pairs = data.split('\r\n').map(x => x.split(',').map(y => y.split('-'))).map(x => {
        return {
            a: { min: Number(x[0][0]), max: Number(x[0][1]) },
            b: { min: Number(x[1][0]), max: Number(x[1][1]) }
        }
    });

    let overlapping = pairs.filter(pair => {
        let a = pair.a;
        let b = pair.b;

        if (a.min > b.max || a.max < b.min) return false;

        return true;
    });

    terminal.textContent = `There are ${overlapping.length} pairs with overlapping ids`;
}
scripts.day3_1 = async () => {
    const items = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let data = await getFile('day3/input.txt');
    let sacks = data.split('\r\n').map(x => {
        return {
            a: x.slice(0, x.length / 2).split(''),
            b: x.slice(x.length / 2).split('')
        }
    });

    let total = 0;
    sacks.forEach(sack => {
        let dup = sack.a.find(x => sack.b.includes(x));
        total += items.indexOf(dup) + 1;
    });

    terminal.textContent = `Sum of all priorities is ${total}`;
}
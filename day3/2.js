scripts.day3_2 = async () => {
    const items = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let data = await getFile('day3/input.txt');
    let sacks = data.split('\r\n').map(x => x.split(''));
    let total = 0;
    for(i = 0; i < sacks.length; i += 3) {
        let badge = sacks[i].find(x => sacks[i + 1].includes(x) && sacks[i+2].includes(x));
        total += items.indexOf(badge) + 1;
    }

    terminal.textContent = `Sum of all priorities is ${total}`;
}
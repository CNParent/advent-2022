scripts.day1_2 = async () => {
    let data = await getFile('day1/input.txt');
    let elves = data.split('\r\n\r\n').map(x => x.split('\r\n').map(c => Number(c)));
    let totals = elves.map(x => x.reduce((a,b) => a + b, 0));
    totals.sort();
    let topThree = totals.slice(totals.length - 3);
    let sum = topThree.reduce((a,b) => a + b, 0);
    terminal.textContent = `The three elves with the most calories are carrying ${sum}`;
}
scripts.day1_1 = async () => {
    let data = await getFile('day1/day1_1_input.txt');
    let elves = data.split('\r\n\r\n').map(x => x.split('\r\n').map(c => Number(c)));
    let max = Math.max(...elves.map(x => x.reduce((a,b) => a + b, 0)));
    terminal.textContent = `The elf with the most calories has ${max}`;
}
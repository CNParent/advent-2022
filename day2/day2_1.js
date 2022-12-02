scripts.day2_1 = async () => {
    let data = await getFile('day2/input.txt');
    const cases = {
        'A X': 4,
        'A Y': 8,
        'A Z': 3,
        'B X': 1,
        'B Y': 5,
        'B Z': 9,
        'C X': 7,
        'C Y': 2,
        'C Z': 6
    };

    let rounds = data.split('\r\n');
    let scores = rounds.map(x => cases[x]);
    let total = scores.reduce((a,b) => a + b, 0);
    terminal.textContent = `Following the guide, your score will be ${total}`;
}
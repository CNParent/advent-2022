scripts.day2_2 = async () => {
    let data = await getFile('day2/input.txt');
    const cases = {
        'A X': 3,
        'A Y': 4,
        'A Z': 8,
        'B X': 1,
        'B Y': 5,
        'B Z': 9,
        'C X': 2,
        'C Y': 6,
        'C Z': 7
    };

    let rounds = data.split('\r\n');
    let scores = rounds.map(x => cases[x]);
    let total = scores.reduce((a,b) => a + b, 0);
    terminal.textContent = `Following the guide, your score will be ${total}`;
}
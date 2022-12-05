scripts.day5_2 = async () => {
    let data = (await getFile('day5/input.txt')).split('\r\n\r\n');
    
    let stackInfo = data[0].split('\r\n').map(x => x.split(''));
    let stacks = [];
    let cols = Math.ceil(stackInfo[stackInfo.length - 1].length);
    for(let j = 1; j < cols; j += 4) {
        let stack = [];
        stacks.push(stack);
        for(let i = stackInfo.length - 2; i >= 0; i--) {
            if (stackInfo[i][j] != ' ')
                stack.push(stackInfo[i][j]);
        }
    }

    let instructions = data[1].split('\r\n').map(x => {
        let values = x.split(' ');
        return {
            quantity: Number(values[1]),
            from: Number(values[3]),
            to: Number(values[5])
        };
    });

    let exec = (instruction) => {
        console.info(`Moving ${instruction.quantity} crates from ${instruction.from} to ${instruction.to}`);
        let from = stacks[instruction.from - 1];
        let to = stacks[instruction.to - 1];
        let crates = from.splice(from.length - instruction.quantity, instruction.quantity);
        crates.forEach(c => to.push(c));
    };

    instructions.forEach(x => exec(x));
    let answer = stacks.reduce((a,b) => `${a}${b[b.length - 1]}`, '');

    terminal.textContent = `The crates at the top of each stack are: ${answer}`;
}
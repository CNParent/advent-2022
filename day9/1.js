scripts.day9_1 = async () => {
    /** @type {string} */ 
    let data = (await getFile('day9/input.txt'));
    let positions = new Set();
    let instructions = data.split('\r\n').map(x => {
        let values = x.split(' ');
        return {
            direction: values[0],
            magnitude: Number(values[1])
        };
    });

    let position = { head: { x: 0, y: 0 }, tail: { x: 0, y: 0 } };
    positions.add(`0,0`);

    let drag = (a, b) => {
        let dx = position.head.x - position.tail.x;
        let dy = position.head.y - position.tail.y;

        if (Math.abs(dx) == 2) {
            position.tail.x += dx > 0 ? 1 : -1;
            position.tail.y = position.head.y;
        }
        else if (Math.abs(dy) == 2) {
            position.tail.y += dy > 0 ? 1 : -1;
            position.tail.x = position.head.x;
        }
    };

    instructions.forEach(instruction => {
        for(let i = 0; i < instruction.magnitude; i++) {
            if (instruction.direction == 'U') position.head.y++;
            else if (instruction.direction == 'D') position.head.y--;
            else if (instruction.direction == 'L') position.head.x--;
            else if (instruction.direction == 'R') position.head.x++;

            drag(position.head, position.tail);
            positions.add(`${position.tail.x},${position.tail.y}`);
        }
    });

    terminal.textContent = `The tail occupied ${positions.size} unique positions`;
}
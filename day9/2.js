scripts.day9_2 = async () => {
    const tailLength = 10;

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

    let knots = [...new Array(tailLength)].map(() => { return { x: 0, y: 0 }; });
    let head = knots[0];
    let tail = knots[knots.length - 1];

    let drag = (a = { x: 0, y: 0}, b = { x: 0, y: 0 }) => {
        let dx = a.x - b.x;
        let dy = a.y - b.y;

        if (Math.abs(dx) == 2 && Math.abs(dy) == 2) {
            b.x += dx / Math.abs(dx);
            b.y += dy / Math.abs(dy);
        }
        else if (Math.abs(dx) == 2) {
            b.x += dx / Math.abs(dx);
            b.y = a.y;
        }
        else if (Math.abs(dy) == 2) {
            b.y += dy / Math.abs(dy);
            b.x = a.x;
        }
    };

    instructions.forEach(instruction => {
        for(let i = 0; i < instruction.magnitude; i++) {
            if (instruction.direction == 'U') head.y++;
            else if (instruction.direction == 'D') head.y--;
            else if (instruction.direction == 'L') head.x--;
            else if (instruction.direction == 'R') head.x++;

            console.log(`Step ${i+1} of ${instruction.direction} ${instruction.magnitude}`)
            for(let j = 1; j < knots.length; j++) {
                drag(knots[j - 1], knots[j]);
                console.log(`Drag follower ${j} to ${knots[j].x},${knots[j].y}`)
            }

            positions.add(`${tail.x},${tail.y}`);
        }
    });

    terminal.textContent = `The tail occupied ${positions.size} unique positions`;
}
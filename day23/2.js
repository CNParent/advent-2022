scripts.day23_2 = async () => {
    /** @type {string} */ 
    const data = (await getFile('day23/input.txt'));
    const directions = [
        [ 0,-1],
        [ 0, 1],
        [-1, 0],
        [ 1, 0]
    ]

    let directionIndex = 0;
    let elves = new Set();
    data.split('\r\n').forEach((x,j) => {
        x.split('').forEach((y,i) => {
            if (y == '#') elves.add(`${i},${j}`)
        });
    });

    let neighbours = (p) => {
        for (let j = -1; j <= 1; j++) {
            for (let i = -1; i <= 1; i++) {
                if (i == 0 && j == 0) continue;

                if (elves.has(`${p[0] + i},${p[1] + j}`))
                    return true;
            }
        }

        return false;
    }

    let consider = (direction, p) => {
        let axisIndex = direction[0] == 0 ? 0 : 1;
        for (let i = -1; i <= 1; i++) {
            let position = [...p];
            position[0] += direction[0];
            position[1] += direction[1];
            position[axisIndex] += i;
            if (elves.has(`${position[0]},${position[1]}`)) {
                return false;
            }
        }

        return true;
    }

    let round = () => {
        let moves = [];
        elves.forEach(e => {
            let p = e.split(',').map(x => Number(x));
            if (!neighbours(p)) return;

            for (let i = 0; i < directions.length; i++) {
                let d = directions[(directionIndex + i) % directions.length];
                if (consider(d, p)) {
                    let proposal = `${p[0] + d[0]},${p[1] + d[1]}`;
                    moves.push({ proposal, elf: e });
                    break;
                }
            }
        });

        let moved = 0;
        moves.forEach(move => {
            if (moves.find(other => other != move && move.proposal == other.proposal)) 
                return;

            elves.delete(move.elf);
            elves.add(move.proposal);
            moved++;
        });

        directionIndex = (directionIndex + 1) % directions.length;

        return moved;
    };

    let roundNum = 0;
    while(true) {
        roundNum++;
        let moved = round();
        if (moved == 0) break;

        console.log(`${moved} movements on round ${roundNum}`);
    }

    let positions = [];
    elves.forEach(e => positions.push(e.split(',').map(x => Number(x))));

    let minX = Math.min(...positions.map(p => p[0]));
    let maxX = Math.max(...positions.map(p => p[0]));
    let minY = Math.min(...positions.map(p => p[1]));
    let maxY = Math.max(...positions.map(p => p[1]));

    let area = (maxX - minX + 1) * (maxY - minY + 1) - elves.size;
    terminal.textContent = `Total area after ${roundNum} rounds is ${area}`;
}
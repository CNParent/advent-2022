scripts.day23_1 = async () => {
    /** @type {string} */ 
    const data = (await getFile('day23/input.txt'));
    const roundNum = 10;
    const directions = [
        [ 0,-1],
        [ 0, 1],
        [-1, 0],
        [ 1, 0]
    ]

    let directionIndex = 0;
    let elves = [];
    data.split('\r\n').forEach((x,j) => {
        x.split('').forEach((y,i) => {
            if (y == '#') elves.push({ position: [i, j] });
        });
    });

    let neighbours = (elf) => {
        for (let j = -1; j <= 1; j++) {
            for (let i = -1; i <= 1; i++) {
                if (elves.find(e => e != elf && e.position[0] == elf.position[0] + i && e.position[1] == elf.position[1] + j))
                    return true;
            }
        }

        return false;
    }

    let consider = (direction, elf) => {
        let axisIndex = direction[0] == 0 ? 0 : 1;
        for (let i = -1; i <= 1; i++) {
            let position = [...elf.position];
            position[0] += direction[0];
            position[1] += direction[1];
            position[axisIndex] += i;
            if (elves.find(e => e.position[0] == position[0] && e.position[1] == position[1])) {
                return false;
            }
        }

        return true;
    }

    let round = () => {
        let moves = [];
        elves.forEach(e => {
            if (!neighbours(e)) return;

            for (let i = 0; i < directions.length; i++) {
                let d = directions[(directionIndex + i) % directions.length];
                if (consider(d, e)) {
                    let proposal = [...e.position];
                    proposal[0] += d[0];
                    proposal[1] += d[1];
                    moves.push({ position: proposal, elf: e });
                    break;
                }
            }
        });

        moves.forEach(move => {
            if (moves.find(other => other != move && move.position[0] == other.position[0] && move.position[1] == other.position[1])) 
                return;

            move.elf.position = move.position;
        });

        directionIndex = (directionIndex + 1) % directions.length;
    };

    let print = (r) => {
        let grid = '';
        let minX = Math.min(...elves.map(e => e.position[0])) - 1;
        let maxX = Math.max(...elves.map(e => e.position[0])) + 1;
        let minY = Math.min(...elves.map(e => e.position[1])) - 1;
        let maxY = Math.max(...elves.map(e => e.position[1])) + 1;

        for (let j = minY; j <= maxY; j++) {
            for (let i = minX; i <= maxX; i++) {
                if (elves.find(e => e.position[0] == i && e.position[1] == j)) {
                    grid += '#';
                } else {
                    grid += '.';
                }
            }

            grid += '\r\n';
        }

        console.log(`Arrangement after ${r + 1} rounds`)
        console.log(grid);
    }

    for (let i = 0; i < roundNum; i++) {
        round();
        print(i);
    }

    let minX = Math.min(...elves.map(e => e.position[0]));
    let maxX = Math.max(...elves.map(e => e.position[0]));
    let minY = Math.min(...elves.map(e => e.position[1]));
    let maxY = Math.max(...elves.map(e => e.position[1]));

    let area = (maxX - minX + 1) * (maxY - minY + 1) - elves.length;
    terminal.textContent = `Total area after ${roundNum} rounds is ${area}`;
}
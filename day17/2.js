scripts.day17_2 = async () => {
    /** @type {string} */ 
    const data = (await getFile('day17/input.txt'));

    const width = 7;
    const fromLeft = 2;
    const clearance = 2;

    const point = (x = 0, y = 0) => {
        let p = { x, y, key: () => `${p.x},${p.y}` };
        return p;
    };

    const rocks = [
        '####',
        '.#.\r\n###\r\n.#.',
        '..#\r\n..#\r\n###',
        '#\r\n#\r\n#\r\n#',
        '##\r\n##'
    ].map(r => r.split('\r\n').map(l => l.split('')));

    const directions = {
        '<': -1,
        '>': 1
    };

    const gusts = data.split('').map(x => Number(directions[x]));

    let gustIndex = 0;
    let rockIndex = 0;
    let height = 0;
    const blocked = new Set();

    const hitTest = (p = point()) => {
        return blocked.has(`${p.x},${p.y}`) ||
            p.y < 0 ||
            p.x < 0 ||
            p.x >= 7;
    }

    const tryMove = (rock = [['']], p = point(), dx = 0, dy = 0) => {
        for (let j = 0; j < rock.length; j++) {
            for (let i = 0; i < rock[j].length; i++) {
                if (rock[j][i] == '.') continue;

                if (hitTest(point(p.x + i + dx, p.y - j + dy)))
                    return false;
            }
        }

        p.x += dx;
        p.y += dy;
        return true;
    }

    const block = (rock = [['']], p = point()) => {
        for (let j = 0; j < rock.length; j++) {
            for (let i = 0; i < rock[j].length; i++) {
                if (rock[j][i] == '.') continue;

                blocked.add(point(p.x + i, p.y - j).key());
                if (p.y + 1 > height) height = p.y + 1;
            }
        }
    }

    const dropRock = () => {
        let rock = rocks[rockIndex % rocks.length];
        let p = point(fromLeft, height + clearance + rock.length);
        while (true) {
            let dx = gusts[gustIndex];
            gustIndex = (gustIndex + 1) % gusts.length;
            
            tryMove(rock, p, dx, 0)
            if (!tryMove(rock, p, 0, -1)) {
                block(rock, p);
                return;
            }
        }
    }

    const findPattern = () => {
        const checkResolution = (h = 1) => {
            let start = cycles.length - h * 2;
            for (let i = start; i < start + h; i++) {
                if (cycles[i].height != cycles[i + h].height)
                    return false;
            }

            return true;
        }

        for (let h = 5; h <= cycles.length / 2; h++) {
            if (checkResolution(h)) return cycles.slice(cycles.length - h);
        }

        return [];
    }

    let dropLimit = 1000000000000;
    let dropped = 0;
    let cycles = [];
    let cyclePattern;
    while (true) {
        if (rockIndex == 0 && dropped > 0) {
            let dh = height - cycles.reduce((a,b) => a + b.height, 0);
            cycles.push({ height: dh, gustIndex });
            cyclePattern = findPattern();
            if (cyclePattern.length) break;
        } 

        dropRock();
        rockIndex = (rockIndex + 1) % rocks.length;
        dropped++;
    };

    let cycleHeight = cyclePattern.reduce((a,b) => a + b.height, 0);
    let cycleLength = cyclePattern.length;

    console.log(`Cycle height is ${cycleHeight}, cycleLength is ${cycleLength}`);
    let remainingCycles = Math.floor((dropLimit - dropped) / (cycleLength * rocks.length));

    dropped += remainingCycles * rocks.length * cycleLength;
    while (dropped < dropLimit) {
        dropRock();
        rockIndex = (rockIndex + 1) % rocks.length;
        dropped++;
    }

    height += remainingCycles * cycleHeight;
    terminal.textContent = `Height is ${height} after dropping ${dropLimit} rocks`;
}
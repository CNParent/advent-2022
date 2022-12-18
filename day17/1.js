scripts.day17_1 = async () => {
    /** @type {string} */ 
    const data = (await getFile('day17/small.txt'));

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
    let minHeight = 0;
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

    const setMinHeight = (h = 0) => {
        for (let j = minHeight; j < h; j++) {
            for (let i = 0; i < width; i++) {
                blocked.delete(`${j},${i}`);
            }
        }

        minHeight = h;
    }

    const block = (rock = [['']], p = point()) => {
        for (let j = 0; j < rock.length; j++) {
            for (let i = 0; i < rock[j].length; i++) {
                if (rock[j][i] == '.') continue;

                blocked.add(point(p.x + i, p.y - j).key());
                if (p.y + 1 > height) height = p.y + 1;
            }

            if ([...new Array(width)].filter((x, i) => blocked.has(`${i},${j}`)).length == 0) {
                setMinHeight(j);
            }
        }
    }

    const dropRock = () => {
        let rock = rocks[rockIndex % rocks.length];
        let p = point(fromLeft, height + clearance + rock.length);
        while (true) {
            let dx = gusts[gustIndex % gusts.length];
            gustIndex++;
            
            tryMove(rock, p, dx, 0)
            if (!tryMove(rock, p, 0, -1)) {
                block(rock, p);
                return;
            }
        }
    }

    let remaining = 2022;
    let start = new Date();
    while (remaining > 0) {
        dropRock();
        rockIndex++;
        remaining--;
        if (remaining % 100000 == 0) {
            let elapsed = (new Date() - start);
            console.log(`Height is ${height} with ${remaining} drops remaining (${elapsed} ms elapsed)`);
        }
    }

    terminal.textContent = `Height is ${height} after dropping 2022 rocks`;
}
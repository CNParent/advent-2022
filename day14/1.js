scripts.day14_1 = async () => {
    const walls = new Set();
    const sand = new Set();

    const point = (x = 0, y = 0) => {
        let p = { x, y };
        p.key = () => `${p.x},${p.y}`;
        p.options = () => [
            point(x, y + 1),
            point(x - 1, y + 1),
            point(x + 1, y + 1)
        ];

        return p;
    };

    const drawLine = (p1 = point(), p2 = point()) => {
        walls.add(p1.key());
        walls.add(p2.key());
        if (p1.y == p2.y) {
            let dx = p1.x < p2.x ? 1 : -1;
            let p = point(p1.x + dx, p1.y);
            while (p.x != p2.x) {
                walls.add(p.key());
                p.x += dx;
            }
        } else {
            let dy = p1.y < p2.y ? 1 : -1;
            let p = point(p1.x, p1.y + dy);
            while (p.y != p2.y) {
                walls.add(p.key());
                p.y += dy;
            }
        }
    };

    const origin = point(500, 0);

    /** @type {string} */ 
    let data = (await getFile('day14/input.txt'));
    let lines = data.split('\r\n').map(x => {
        let points = x.split(' -> ').map(p => {
            let values = p.split(',');
            return point(Number(values[0]), Number(values[1]));
        });

        let pairs = [];
        for (let i = 1; i < points.length; i++) {
            pairs.push({ p1: points[i - 1], p2: points[i] });
        }

        return pairs;
    }).reduce((a,b) => a.concat(b), []);

    const minY = Math.max(...lines.reduce((a,b) => a.concat([b.p1, b.p2]), []).map(p => p.y)) + 1;
    lines.forEach(l => drawLine(l.p1, l.p2));

    const dropSand = (p = point(origin.x, origin.y)) => {
        if (p.y == minY) return false;

        let options = p.options().filter(x => !walls.has(x.key()) && !sand.has(x.key()));
        if (options.length == 0) {
            sand.add(p.key());
        } else {
            return dropSand(options[0]);
        }

        return true;
    }

    while(dropSand());

    terminal.textContent = `The amount of sand supported by the cave system is ${sand.size} units`;
}
scripts.day15_2 = async () => {
    /** @type {string} */ 
    let data = (await getFile('day15/small.txt'));
    
    const point = (x = 0, y = 0) => ({ x, y, key: `${x},${y}` });
    const diamond = (center = point(), radius = 1) => {
        return {
            center, 
            radius,
            contains: (p = point()) => {
                return Math.abs(p.x - center.x) + Math.abs(p.y - center.y) <= radius;
            }
        }
    };

    const minimum = 0;
    const maximum = 20;
    const location = point();

    let scans = data.split('\r\n').map(line => {
        let values = line
            .replace('Sensor at ', '')
            .split(': closest beacon is at ')
            .map(v => v.split(', '));

        return {
            sensor: point(Number(values[0][0].split('=')[1]), Number(values[0][1].split('=')[1])),
            beacon: point(Number(values[1][0].split('=')[1]), Number(values[1][1].split('=')[1]))
        };
    });

    terminal.textContent = `Distress beacon is at [${location.x},${location.y}] with tuning frequency ${location.x * 4000000 + location.y}`;
}
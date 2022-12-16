scripts.day15_2 = async () => {
    /** @type {string} */ 
    let data = (await getFile('day15/input.txt'));
    
    const point = (x = 0, y = 0) => ({ x, y, key: `${x},${y}` });
    const line = (from = 0, to = 0) => {
        let range = {
            from: Math.min(from, to), 
            to: Math.max(from, to)
        };

        return {
            range,
            length: () => range.to - range.from + 1,
            has: (x = 0) => range.from < x && x < range.to,
            join: (other = line()) => {
                if (other.range.from > range.to || other.range.to < range.from) return false;
                
                let coords = [other.range.from, other.range.to, range.from, range.to];
                range.from = Math.min(...coords);
                range.to = Math.max(...coords);
                return true;
            }
        };
    };

    const minimum = 0;
    const maximum = 4000000;
    const location = point();

    const arrangeForY = (sensor = point(), beacon = point(), y = 0) => {
        let radius = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);
        if (sensor.y - radius > y || sensor.y + radius < y ) return null;

        let dy = Math.abs(y - sensor.y);
        let dx = radius - dy;
        let minX = sensor.x - dx;
        let maxX = sensor.x + dx;
        return line(Math.max(minX, minimum), Math.min(maxX, maximum));
    }

    const arrangeForX = (sensor = point(), beacon = point(), x = 0) => {
        let radius = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);
        if (sensor.x - radius > x || sensor.x + radius < x ) return null;

        let dx = Math.abs(x - sensor.x);
        let dy = radius - dx;
        let minY = sensor.y - dy;
        let maxY = sensor.y + dy;
        return line(Math.max(minY, minimum), Math.min(maxY, maximum));
    }

    const joinOne = (lines = [line()]) => {
        let tempLines = [...lines];
        for (let i = 0; i < lines.length; i++) {
            for (let j = i + 1; j < lines.length; j++) {
                if (lines[i].join(lines[j])) {
                    tempLines.splice(tempLines.indexOf(lines[j]), 1);
                    lines = tempLines;
                    return { lines: tempLines, joined: true };
                }
            }
        }

        return { lines, joined: false };
    }

    let scans = data.split('\r\n').map(x => {
        let values = x
            .replace('Sensor at ', '')
            .split(': closest beacon is at ')
            .map(v => v.split(', '));

        return {
            sensor: point(Number(values[0][0].split('=')[1]), Number(values[0][1].split('=')[1])),
            beacon: point(Number(values[1][0].split('=')[1]), Number(values[1][1].split('=')[1]))
        };
    });

    for(let i = minimum; i <= maximum; i++) {
        let lines = scans.map(scan => arrangeForY(scan.sensor, scan.beacon, i)).filter(l => l);
        while (true) {
            let result = joinOne(lines);
            if (!result.joined) break;

            lines = result.lines;
        }
        
        let total = lines.reduce((a,b) => a + b.length(), 0);
        if (i % 100000 == 0)
            console.log(`Ruled out ${total} locations at y = ${i}`);

        if (maximum == total) {
            location.y = i;
            break;
        }
    }


    for(let i = minimum; i <= maximum; i++) {
        let lines = scans.map(scan => arrangeForX(scan.sensor, scan.beacon, i)).filter(l => l);
        while (true) {
            let result = joinOne(lines);
            if (!result.joined) break;

            lines = result.lines;
        }
        
        let total = lines.reduce((a,b) => a + b.length(), 0);
        if (i % 100000 == 0)
            console.log(`Ruled out ${total} locations at x = ${i}`);

        if (maximum == total) {
            location.x = i;
            break;
        }
    }

    terminal.textContent = `Distress beacon is at [${location.x},${location.y}] with tuning frequency ${location.x * 4000000 + location.y}`;
}
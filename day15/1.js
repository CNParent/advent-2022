scripts.day15_1 = async () => {
    /** @type {string} */ 
    let data = (await getFile('day15/small.txt'));
    
    const checkHeight = 10;
    const point = (x = 0, y = 0) => ({ x, y, key: `${x},${y}` });
    const horizontalLine = (x1 = 0, x2 = 0) => {
        let range = {
            from: Math.min(x1, x2), 
            to: Math.max(x1, x2)
        };

        return {
            range,
            length: () => range.to - range.from + 1,
            has: (x = 0) => range.from < x && x < range.to,
            join: (other = horizontalLine()) => {
                if (other.range.from > range.to || other.range.to < range.from) return false;
                
                let coords = [other.range.from, other.range.to, range.from, range.to];
                range.from = Math.min(...coords);
                range.to = Math.max(...coords);
                return true;
            }
        };
    };

    const beacons = [];
    let lines = [];

    const arrange = (sensor = point(), beacon = point()) => {
        if (beacon.y == checkHeight && !beacons.includes(beacon.x)) {
            beacons.push(beacon.x);
        }

        let radius = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);
        if (sensor.y - radius > checkHeight || sensor.y + radius < checkHeight ) return;

        let j = checkHeight;
        let dy = Math.abs(j - sensor.y);
        let dx = radius - dy;
        let minX = sensor.x - dx;
        let maxX = sensor.x + dx;
        let l = horizontalLine(minX, maxX);
        lines.push(l);
    }

    const joinOne = () => {
        let tempLines = [...lines];
        for (let i = 0; i < lines.length; i++) {
            for (let j = i + 1; j < lines.length; j++) {
                if (lines[i].join(lines[j])) {
                    tempLines.splice(tempLines.indexOf(lines[j]), 1);
                    lines = tempLines;
                    return true;
                }
            }
        }

        return false;
    }

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

    scans.forEach(scan => arrange(scan.sensor, scan.beacon));

    while (joinOne());

    let total = lines.reduce((a,b) => a + b.length(), 0) - beacons.filter(b => lines.find(l => l.has(b))).length;
    terminal.textContent = `At y = ${checkHeight}: Sensors found ${total} positions that cannot contain a beacon`;
}
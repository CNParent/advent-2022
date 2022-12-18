scripts.day18_2 = async () => {
    /** @type {string} */ 
    const data = (await getFile('day18/input.txt'));
    const shape = new Set();
    const checked = new Set();

    const range = (min = 0, max = 0) => ({ min, max });
    const point = (x = 0, y = 0, z = 0) => ({ x, y, z, key: `${x},${y},${z}` });

    const faces = [
        point(1,0,0),
        point(-1,0,0),
        point(0,1,0),
        point(0,-1,0),
        point(0,0,1),
        point(0,0,-1)
    ];

    const outOfBounds = (cube = point()) => {
        return cube.x < extents.x.min || 
            cube.x > extents.x.max || 
            cube.y < extents.y.min || 
            cube.y > extents.y.max || 
            cube.z < extents.z.min || 
            cube.z > extents.z.max;
    };

    const surfaceArea = (cube = point()) => {
        if (outOfBounds(cube)) return 0;

        let area = 0;
        let checking = [cube];
        while(checking.length > 0) {
            cube = checking.splice(0, 1)[0];
            checked.add(cube.key);
            faces.forEach(f => {
                let p = point(cube.x + f.x, cube.y + f.y, cube.z + f.z);
                if (shape.has(p.key)) {
                    area++;
                    return;
                }

                if (outOfBounds(p) || checked.has(p.key) || checking.find(c => c.key == p.key)) return;

                checking.push(p);
            });
        }

        return area;
    };

    let cubes = data.split('\r\n').map(line => {
        let values = line.split(',');
        return point(Number(values[0]), Number(values[1]), Number(values[2]));
    });

    cubes.forEach(c => shape.add(c.key));

    let xVals = cubes.map(c => c.x);
    let yVals = cubes.map(c => c.y);
    let zVals = cubes.map(c => c.z);

    let extents = {
        x: range(Math.min(...xVals) - 1, Math.max(...xVals) + 1),
        y: range(Math.min(...yVals) - 1, Math.max(...yVals) + 1),
        z: range(Math.min(...zVals) - 1, Math.max(...zVals) + 1)
    };

    let start = point(extents.x.min, extents.y.min, extents.z.min);
    let totalArea = surfaceArea(start);
    terminal.textContent = `Total surface area is ${totalArea}`;
}
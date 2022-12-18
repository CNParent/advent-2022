scripts.day18_1 = async () => {
    /** @type {string} */ 
    const data = (await getFile('day18/3x3.txt'));
    const grid = new Set();

    const point = (x = 0, y = 0, z = 0) => ({ x, y, z });
    const faces = [
        point(1,0,0),
        point(-1,0,0),
        point(0,1,0),
        point(0,-1,0),
        point(0,0,1),
        point(0,0,-1)
    ];

    let cubes = data.split('\r\n').map(line => {
        let values = line.split(',');
        return point(Number(values[0]), Number(values[1]), Number(values[2]));
    });

    let surfaceArea = (c = point()) => {
        let sa = 0;
        faces.forEach(f => {
            if (!grid.has(`${c.x + f.x},${c.y + f.y},${c.z + f.z}`)) sa++;
        });

        return sa;
    };

    cubes.forEach(c => grid.add(`${c.x},${c.y},${c.z}`));
    
    let totalArea = cubes.reduce((a,b) => a + surfaceArea(b), 0);
    terminal.textContent = `Total surface area is ${totalArea}`;
}
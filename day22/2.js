scripts.day22_2 = async () => {
    /** @type {string} */ 
    const data = (await getFile('day22/input.txt'));
    const dataValues = data.split('\r\n\r\n');
    const mapData = dataValues[0];
    const instructionsData = dataValues[1].split('');
    const size = 50;
    const directions = { R: 1, L: -1 };
    const facings = ['right', 'down', 'left', 'up'];

    const rotationMatrices = {
        'x': [
            [ 1, 0, 0],
            [ 0, 0,-1],
            [ 0, 1, 0]
        ],
        '-x': [
            [ 1, 0, 0],
            [ 0, 0, 1],
            [ 0,-1, 0]
        ],
        'y': [
            [ 0, 0,-1],
            [ 0, 1, 0],
            [ 1, 0, 0]
        ],
        '-y': [
            [ 0, 0, 1],
            [ 0, 1, 0],
            [-1, 0, 0]
        ],
        'z': [
            [ 0,-1, 0],
            [ 1, 0, 0],
            [ 0, 0, 1]
        ],
        '-z': [
            [ 0, 1, 0],
            [-1, 0, 0],
            [ 0, 0, 1]
        ],
    };

    const tileTypes = {
        '#': 'wall',
        '.': 'empty'
    };

    let cube = (size) => {
        let points = [];
        for(let i = 0; i <= size + 1; i++) {
            for (let j = 0; j <= size + 1; j++) {
                for (let k = 0; k <= size + 1; k++) {
                    if (k == 0 || k == size + 1 || j == 0 || j == size + 1 || i == 0 || i == size + 1) {
                        points.push([i,j,k])
                    }
                }
            }
        }

        let model = { 
            points,
            x: () => model.extents(0),
            y: () => model.extents(1),
            z: () => model.extents(2),
            extents: (i) => ({
                min: Math.min(...model.points.map(p => p[i])),
                max: Math.max(...model.points.map(p => p[i]))
            }),
            move: (vector) => {
                model.points.forEach(p => {
                    let translated = translate(p, vector);
                    p[0] = translated[0];
                    p[1] = translated[1];
                    p[2] = translated[2];
                });

                tiles.forEach(t => {
                    if (!t.position) return;

                    let translated = translate(t.position, vector);
                    t.position[0] = translated[0];
                    t.position[1] = translated[1];
                    t.position[2] = translated[2];
                });
            },
            roll: (matrix) => {
                let origin = [model.x().min, model.y().min, model.z().min];
                model.points.forEach(p => {
                    let rotated = rotate(p, matrix);
                    p[0] = rotated[0];
                    p[1] = rotated[1];
                    p[2] = rotated[2];
                });

                tiles.forEach(t => {
                    if (!t.position) return;

                    let rotated = rotate(t.position, matrix);
                    t.position[0] = rotated[0];
                    t.position[1] = rotated[1];
                    t.position[2] = rotated[2];
                });

                let delta = [
                    origin[0] - model.x().min,
                    origin[1] - model.y().min,
                    origin[2] - model.z().min
                ];

                model.move(delta);
            },
            right: () => { model.roll(rotationMatrices['y']); model.move([size,0,0]); },
            left: () => { model.roll(rotationMatrices['-y']); model.move([-size,0,0]); },
            up: () => { model.roll(rotationMatrices['-x']); model.move([0,-size,0]); },
            down: () => { model.roll(rotationMatrices['x']); model.move([0,size,0]); }
        };

        return model;
    }

    let inBounds = (x, y) => tiles.find(t => t.x == x && t.y == y) != null;

    let getPointsOverTiles = () => {
        return model.points.filter(p => p[2] == 0 && 
            p[0] > model.x().min && p[0] < model.x().max &&
            p[1] > model.y().min && p[1] < model.y().max);
    } 

    let mapTiles = (before, after) => {
        if (before) model[before]();
        console.log(`Cube rolled ${before ?? ''} to [${model.x().min},${model.y().min},${model.z().min}]`);
        let points = getPointsOverTiles();
        points.forEach(p => {
            let tile = tiles.find(t => t.x == p[0] && t.y == p[1]);
            if (tile) tile.position = [...p];
        });

        let x = model.x();
        let y = model.y();
        if (after != 'right' && inBounds(x.max, y.max - 1)) mapTiles('right', 'left');
        if (after != 'down' && inBounds(x.max - 1, y.max)) mapTiles('down', 'up');
        if (after != 'left' && inBounds(x.min, y.min + 1)) mapTiles('left', 'right');
        if (after != 'up'&& inBounds(x.min + 1, y.min)) mapTiles('up', 'down');

        if (after) model[after]();
        console.log(`Cube rolled ${facings[(facings.indexOf(facing) + 2) % 4]} to [${model.x().min},${model.y().min},${model.z().min}]`);
    }

    let parseInstructions = () => {
        let results = [];
        let steps = '';
        let i = 0;
        while (i < instructionsData.length) {
            let c = instructionsData[i];
            if (!isNaN(parseInt(c))) {
                steps += c;
            } else {
                results.push({
                    steps: Number(steps),
                    direction: c
                });

                steps = '';
            }

            i++;
        }

        results.push({ steps: Number(steps), direction: null });
        return results;
    }

    let facing = facings[0];
    let current = null;
    let tiles = mapData.split('\r\n').map((row, j) => row.split('').map((c, i) => {
        if (c == ' ') return;
        let tile = { 
            x: i + 1, 
            y: j + 1, 
            type: tileTypes[c], 
            left: null, 
            right: null, 
            up: null, 
            down: null,
            position: null
        };

        if (current == null && tile.type == 'empty')
            current = tile;

        return tile;
    })).reduce((a,b) => a.concat(b), []).filter(t => t);

    let translate = (point, vector) => {
        let translated = [0,0,0];
        for (let i = 0; i < point.length; i++) {
            translated[i] = point[i] + vector[i];
        }

        return translated;
    }

    let rotate = (point, matrix) => {
        let transformed = [0,0,0];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                transformed[i] += point[j] * matrix[j][i];
            }
        }

        return transformed;
    }

    let turn = (dir) => {
        if (!dir) return facing;

        let i = facings.indexOf(facing);
        i += directions[dir];
        if (i < 0) i += facings.length;
        else if (i >= facings.length) i -= facings.length;

        facing = facings[i];

        let matrix = dir == 'L' ? rotationMatrices['z'] : rotationMatrices['-z'];
        heading = rotate(heading, matrix, [0,0,0]);
    }

    let getNext = () => {
        let p = translate(current.position, heading);
        console.log(`Looking for tile at at [${p[0]},${p[1]},0]`);
        return tiles.find(t => t.position[0] == p[0] && t.position[1] == p[1] && t.position[2] == 0);
    }
    
    let step = () => {
        let back = () => {};
        let next = getNext();
        if (!next) {
            console.log(`No tile found, rolling ${facing}`)
            if (facing == 'right') {
                back = model.left;
                model.right();
            } else if (facing == 'down') {
                back = model.up;
                model.down();
            } else if (facing == 'left') {
                back = model.right;
                model.left();
            } else if (facing == 'up') {
                back = model.down;
                model.up();
            }
        }

        next = getNext();
        if (next.type != 'empty') {
            console.log(`Ran into wall at [${next.x},${next.y}]`);
            back();
            return false;
        }

        current = next;
        return true;
    }

    let model = cube(size);
    terminal.textContent = `Created cube at [${model.x().min},${model.y().min},${model.z().min}]`;
    model.move([current.x - 1, current.y - 1, 0]);
    terminal.textContent += `\r\nMoved cube to [${model.x().min},${model.y().min},${model.z().min}]`;
    mapTiles();

    terminal.textContent += `\r\nMapped ${tiles.filter(t => t.position != null).length} tiles of ${tiles.length}`;
    let heading = [1,0,0];
    let instructions = parseInstructions();
    instructions.forEach(instruction => {
        for (let i = 0; i < instruction.steps; i++) {
            if (!step()) break;
        }

        turn(instruction.direction);
    });

    let forward = getNext();
    heading[0] = -heading[0];
    heading[1] = -heading[1];
    let back = getNext();
    let next = forward ?? back;
    let fIndex = 0;
    if (next.x > current.x) fIndex = 0;
    else if (next.y > current.y) fIndex = 1;
    else if (next.x < current.x) fIndex = 2;
    else if (next.y < current.y) fIndex = 3;

    if (back == next) fIndex += 2;

    fIndex %= 4;
    facing = facings[fIndex];
    terminal.textContent += `\r\nFinal position is [${current.x},${current.y}] facing ${facing}`;
    let password = 1000 * current.y + 4 * current.x + facings.indexOf(facing);
    terminal.textContent += `\r\nThe password is ${password}`;
}
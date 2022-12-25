scripts.day22_1 = async () => {
    /** @type {string} */ 
    const data = (await getFile('day22/input.txt'));
    const dataValues = data.split('\r\n\r\n');
    const mapData = dataValues[0];
    const instructionsData = dataValues[1].split('');

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

    const tileTypes = {
        ' ': 'warp',
        '#': 'wall',
        '.': 'empty'
    };

    const directions = { R: 1, L: -1 };
    const facings = ['right', 'down', 'left', 'up'];

    let facing = facings[0];
    let current = null;
    let tiles = mapData.split('\r\n').map((row, j) => row.split('').map((c, i) => {
        let tile = { 
            x: i + 1, 
            y: j + 1, 
            type: tileTypes[c], 
            left: null, 
            right: null, 
            up: null, 
            down: null 
        };

        if (current == null && tile.type == 'empty')
            current = tile;

        return tile;
    })).reduce((a,b) => a.concat(b), []);

    let turn = (dir) => {
        if (!dir) return facing;

        let i = facings.indexOf(facing);
        i += directions[dir];
        if (i < 0) i += facings.length;
        else if (i >= facings.length) i -= facings.length;

        facing = facings[i];
    }
    
    let getTile = (x, y) => {
        return tiles.find(other => x == other.x && y == other.y)
    }

    tiles.forEach(tile => {
        tile.up = getTile(tile.x, tile.y - 1);
        if (!tile.up || tile.up.type == 'warp') {
            let options = tiles.filter(other => other.type != 'warp' && other.x == tile.x);
            tile.up = options[options.length - 1];
        }

        if (tile.up.type == 'wall') tile.up = null;

        tile.right = getTile(tile.x + 1, tile.y);
        if (!tile.right || tile.right.type == 'warp') {
            let options = tiles.filter(other => other.type != 'warp' && other.y == tile.y);
            tile.right = options[0];
        }

        if (tile.right.type == 'wall') tile.right = null;

        tile.down = getTile(tile.x, tile.y + 1);
        if (!tile.down || tile.down.type == 'warp') {
            let options = tiles.filter(other => other.type != 'warp' && other.x == tile.x);
            tile.down = options[0];
        }

        if (tile.down.type == 'wall') tile.down = null;
        
        tile.left = getTile(tile.x - 1, tile.y);
        if (!tile.left || tile.left.type == 'warp') {
            let options = tiles.filter(other => other.type != 'warp' && other.y == tile.y);
            tile.left = options[options.length - 1];
        }

        if (tile.left.type == 'wall') tile.left = null;
    });

    let step = () => current = current[facing] == null ? current : current[facing];

    parseInstructions().forEach(instruction => {
        for (let i = 0; i < instruction.steps; i++) {
            step();
        }

        turn(instruction.direction);
    });

    let password = 1000 * current.y + 4 * current.x + facings.indexOf(facing);
    terminal.textContent = `The password is ${password}`;
}
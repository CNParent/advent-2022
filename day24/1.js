scripts.day24_1 = async () => {
    /** @type {string} */ 
    const data = (await getFile('day24/input.txt'));

    const simulated = new Set();
    const walls = new Set();
    const rows = data.split('\r\n');
    const xMin = 1;
    const yMin = 1;
    const xMax = rows[0].length - 2;
    const yMax = rows.length - 2;
    const end = [xMax, yMax + 1];

    const blizzardTypes = [
        { symbol: '^', direction: [ 0,-1], shouldWrap: (p) => p[1] < yMin, wrap: (p) => [p[0], yMax] },
        { symbol: 'v', direction: [ 0, 1], shouldWrap: (p) => p[1] > yMax, wrap: (p) => [p[0], yMin] },
        { symbol: '<', direction: [-1, 0], shouldWrap: (p) => p[0] < xMin, wrap: (p) => [xMax, p[1]] },
        { symbol: '>', direction: [ 1, 0], shouldWrap: (p) => p[0] > xMax, wrap: (p) => [xMin, p[1]] }
    ];

    const directions = [
        [ 0,-1],
        [ 0, 1],
        [-1, 0],
        [ 1, 0]
    ];

    let blizzardConfigurations = [{ set: new Set(), blizzards: [] }];
    rows.forEach((row, j) => row.split('').forEach((c,i) => {
        if (c == '#') walls.add(`${i},${j}`);
        else if (c != '.') {
            let type = blizzardTypes.find(bt => bt.symbol == c);
            blizzardConfigurations[0].blizzards.push({ type, position: [i,j] });
            blizzardConfigurations[0].set.add(`${i},${j}`);
        } 
    }));

    let addVector = (a,b) => a.map((v, i) => v + b[i]);
    let distance = (p) => end[0] - p[0] + end[1] - p[1];

    let getOptions = (p) => directions
        .map(d => addVector(p, d))
        .filter(p => !walls.has(`${p[0]},${p[1]}`) && p[1] > 0)
        .concat([[...p]]);

    let print = (option, cfgBlizzards) => {
        let output = '';
        for (let j = 0; j <= yMax + 1; j++) {
            for (let i = 0; i <= xMax + 1; i++) {
                if (option.position[0] == i && option.position[1] == j) output += 'X';
                else if (walls.has(`${i},${j}`)) output += '#';
                else {
                    let blizzards = cfgBlizzards.filter(b => b.position[0] == i && b.position[1] == j);
                    if (blizzards.length == 0) output += '.';
                    else if (blizzards.length > 1) output += `${blizzards.length}`;
                    else output += blizzards[0].type.symbol;
                }
            }

            output += '\r\n';
        }

        return output;
    }
    
    let simulateBlizzards = () => {
        let cfg = { blizzards: [], set: new Set() };
        blizzardConfigurations[blizzardConfigurations.length - 1].blizzards.forEach(blizzard => {
            let other = { position: addVector(blizzard.position, blizzard.type.direction), type: blizzard.type };
            if (other.type.shouldWrap(other.position)) {
                other.position = other.type.wrap(other.position);
            }
            
            cfg.blizzards.push(other);
            cfg.set.add(`${other.position[0]},${other.position[1]}`);
        });

        blizzardConfigurations.push(cfg);
    }

    let simulate = () => {
        let position = [1, 0];
        let options = getOptions(position).map(p => ({ round: 0, position: p, log: '' }));
        let maxRounds = 0;
        let solution = null;
        while (true) {
            if (options.length == 0) return solution;

            let option = options.splice(0, 1)[0];
            if (simulated.has(`${option.position[0]},${option.position[1]},${option.round}`)) continue;

            simulated.add(`${option.position[0]},${option.position[1]},${option.round}`);
            if (simulated.size % 10000 == 0) {
                let d = distance(option.position);
                console.log(`Simuated ${simulated.size} options, distance is ${d}`);
            }

            option.round += 1;
            let cfg = blizzardConfigurations[option.round];
            if (!cfg) {
                let d = distance(option.position);
                console.log(`Simulating for ${blizzardConfigurations.length} maximum rounds, currently ${d} units away from end`);
                simulateBlizzards();
                cfg = blizzardConfigurations[option.round];
            }

            if (cfg.set.has(`${option.position[0]},${option.position[1]}`)) continue;

            ////option.log += `\r\n\r\nRound ${option.round}:\r\n${print(option, cfg.blizzards)}`;
            if (option.position[1] == yMax + 1) {
                maxRounds = option.round;
                solution = option;
                console.log(`Solution found after ${maxRounds} rounds. Evaluating ${options.length} remaining options.`);
                continue;
            }

            if (maxRounds && option.round >= maxRounds) continue;

            options = options.concat(getOptions(option.position)
                .map(p => ({ 
                    round: option.round, 
                    position: p, 
                    log: option.log 
            })));

            options.sort((a,b) => distance(a.position) - distance(b.position));
        }
    }

    let plan = simulate();
    console.log(plan.log);
    terminal.textContent = `Fewest number of minutes required to avoid blizzards is ${plan.round}`;
}
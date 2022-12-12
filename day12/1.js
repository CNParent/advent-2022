scripts.day12_1 = async () => {
    const heights = 'abcdefghijklmnopqrstuvwxyz';
    const node = (x = 0, y = 0) => ({ options: [], height: 0, x, y, distance: 0, solved: false });

    /** @type {string} */ 
    let data = (await getFile('day12/input.txt'));
    let map = { start: node(), end: node() };
    let nodes = data.split('\r\n').map((x, j) => x.split('').map((y, i) => {
        let n = node(i, j);
        map[`${i},${j}`] = n;
        if (y == 'S') {
            n.height = heights.indexOf('a');
            map.start = n;
        } else if (y == 'E') {
            n.height = heights.indexOf('z');
            n.solved = true;
            n.distance = 0;
            map.end = n;
        } else {
            n.height = heights.indexOf(y)
        }

        return n;
    }));

    let test = (from, to) => to && to.height <= from.height + 1;

    for(let j = 0; j < nodes.length; j++) {
        for(let i = 0; i < nodes[j].length; i++) {
            let n = nodes[j][i];            
            let u = map[`${i},${j-1}`];
            let d = map[`${i},${j+1}`];
            let l = map[`${i-1},${j}`];
            let r = map[`${i+1},${j}`];
            if (test(n, u)) n.options.push(u);
            if (test(n, d)) n.options.push(d);
            if (test(n, l)) n.options.push(l);
            if (test(n, r)) n.options.push(r);
        }
    }

    let calculateDistances = (here = map.end) => {
        let solvedOptions = here.options.filter(o => o.solved);
        if (solvedOptions.length == 0) return;

        here.solved = true;
        here.distance = Math.min(...solvedOptions.map(o => o.distance)) + 1;
    };
    
    let allNodes = nodes.reduce((a,b) => a.concat(b), []);
    while(allNodes.find(n => !n.solved && n.options.find(o => o.solved))) {
        allNodes.filter(n => !n.solved).forEach(n => calculateDistances(n));
    }

    terminal.textContent = `Minimum steps from start is ${map.start.distance}`;
}
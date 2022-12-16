scripts.day16_1 = async () => {
    /** @type {string} */ 
    let data = (await getFile('day16/input.txt'));

    const timeLimit = 30;
    const valve = (id = '', rate = 0, paths = ['']) => ({ id, rate, paths, timeToOpen: 0, distances: {} });

    let valves = data.split('\r\n').map(x => {
        let values = x.replace('Valve ', '')
            .replace(' has flow rate=', ';')
            .replace(' tunnels lead to valves ', '')
            .replace(' tunnel leads to valve ', '')
            .split(';');

        return valve(values[0], Number(values[1]), values[2].split(', '));
    });

    const calcTimeToOpenFrom = (to = valve(), visited = [], time = 0) => {
        if (visited.includes(to)) return;

        visited.push(to);
        time += 1;
        if (to.timeToOpen == 0 || to.timeToOpen > time) {
            to.timeToOpen = time;
        }

        to.paths.forEach(p => calcTimeToOpenFrom(valves.find(v => v.id == p), [...visited], time));
    }

    const calculate = (start, current, remaining, totalFlow = 0, timeLeft = timeLimit) => {
        timeLeft -= start.distances[current.id];
        if (timeLeft < 0) return totalFlow;

        totalFlow += timeLeft * current.rate;
        if (remaining.length == 0 || timeLeft == 0) return totalFlow;

        return Math.max(...remaining.map(fv => calculate(current, fv, remaining.filter(x => x != fv), totalFlow, timeLeft)));
    };

    let aa = valves.find(v => v.id == 'AA');
    let flowValves = valves.filter(v => v.rate > 0);

    valves.forEach(v => {
        calcTimeToOpenFrom(v);
        valves.forEach(o => v.distances[o.id] = o.timeToOpen);
        valves.forEach(o => o.timeToOpen = 0);
    });

    let results = flowValves.map(fv => calculate(aa, fv, flowValves.filter(x => x != fv)));
    let max = Math.max(...results);
    terminal.textContent = `Maximum pressure relieved in 30 minutes is ${max}`;
}
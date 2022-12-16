scripts.day16_2 = async () => {
    /** @type {string} */ 
    let data = (await getFile('day16/input.txt'));

    const timeLimit = 26;
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

    let iterations = 0;
    const calculate = (s1, s2, target, remaining, totalFlow = 0, t1 = timeLimit, t2 = timeLimit) => {
        iterations++;
        let start;
        if (t1 > t2) {
            start = 'a';
            t1 -= s1.distances[target.id];
            if (t1 < 0) return totalFlow;
    
            totalFlow += t1 * target.rate;
        } else {
            start = 'b';
            t2 -= s2.distances[target.id]
            if (t2 < 0) return totalFlow;
    
            totalFlow += t2 * target.rate;
        }

        if (t1 == 0 && t2 == 0 || remaining.length == 0) return totalFlow;

        return Math.max(...remaining.map(fv => calculate(
            start == 'a' ? target : s1, 
            start == 'b' ? target : s2,
            fv, 
            remaining.filter(x => x != fv), 
            totalFlow, 
            t1, 
            t2)));
    };

    let aa = valves.find(v => v.id == 'AA');
    let flowValves = valves.filter(v => v.rate > 0);

    valves.forEach(v => {
        calcTimeToOpenFrom(v);
        valves.forEach(o => v.distances[o.id] = o.timeToOpen);
        valves.forEach(o => o.timeToOpen = 0);
    });

    let results = flowValves.map(fv => calculate(aa, aa, fv, flowValves.filter(x => x != fv)));
    let max = Math.max(...results);
    terminal.textContent = `Maximum pressure relieved in ${timeLimit} minutes with the help of your elephant is ${max} - ${iterations} calls to calculate()`;
}
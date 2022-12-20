scripts.day19_2 = async () => {
    /** @type {string} */ 
    const data = (await getFile('day19/input.txt'));

    const timeLimit = 32;

    const resourceTypes = ['geode', 'obsidian', 'clay', 'ore'];
    const prerequisites = { ore: 'ore', clay: 'ore', obsidian: 'clay', geode: 'obsidian' };

    const Resources = (args = { ore: 0, clay: 0, obsidian: 0, geode: 0 }) => ({
        ore: args.ore,
        clay: args.clay,
        obsidian: args.obsidian,
        geode: args.geode
    });

    const Blueprint = (raw = '') => {
        let values = raw.split(' ');
        let blueprint = {
            id: Number(values[1].replace(':', '')),
            ore: Resources({ ore: Number(values[6]), clay: 0, obsidian: 0, geode: 0 }),
            clay: Resources({ ore: Number(values[12]), clay: 0, obsidian: 0, geode: 0 }),
            obsidian: Resources({ ore: Number(values[18]), clay: Number(values[21]), obsidian: 0, geode: 0 }),
            geode: Resources({ ore: Number(values[27]), clay: 0, obsidian: Number(values[30]), geode: 0 }),
            maxRobots: Resources()
        };

        for (let key in blueprint.maxRobots) {
            blueprint.maxRobots[key] = Math.max(...resourceTypes.map(t => blueprint[t][key]));
        }

        blueprint.maxRobots.geode = timeLimit;
        return blueprint;
    };

    const Simulation = (args = { robots: Resources(), stores: Resources() }) => ({
        robots: args.robots,
        stores: args.stores,
        timeLeft: timeLimit
    });

    const compare = (a = Resources(), b = Resources()) => {
        return a.clay <= b.clay && 
            a.geode <= b.geode &&
            a.obsidian <= b.obsidian &&
            a.ore <= b.ore;
    }

    const getOptions = (blueprint = Blueprint(), simulation = Simulation()) => {

        const buy = (resourceType = '') => {
            let s = Simulation({ robots: Resources(simulation.robots), stores: Resources(simulation.stores) });
            s.timeLeft = simulation.timeLeft;
            while (!compare(blueprint[resourceType], s.stores)) {
                resourceTypes.forEach(t => s.stores[t] += s.robots[t]);
                s.timeLeft--;
            }

            resourceTypes.forEach(t => s.stores[t] -= blueprint[resourceType][t]);
            resourceTypes.forEach(t => s.stores[t] += s.robots[t]);
            s.robots[resourceType]++;
            s.timeLeft--;

            if (s.timeLeft < 0) return null;
            return s;
        };

        return resourceTypes.filter(t => simulation.robots[prerequisites[t]] > 0)
            .map(t => buy(t))
            .filter(o => o);
    };

    const getQuality = (blueprint = Blueprint()) => {
        let sims = [Simulation()]
        sims[0].robots.ore = 1;

        let maxGeodes = 0;
        while (sims.length > 0) {
            let simulation = sims.splice(0, 1)[0];
            let maximumGeodesPossible = simulation.stores.geode + (simulation.robots.geode * simulation.timeLeft) + (simulation.timeLeft * simulation.timeLeft / 2);
            if (maxGeodes >= maximumGeodesPossible) continue;

            let options = getOptions(blueprint, simulation);
            if (options.length == 0) {
                while (simulation.timeLeft > 0) {
                    resourceTypes.forEach(t => simulation.stores[t] += simulation.robots[t]);
                    simulation.timeLeft--;
                }

                if (simulation.stores.geode > maxGeodes) maxGeodes = simulation.stores.geode;
            } else {
                sims = sims.concat(options);
                sims.sort((a,b) => a.timeLeft - b.timeLeft);
            }
        }

        console.log(`Maximum geodes cracked for blueprint ${blueprint.id} is ${maxGeodes}`);
        return maxGeodes;
    };

    let blueprints = data.split('\r\n').map(Blueprint);
    let scores = blueprints.slice(0, 3).map(getQuality);
    let total = scores.reduce((a,b) => a * b, 1);
    terminal.textContent = `Product of maximum geodes cracked for first three blueprints is ${total}`;
}